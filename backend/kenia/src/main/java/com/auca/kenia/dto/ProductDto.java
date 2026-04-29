package com.auca.kenia.dto;

import com.auca.kenia.domain.ProductStage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/** Data Transfer Objects for product workflow and registry endpoints. */
public final class ProductDto {

  private ProductDto() {}

  public record CreateRequest(
      @NotBlank String name,
      @NotBlank String atelierSite) {}

  public record SignStageRequest(
      String notes) {}

  public record ActivateRequest(
      @NotBlank String otp) {}

  public record TransferRequest(
      @NotBlank String holderName,
      @NotBlank String holderType,
      String notes) {}

  public record StageLogResponse(
      Long id,
      ProductStage stage,
      String signedBy,
      Instant signedAt,
      String notes) {}

  public record OwnershipResponse(
      Long id,
      String holderName,
      String holderType,
      Instant transferredAt,
      String notes) {}

  public record ProductResponse(
      Long id,
      String sku,
      String name,
      String atelierSite,
      ProductStage currentStage,
      boolean activated,
      String qaPhotoPath,
      BigDecimal materialCost,
      Instant createdAt,
      Instant completedAt,
      List<StageLogResponse> stageLogs,
      List<OwnershipResponse> ownershipHistory) {}
}
