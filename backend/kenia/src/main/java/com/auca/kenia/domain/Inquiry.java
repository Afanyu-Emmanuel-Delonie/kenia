package com.auca.kenia.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

/**
 * A customer inquiry about a specific store listing.
 * Can be submitted without an account (public endpoint).
 */
@Entity
@Table(name = "inquiries")
@Getter
@Setter
@NoArgsConstructor
public class Inquiry {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "listing_id", nullable = false)
  private StoreListing listing;

  @Column(nullable = false)
  private String senderName;

  @Column(nullable = false)
  private String senderEmail;

  private String senderPhone;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String message;

  /** Staff reply to the inquiry. */
  @Column(columnDefinition = "TEXT")
  private String reply;

  private Instant repliedAt;

  /** "OPEN" or "CLOSED". */
  @Column(nullable = false)
  private String status = "OPEN";

  @Column(nullable = false, updatable = false)
  private Instant submittedAt = Instant.now();
}
