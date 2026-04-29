package com.auca.kenia.repository;

import com.auca.kenia.domain.OwnershipRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/** Repository Pattern: abstracts all OwnershipRecord persistence operations. */
public interface OwnershipRecordRepository extends JpaRepository<OwnershipRecord, Long> {

  List<OwnershipRecord> findByProductIdOrderByTransferredAtDesc(Long productId);
}
