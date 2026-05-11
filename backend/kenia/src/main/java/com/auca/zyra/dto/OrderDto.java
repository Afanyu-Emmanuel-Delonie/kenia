package com.auca.zyra.dto;

import com.auca.zyra.domain.OrderStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;
import java.time.Instant;

/** DTOs for customer orders. */
public final class OrderDto {

  private OrderDto() {}

  public record PlaceOrderRequest(
      @NotNull Long listingId,

      // Customer info
      @NotBlank String customerName,
      @NotBlank @Email String customerEmail,
      @NotBlank String customerPhone,

      // Delivery info
      @NotBlank @Pattern(regexp = "DELIVERY|PICKUP") String deliveryMethod,
      String deliveryAddress,
      String deliveryCity,
      String deliveryCountry,
      String postalCode,
      String notes) {}

  public record UpdateStatusRequest(
      @NotNull OrderStatus status) {}

  public record OrderResponse(
      Long id,
      String reference,
      String sku,
      String productTitle,
      String customerName,
      String customerEmail,
      String customerPhone,
      String deliveryMethod,
      String deliveryAddress,
      String deliveryCity,
      String deliveryCountry,
      String postalCode,
      String notes,
      BigDecimal totalAmount,
      String currency,
      OrderStatus status,
      Instant placedAt,
      Instant updatedAt) {}
}
