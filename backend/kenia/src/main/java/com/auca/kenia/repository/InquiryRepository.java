package com.auca.kenia.repository;

import com.auca.kenia.domain.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/** Repository Pattern: abstracts all Inquiry persistence operations. */
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

  List<Inquiry> findByListingIdOrderBySubmittedAtDesc(Long listingId);

  List<Inquiry> findByStatusOrderBySubmittedAtDesc(String status);

  List<Inquiry> findBySenderEmailOrderBySubmittedAtDesc(String email);
}
