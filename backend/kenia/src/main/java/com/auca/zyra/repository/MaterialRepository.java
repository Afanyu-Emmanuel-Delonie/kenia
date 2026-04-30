package com.auca.zyra.repository;

import com.auca.zyra.domain.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/** Repository Pattern: abstracts all Material persistence operations. */
public interface MaterialRepository extends JpaRepository<Material, Long> {

  /** Returns all materials whose stock is at or below their threshold. */
  @Query("SELECT m FROM Material m WHERE m.stockQuantity <= m.lowStockThreshold")
  List<Material> findLowStockMaterials();

  boolean existsByName(String name);
}
