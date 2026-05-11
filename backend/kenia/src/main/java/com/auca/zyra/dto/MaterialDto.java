package com.auca.zyra.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;

/** Data Transfer Objects for material inventory (Vault) endpoints. */
public final class MaterialDto {

  private MaterialDto() {}

  public record CreateRequest(
      @NotBlank String name,
      @NotBlank String category,
      @NotNull @DecimalMin("0.0") BigDecimal stockQuantity,
      @NotBlank String unit,
      @NotNull @DecimalMin("0.0") BigDecimal lowStockThreshold,
      @NotNull @DecimalMin("0.0") BigDecimal unitCost,
      String provenance) {}

  public record UpdateStockRequest(
      @NotNull BigDecimal quantity,
      @NotBlank String operation) {} // "ADD" or "SUBTRACT"

  public record MaterialResponse(
      Long id,
      String name,
      String category,
      BigDecimal stockQuantity,
      String unit,
      BigDecimal lowStockThreshold,
      BigDecimal unitCost,
      String provenance,
      boolean lowStock,
      Instant updatedAt) {}
}
