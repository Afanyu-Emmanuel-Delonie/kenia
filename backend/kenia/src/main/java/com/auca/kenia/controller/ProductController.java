package com.auca.kenia.controller;

import com.auca.kenia.dto.ProductDto.*;
import com.auca.kenia.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/** Manages the artisan workflow (Digital Workbench) and product registry (Digital Twin). */
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Tag(name = "Products")
public class ProductController {

  private final ProductService productService;

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Create a new product and generate its SKU")
  public ProductResponse create(@Valid @RequestBody CreateRequest req) {
    return productService.createProduct(req);
  }

  @GetMapping
  @Operation(summary = "List all products")
  public List<ProductResponse> list() {
    return productService.getAllProducts();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get a single product with its full history")
  public ProductResponse get(@PathVariable Long id) {
    return productService.getProduct(id);
  }

  @PostMapping("/{id}/sign")
  @Operation(summary = "Artisan digitally signs the current stage, advancing to the next")
  public ProductResponse signStage(
      @PathVariable Long id,
      @RequestBody(required = false) SignStageRequest req) {
    return productService.signStage(id, req != null ? req : new SignStageRequest(null));
  }

  @PostMapping(value = "/{id}/qa-photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Upload QA photo evidence (mobile-optimized)")
  public ProductResponse uploadQaPhoto(
      @PathVariable Long id,
      @RequestParam("file") MultipartFile file) throws IOException {
    return productService.uploadQaPhoto(id, file);
  }

  @PostMapping("/{id}/activation-otp")
  @Operation(summary = "Generate an OTP to activate the product after final inspection")
  public String generateOtp(@PathVariable Long id) {
    return productService.generateActivationOtp(id);
  }

  @PostMapping("/{id}/activate")
  @Operation(summary = "Activate the product using the OTP")
  public ProductResponse activate(
      @PathVariable Long id,
      @Valid @RequestBody ActivateRequest req) {
    return productService.activateProduct(id, req);
  }

  @PostMapping("/{id}/transfer")
  @Operation(summary = "Transfer ownership to a boutique or client")
  public ProductResponse transfer(
      @PathVariable Long id,
      @Valid @RequestBody TransferRequest req) {
    return productService.transferOwnership(id, req);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @Operation(summary = "Delete a product permanently")
  public void delete(@PathVariable Long id) {
    productService.deleteProduct(id);
  }
}
