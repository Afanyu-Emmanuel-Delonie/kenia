package com.auca.kenia.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

/**
 * Tracks the ownership chain of a bag (boutique or client).
 * Supports the Ownership History requirement of the Product Registry.
 */
@Entity
@Table(name = "ownership_records")
@Getter
@Setter
@NoArgsConstructor
public class OwnershipRecord {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "product_id", nullable = false)
  private Product product;

  /** Name of the boutique or client receiving the bag. */
  @Column(nullable = false)
  private String holderName;

  /** "BOUTIQUE" or "CLIENT". */
  @Column(nullable = false)
  private String holderType;

  @Column(nullable = false, updatable = false)
  private Instant transferredAt = Instant.now();

  private String notes;
}
