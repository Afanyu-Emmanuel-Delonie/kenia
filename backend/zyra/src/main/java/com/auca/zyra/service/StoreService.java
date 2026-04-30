package com.auca.zyra.service;

import com.auca.zyra.domain.Product;
import com.auca.zyra.domain.StoreListing;
import com.auca.zyra.dto.StoreDto.*;
import com.auca.zyra.exception.ResourceNotFoundException;
import com.auca.zyra.repository.ProductRepository;
import com.auca.zyra.repository.StoreListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/** Manages the public-facing product store catalog. */
@Service
@RequiredArgsConstructor
public class StoreService {

  private final StoreListingRepository listingRepository;
  private final ProductRepository productRepository;

  @Value("${app.upload.dir:uploads}")
  private String uploadDir;

  @Transactional
  public ListingResponse createListing(CreateListingRequest req) {
    Product product = productRepository.findById(req.productId())
        .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + req.productId()));

    if (!product.isActivated()) {
      throw new IllegalStateException("Only activated products can be listed for sale");
    }
    if (listingRepository.existsByProductId(req.productId())) {
      throw new IllegalStateException("A listing already exists for this product");
    }

    StoreListing listing = new StoreListing();
    listing.setProduct(product);
    listing.setTitle(req.title());
    listing.setDescription(req.description());
    listing.setPrice(req.price());
    listing.setCurrency(req.currency());
    return toResponse(listingRepository.save(listing));
  }

  @Transactional
  public ListingResponse updateListing(Long id, UpdateListingRequest req) {
    StoreListing listing = findListing(id);
    if (req.title() != null) listing.setTitle(req.title());
    if (req.description() != null) listing.setDescription(req.description());
    if (req.price() != null) listing.setPrice(req.price());
    if (req.currency() != null) listing.setCurrency(req.currency());
    if (req.available() != null) listing.setAvailable(req.available());
    return toResponse(listingRepository.save(listing));
  }

  @Transactional
  public ListingResponse uploadImage(Long id, MultipartFile file) throws IOException {
    StoreListing listing = findListing(id);
    Path dir = Paths.get(uploadDir, "store");
    Files.createDirectories(dir);
    String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
    file.transferTo(dir.resolve(filename));

    String existing = listing.getImagePaths();
    listing.setImagePaths(existing == null ? filename : existing + "," + filename);
    return toResponse(listingRepository.save(listing));
  }

  @Transactional
  public void deleteListing(Long id) {
    if (!listingRepository.existsById(id)) {
      throw new ResourceNotFoundException("Listing not found: " + id);
    }
    listingRepository.deleteById(id);
  }

  // ── Public queries (no auth required) ────────────────────────────────────

  @Transactional(readOnly = true)
  public List<ListingResponse> getAvailableListings() {
    return listingRepository.findByAvailableTrue().stream().map(this::toResponse).toList();
  }

  @Transactional(readOnly = true)
  public List<ListingResponse> getAllListings() {
    return listingRepository.findAll().stream().map(this::toResponse).toList();
  }

  @Transactional(readOnly = true)
  public ListingResponse getListing(Long id) {
    return toResponse(findListing(id));
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private StoreListing findListing(Long id) {
    return listingRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Listing not found: " + id));
  }

  private ListingResponse toResponse(StoreListing l) {
    List<String> images = (l.getImagePaths() == null || l.getImagePaths().isBlank())
        ? List.of()
        : Arrays.asList(l.getImagePaths().split(","));
    return new ListingResponse(
        l.getId(),
        l.getProduct().getId(),
        l.getProduct().getSku(),
        l.getTitle(),
        l.getDescription(),
        l.getPrice(),
        l.getCurrency(),
        images,
        l.isAvailable(),
        l.getListedAt());
  }
}
