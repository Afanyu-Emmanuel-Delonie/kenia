package com.auca.kenia.controller;

import com.auca.kenia.dto.StoreDto.*;
import com.auca.kenia.service.StoreService;
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

/** Public store catalog and admin listing management. */
@RestController
@RequestMapping("/store")
@RequiredArgsConstructor
@Tag(name = "Store (Public Catalog)")
public class StoreController {

  private final StoreService storeService;

  // ── Public endpoints (no auth) ────────────────────────────────────────────

  @GetMapping
  @Operation(summary = "List all available bags for sale (public)")
  public List<ListingResponse> getAvailable() {
    return storeService.getAvailableListings();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get a single listing detail (public)")
  public ListingResponse get(@PathVariable Long id) {
    return storeService.getListing(id);
  }

  // ── Admin / Manager endpoints ─────────────────────────────────────────────

  @GetMapping("/all")
  @Operation(summary = "List all listings including unavailable ones (staff)")
  public List<ListingResponse> getAll() {
    return storeService.getAllListings();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Create a store listing for an activated product (admin)")
  public ListingResponse create(@Valid @RequestBody CreateListingRequest req) {
    return storeService.createListing(req);
  }

  @PutMapping("/{id}")
  @Operation(summary = "Update listing details or availability (admin)")
  public ListingResponse update(
      @PathVariable Long id,
      @RequestBody UpdateListingRequest req) {
    return storeService.updateListing(id, req);
  }

  @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Upload a product image to the listing (admin)")
  public ListingResponse uploadImage(
      @PathVariable Long id,
      @RequestParam("file") MultipartFile file) throws IOException {
    return storeService.uploadImage(id, file);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @Operation(summary = "Delete a store listing (admin)")
  public void delete(@PathVariable Long id) {
    storeService.deleteListing(id);
  }
}
