package com.auca.zyra.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

/** DTOs for customer inquiries. */
public final class InquiryDto {

    private InquiryDto() {
    }

    public record SubmitInquiryRequest(
            Long listingId,
            @NotBlank String senderName,
            @NotBlank @Email String senderEmail,
            String senderPhone,
            @NotBlank String message) {
    }

    public record ReplyRequest(
            @NotBlank String reply) {
    }

    public record InquiryResponse(
            Long id,
            Long listingId,
            String productTitle,
            String senderName,
            String senderEmail,
            String senderPhone,
            String message,
            String reply,
            String status,
            Instant submittedAt,
            Instant repliedAt) {
    }
}
