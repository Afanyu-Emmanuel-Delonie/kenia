package com.auca.zyra.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Public-facing store listing for an activated Kernia bag.
 * A product must be activated before it can be listed for sale.
 */
@Entity
@Table(name = "store_listings")
@Getter
@Setter
@NoArgsConstructor
public class StoreListing {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "product_id", nullable = false, unique = true)
  private Product product;

  @Column(nullable = false)
  private String title;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(nullable = false, precision = 12, scale = 2)
  private BigDecimal price;

  /** Currency code, e.g. "USD", "RWF". */
  @Column(nullable = false, length = 3)
  private String currency;

  /** Comma-separated relative paths to product images. */
  @Column(columnDefinition = "TEXT")
  private String imagePaths;

  @Column(nullable = false)
  private boolean available = true;

  @Column(nullable = false, updatable = false)
  private Instant listedAt = Instant.now();
}
