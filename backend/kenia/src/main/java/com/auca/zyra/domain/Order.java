package com.auca.zyra.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Represents a customer order for a Kernia bag.
 * Captures buyer identity, delivery details, and order lifecycle status.
 */
@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** Auto-generated human-readable reference, e.g. ORD-20260001. */
  @Column(nullable = false, unique = true)
  private String reference;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "listing_id", nullable = false)
  private StoreListing listing;

  // ── Customer information ──────────────────────────────────────────────────

  @Column(nullable = false)
  private String customerName;

  @Column(nullable = false)
  private String customerEmail;

  @Column(nullable = false)
  private String customerPhone;

  // ── Delivery information ──────────────────────────────────────────────────

  /** "DELIVERY" or "PICKUP". */
  @Column(nullable = false)
  private String deliveryMethod;

  private String deliveryAddress;
  private String deliveryCity;
  private String deliveryCountry;
  private String postalCode;

  /** Special instructions from the customer. */
  @Column(columnDefinition = "TEXT")
  private String notes;

  // ── Financials ────────────────────────────────────────────────────────────

  @Column(nullable = false, precision = 12, scale = 2)
  private BigDecimal totalAmount;

  @Column(nullable = false, length = 3)
  private String currency;

  // ── Status ────────────────────────────────────────────────────────────────

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private OrderStatus status = OrderStatus.PENDING;

  @Column(nullable = false, updatable = false)
  private Instant placedAt = Instant.now();

  private Instant updatedAt;

  @PreUpdate
  void onUpdate() {
    this.updatedAt = Instant.now();
  }
}
