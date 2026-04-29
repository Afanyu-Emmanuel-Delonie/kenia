package com.auca.kenia.repository;

import com.auca.kenia.domain.Product;
import com.auca.kenia.domain.ProductStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/** Repository Pattern: abstracts all Product persistence operations. */
public interface ProductRepository extends JpaRepository<Product, Long> {

  Optional<Product> findBySku(String sku);

  List<Product> findByCurrentStage(ProductStage stage);

  List<Product> findByAtelierSite(String atelierSite);

  /** Counts bags completed (ARCHIVE_READY) per week for the velocity chart. */
  @Query("""
      SELECT CAST(p.completedAt AS date), COUNT(p)
      FROM Product p
      WHERE p.completedAt >= :since AND p.currentStage = 'ARCHIVE_READY'
      GROUP BY CAST(p.completedAt AS date)
      ORDER BY CAST(p.completedAt AS date)
      """)
  List<Object[]> countCompletedPerDay(@Param("since") Instant since);

  /** Counts bags per atelier site for the load bar chart. */
  @Query("SELECT p.atelierSite, COUNT(p) FROM Product p GROUP BY p.atelierSite")
  List<Object[]> countByAtelierSite();

  /** Finds the highest sequential number for a given year prefix (e.g. KRN-2026-). */
  @Query("SELECT MAX(p.sku) FROM Product p WHERE p.sku LIKE :prefix%")
  Optional<String> findMaxSkuByPrefix(@Param("prefix") String prefix);
}
