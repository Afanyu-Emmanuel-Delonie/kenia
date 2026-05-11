package com.auca.zyra.service;

import com.auca.zyra.domain.OrderStatus;
import com.auca.zyra.domain.ProductStage;
import com.auca.zyra.dto.DashboardDto.*;
import com.auca.zyra.repository.MaterialRepository;
import com.auca.zyra.repository.OrderRepository;
import com.auca.zyra.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

  private final ProductRepository  productRepository;
  private final MaterialRepository materialRepository;
  private final OrderRepository    orderRepository;

  @Transactional(readOnly = true)
  public DashboardResponse getDashboard() {
    return new DashboardResponse(
        buildVelocityMap(),
        buildAtelierLoadMap(),
        buildMaterialHealth(),
        buildRecentProducts(),
        buildOrderSummary(),
        countActive(),
        countArchived());
  }

  private Map<String, Long> buildVelocityMap() {
    Instant since = Instant.now().minus(30, ChronoUnit.DAYS);
    Map<String, Long> map = new LinkedHashMap<>();
    for (Object[] row : productRepository.countCompletedPerDay(since)) {
      map.put(row[0].toString(), ((Number) row[1]).longValue());
    }
    return map;
  }

  private Map<String, Long> buildAtelierLoadMap() {
    return productRepository.countByAtelierSite().stream()
        .collect(Collectors.toMap(
            r -> (String) r[0],
            r -> ((Number) r[1]).longValue(),
            (a, b) -> a,
            LinkedHashMap::new));
  }

  private List<MaterialHealth> buildMaterialHealth() {
    return materialRepository.findAll().stream()
        .map(m -> {
          BigDecimal stock     = m.getStockQuantity();
          BigDecimal threshold = m.getLowStockThreshold();
          String status;
          if (stock.compareTo(threshold) <= 0) {
            status = "RED";
          } else if (stock.compareTo(threshold.multiply(BigDecimal.TWO)) <= 0) {
            status = "YELLOW";
          } else {
            status = "GREEN";
          }
          return new MaterialHealth(m.getId(), m.getName(), status,
              m.getStockQuantity().toPlainString(), m.getUnit());
        })
        .toList();
  }

  private List<RecentProduct> buildRecentProducts() {
    return productRepository.findAll().stream()
        .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
        .limit(6)
        .map(p -> new RecentProduct(
            p.getId(), p.getSku(), p.getName(),
            p.getCurrentStage().name(), p.getAtelierSite()))
        .toList();
  }

  private OrderSummary buildOrderSummary() {
    List<com.auca.zyra.domain.Order> all = orderRepository.findAll();
    return new OrderSummary(
        all.size(),
        all.stream().filter(o -> o.getStatus() == OrderStatus.PENDING).count(),
        all.stream().filter(o -> o.getStatus() == OrderStatus.CONFIRMED).count(),
        all.stream().filter(o -> o.getStatus() == OrderStatus.SHIPPED).count(),
        all.stream().filter(o -> o.getStatus() == OrderStatus.DELIVERED).count());
  }

  private long countActive() {
    return productRepository.findAll().stream()
        .filter(p -> p.getCurrentStage() != ProductStage.ARCHIVE_READY).count();
  }

  private long countArchived() {
    return productRepository.findByCurrentStage(ProductStage.ARCHIVE_READY).size();
  }
}
