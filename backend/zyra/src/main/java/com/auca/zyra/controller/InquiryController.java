package com.auca.zyra.controller;

import com.auca.zyra.dto.InquiryDto.*;
import com.auca.zyra.service.InquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Customer inquiry submission and staff reply management. */
@RestController
@RequestMapping("/inquiries")
@RequiredArgsConstructor
@Tag(name = "Inquiries")
public class InquiryController {

  private final InquiryService inquiryService;

  // ── Public endpoints (no auth) ────────────────────────────────────────────

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Submit an inquiry about a bag (public — customer facing)")
  public InquiryResponse submit(@Valid @RequestBody SubmitInquiryRequest req) {
    return inquiryService.submitInquiry(req);
  }

  // ── Staff endpoints ───────────────────────────────────────────────────────

  @GetMapping
  @Operation(summary = "List all inquiries (staff)")
  public List<InquiryResponse> list() {
    return inquiryService.getAllInquiries();
  }

  @GetMapping("/open")
  @Operation(summary = "List all open (unanswered) inquiries (staff)")
  public List<InquiryResponse> open() {
    return inquiryService.getOpenInquiries();
  }

  @GetMapping("/listing/{listingId}")
  @Operation(summary = "Get all inquiries for a specific listing (staff)")
  public List<InquiryResponse> byListing(@PathVariable Long listingId) {
    return inquiryService.getInquiriesForListing(listingId);
  }

  @PostMapping("/{id}/reply")
  @Operation(summary = "Reply to an inquiry and close it (staff)")
  public InquiryResponse reply(
      @PathVariable Long id,
      @Valid @RequestBody ReplyRequest req) {
    return inquiryService.replyToInquiry(id, req);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @Operation(summary = "Delete an inquiry (staff)")
  public void delete(@PathVariable Long id) {
    inquiryService.deleteInquiry(id);
  }
}
