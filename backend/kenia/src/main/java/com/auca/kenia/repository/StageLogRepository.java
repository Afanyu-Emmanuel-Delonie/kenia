package com.auca.kenia.repository;

import com.auca.kenia.domain.StageLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/** Repository Pattern: abstracts all StageLog persistence operations. */
public interface StageLogRepository extends JpaRepository<StageLog, Long> {

  List<StageLog> findByProductIdOrderBySignedAtAsc(Long productId);
}
