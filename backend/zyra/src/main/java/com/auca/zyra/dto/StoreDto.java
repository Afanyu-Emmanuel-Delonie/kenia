package com.auca.zyra.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/** DTOs for the public store catalog (StoreListing). */
public final class StoreDto {

  private StoreDto() {}

  public record CreateListingRequest(
      @NotNull Long productId,
      @NotBlank String title,
      String description,
      @NotNull @DecimalMin("0.01") BigDecimal price,
      @NotBlank @Size(min = 3, max = 3) String currency) {}

  public record UpdateListingRequest(
      String title,
      String description,
      BigDecimal price,
      String currency,
      Boolean available) {}

  public record ListingResponse(
      Long id,
      Long productId,
      String sku,
      String title,
      String description,
      BigDecimal price,
      String currency,
      List<String> images,
      boolean available,
      Instant listedAt) {}
}
