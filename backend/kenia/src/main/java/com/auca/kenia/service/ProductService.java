package com.auca.kenia.service;

import com.auca.kenia.domain.*;
import com.auca.kenia.dto.ProductDto.*;
import com.auca.kenia.exception.ResourceNotFoundException;
import com.auca.kenia.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.Year;
import java.util.List;
import java.util.UUID;

/** Orchestrates the artisan workflow and product registry operations. */
@Service
@RequiredArgsConstructor
public class ProductService {

  private final ProductRepository productRepository;
  private final StageLogRepository stageLogRepository;
  private final OwnershipRecordRepository ownershipRepository;
  private final UserRepository userRepository;

  @Value("${app.upload.dir:uploads}")
  private String uploadDir;

  // ── Product creation ──────────────────────────────────────────────────────

  @Transactional
  public ProductResponse createProduct(CreateRequest req) {
    Product product = new Product();
    product.setName(req.name());
    product.setAtelierSite(req.atelierSite());
    product.setSku(generateSku());
    productRepository.save(product);
    return toResponse(product);
  }

  // ── Stage signing (Digital Signature) ────────────────────────────────────

  /**
   * Advances the product to the next stage and records the artisan's digital signature.
   * Stage order: CUTTING → STITCHING → HARDWARE → QA → ARCHIVE_READY
   */
  @Transactional
  public ProductResponse signStage(Long productId, SignStageRequest req) {
    Product product = findProduct(productId);
    ProductStage nextStage = nextStage(product.getCurrentStage());

    StageLog log = new StageLog();
    log.setProduct(product);
    log.setSignedBy(currentUser());
    log.setStage(product.getCurrentStage());
    log.setNotes(req.notes());
    stageLogRepository.save(log);

    product.setCurrentStage(nextStage);
    if (nextStage == ProductStage.ARCHIVE_READY) {
      product.setCompletedAt(Instant.now());
    }
    return toResponse(productRepository.save(product));
  }

  // ── QA Photo upload ───────────────────────────────────────────────────────

  @Transactional
  public ProductResponse uploadQaPhoto(Long productId, MultipartFile file) throws IOException {
    Product product = findProduct(productId);
    if (product.getCurrentStage() != ProductStage.QA) {
      throw new IllegalStateException("Photo upload is only allowed at the QA stage");
    }
    Path dir = Paths.get(uploadDir);
    Files.createDirectories(dir);
    String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
    file.transferTo(dir.resolve(filename));
    product.setQaPhotoPath(filename);
    return toResponse(productRepository.save(product));
  }

  // ── OTP Activation ────────────────────────────────────────────────────────

  /** Generates and stores a one-time activation OTP for the product. */
  @Transactional
  public String generateActivationOtp(Long productId) {
    Product product = findProduct(productId);
    if (product.getCurrentStage() != ProductStage.ARCHIVE_READY) {
      throw new IllegalStateException("Product must complete QA before activation");
    }
    String otp = String.format("%06d", (int) (Math.random() * 1_000_000));
    product.setActivationOtp(otp);
    productRepository.save(product);
    return otp; // In production: send via email/SMS, never return in response
  }

  /** Activates the product if the OTP matches. Clears the OTP after use. */
  @Transactional
  public ProductResponse activateProduct(Long productId, ActivateRequest req) {
    Product product = findProduct(productId);
    if (product.isActivated()) {
      throw new IllegalStateException("Product is already activated");
    }
    if (!req.otp().equals(product.getActivationOtp())) {
      throw new IllegalArgumentException("Invalid activation OTP");
    }
    product.setActivated(true);
    product.setActivationOtp(null);
    return toResponse(productRepository.save(product));
  }

  // ── Ownership transfer ────────────────────────────────────────────────────

  @Transactional
  public ProductResponse transferOwnership(Long productId, TransferRequest req) {
    Product product = findProduct(productId);
    if (!product.isActivated()) {
      throw new IllegalStateException("Only activated products can be transferred");
    }
    OwnershipRecord record = new OwnershipRecord();
    record.setProduct(product);
    record.setHolderName(req.holderName());
    record.setHolderType(req.holderType());
    record.setNotes(req.notes());
    ownershipRepository.save(record);
    return toResponse(product);
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  @Transactional(readOnly = true)
  public ProductResponse getProduct(Long id) {
    return toResponse(findProduct(id));
  }

  @Transactional(readOnly = true)
  public List<ProductResponse> getAllProducts() {
    return productRepository.findAll().stream().map(this::toResponse).toList();
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private Product findProduct(Long id) {
    return productRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
  }

  private User currentUser() {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
  }

  /**
   * Generates a unique SKU in the format KRN-YYYY-NNN.
   * Uses the Repository Pattern to find the current max SKU for the year.
   */
  private String generateSku() {
    String year = String.valueOf(Year.now().getValue());
    String prefix = "KRN-" + year + "-";
    return productRepository.findMaxSkuByPrefix(prefix)
        .map(max -> {
          int seq = Integer.parseInt(max.substring(max.lastIndexOf('-') + 1)) + 1;
          return String.format("%s%03d", prefix, seq);
        })
        .orElse(prefix + "001");
  }

  private ProductStage nextStage(ProductStage current) {
    return switch (current) {
      case CUTTING -> ProductStage.STITCHING;
      case STITCHING -> ProductStage.HARDWARE;
      case HARDWARE -> ProductStage.QA;
      case QA -> ProductStage.ARCHIVE_READY;
      case ARCHIVE_READY -> throw new IllegalStateException("Product is already archive-ready");
    };
  }

  private ProductResponse toResponse(Product p) {
    List<StageLogResponse> logs = stageLogRepository
        .findByProductIdOrderBySignedAtAsc(p.getId()).stream()
        .map(l -> new StageLogResponse(
            l.getId(), l.getStage(),
            l.getSignedBy().getFullName(), l.getSignedAt(), l.getNotes()))
        .toList();

    List<OwnershipResponse> ownership = ownershipRepository
        .findByProductIdOrderByTransferredAtDesc(p.getId()).stream()
        .map(o -> new OwnershipResponse(
            o.getId(), o.getHolderName(), o.getHolderType(),
            o.getTransferredAt(), o.getNotes()))
        .toList();

    return new ProductResponse(
        p.getId(), p.getSku(), p.getName(), p.getAtelierSite(),
        p.getCurrentStage(), p.isActivated(), p.getQaPhotoPath(),
        p.getMaterialCost(), p.getCreatedAt(), p.getCompletedAt(),
        logs, ownership);
  }
}
