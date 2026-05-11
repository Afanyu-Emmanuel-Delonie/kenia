package com.auca.zyra.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a single Kernia bag from creation through archival.
 * Implements the Digital Twin concept — one record per physical bag.
 */
@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** Auto-generated SKU, e.g. KRN-2026-001. */
  @Column(nullable = false, unique = true)
  private String sku;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String atelierSite;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ProductStage currentStage = ProductStage.CUTTING;

  /** Set to true only after QA passes final inspection (OTP activation). */
  @Column(nullable = false)
  private boolean activated = false;

  /** OTP used for final activation; cleared after use. */
  private String activationOtp;

  /** Path to the QA photo uploaded by the artisan. */
  private String qaPhotoPath;

  /** Calculated material cost for this bag. */
  @Column(precision = 12, scale = 2)
  private BigDecimal materialCost;

  @Column(nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  private Instant completedAt;

  @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<StageLog> stageLogs = new ArrayList<>();

  @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OwnershipRecord> ownershipHistory = new ArrayList<>();
}
