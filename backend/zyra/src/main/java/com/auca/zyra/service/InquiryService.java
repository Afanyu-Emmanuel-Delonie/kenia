package com.auca.zyra.service;

import com.auca.zyra.domain.Inquiry;
import com.auca.zyra.domain.StoreListing;
import com.auca.zyra.dto.InquiryDto.*;
import com.auca.zyra.exception.ResourceNotFoundException;
import com.auca.zyra.repository.InquiryRepository;
import com.auca.zyra.repository.StoreListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

/** Handles customer inquiries about store listings. */
@Service
@RequiredArgsConstructor
public class InquiryService {

  private final InquiryRepository inquiryRepository;
  private final StoreListingRepository listingRepository;

  /** Public — no authentication required. */
  @Transactional
  public InquiryResponse submitInquiry(SubmitInquiryRequest req) {
    StoreListing listing = listingRepository.findById(req.listingId())
        .orElseThrow(() -> new ResourceNotFoundException("Listing not found: " + req.listingId()));

    Inquiry inquiry = new Inquiry();
    inquiry.setListing(listing);
    inquiry.setSenderName(req.senderName());
    inquiry.setSenderEmail(req.senderEmail());
    inquiry.setSenderPhone(req.senderPhone());
    inquiry.setMessage(req.message());
    return toResponse(inquiryRepository.save(inquiry));
  }

  /** Staff replies to an inquiry and closes it. */
  @Transactional
  public InquiryResponse replyToInquiry(Long id, ReplyRequest req) {
    Inquiry inquiry = findInquiry(id);
    inquiry.setReply(req.reply());
    inquiry.setRepliedAt(Instant.now());
    inquiry.setStatus("CLOSED");
    return toResponse(inquiryRepository.save(inquiry));
  }

  @Transactional(readOnly = true)
  public List<InquiryResponse> getInquiriesForListing(Long listingId) {
    return inquiryRepository.findByListingIdOrderBySubmittedAtDesc(listingId)
        .stream().map(this::toResponse).toList();
  }

  @Transactional(readOnly = true)
  public List<InquiryResponse> getOpenInquiries() {
    return inquiryRepository.findByStatusOrderBySubmittedAtDesc("OPEN")
        .stream().map(this::toResponse).toList();
  }

  @Transactional(readOnly = true)
  public List<InquiryResponse> getAllInquiries() {
    return inquiryRepository.findAll().stream().map(this::toResponse).toList();
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  @Transactional
  public void deleteInquiry(Long id) {
    if (!inquiryRepository.existsById(id)) {
      throw new ResourceNotFoundException("Inquiry not found: " + id);
    }
    inquiryRepository.deleteById(id);
  }

  private Inquiry findInquiry(Long id) {
    return inquiryRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found: " + id));
  }

  private InquiryResponse toResponse(Inquiry i) {
    return new InquiryResponse(
        i.getId(),
        i.getListing().getId(),
        i.getListing().getTitle(),
        i.getSenderName(),
        i.getSenderEmail(),
        i.getSenderPhone(),
        i.getMessage(),
        i.getReply(),
        i.getStatus(),
        i.getSubmittedAt(),
        i.getRepliedAt());
  }
}
