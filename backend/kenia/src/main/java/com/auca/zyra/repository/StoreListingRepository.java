package com.auca.zyra.repository;

import com.auca.zyra.domain.StoreListing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/** Repository Pattern: abstracts all StoreListing persistence operations. */
public interface StoreListingRepository extends JpaRepository<StoreListing, Long> {

  List<StoreListing> findByAvailableTrue();

  Optional<StoreListing> findByProductId(Long productId);

  boolean existsByProductId(Long productId);
}
