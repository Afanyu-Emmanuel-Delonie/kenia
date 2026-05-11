package com.auca.zyra.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Represents a raw material in the Vault (e.g. "Obsidian Leather", "Antique Gold Hardware").
 * Tracks stock levels, provenance, and unit cost for automatic bag costing.
 */
@Entity
@Table(name = "materials")
@Getter
@Setter
@NoArgsConstructor
public class Material {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String name;

  /** e.g. "LEATHER", "HARDWARE", "LINING" */
  @Column(nullable = false)
  private String category;

  /** Current stock quantity. */
  @Column(nullable = false, precision = 12, scale = 3)
  private BigDecimal stockQuantity;

  /** Unit of measure: "meters", "pieces", "kg". */
  @Column(nullable = false)
  private String unit;

  /** Alert fires when stockQuantity falls at or below this value. */
  @Column(nullable = false, precision = 12, scale = 3)
  private BigDecimal lowStockThreshold;

  /** Cost per unit for bag material costing. */
  @Column(nullable = false, precision = 12, scale = 4)
  private BigDecimal unitCost;

  /** Tannery or supplier name / QR reference. */
  private String provenance;

  @Column(nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  private Instant updatedAt;

  @PreUpdate
  void onUpdate() {
    this.updatedAt = Instant.now();
  }

  /** Returns true when stock is at or below the low-stock threshold. */
  public boolean isLowStock() {
    return stockQuantity.compareTo(lowStockThreshold) <= 0;
  }
}
