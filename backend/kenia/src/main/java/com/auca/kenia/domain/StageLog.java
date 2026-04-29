package com.auca.kenia.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

/**
 * Immutable audit record created when an artisan digitally signs a production stage.
 * Implements the Digital Signature requirement.
 */
@Entity
@Table(name = "stage_logs")
@Getter
@Setter
@NoArgsConstructor
public class StageLog {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "product_id", nullable = false)
  private Product product;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "signed_by_id", nullable = false)
  private User signedBy;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ProductStage stage;

  @Column(nullable = false, updatable = false)
  private Instant signedAt = Instant.now();

  private String notes;
}
