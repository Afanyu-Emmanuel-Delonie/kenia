package com.auca.kenia.repository;

import com.auca.kenia.domain.Order;
import com.auca.kenia.domain.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

/** Repository Pattern: abstracts all Order persistence operations. */
public interface OrderRepository extends JpaRepository<Order, Long> {

  Optional<Order> findByReference(String reference);

  List<Order> findByStatus(OrderStatus status);

  List<Order> findByCustomerEmailOrderByPlacedAtDesc(String email);

  @Query("SELECT MAX(o.reference) FROM Order o WHERE o.reference LIKE :prefix%")
  Optional<String> findMaxReferenceByPrefix(String prefix);
}
