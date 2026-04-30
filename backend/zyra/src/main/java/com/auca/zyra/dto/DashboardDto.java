package com.auca.zyra.dto;

import java.util.List;
import java.util.Map;

/** Data Transfer Object for the Intelligence Dashboard (Bento Overview). */
public final class DashboardDto {

  private DashboardDto() {}

  public record MaterialHealth(
      Long id, String name, String status, String stockQuantity, String unit) {}

  public record RecentProduct(
      Long id, String sku, String name, String currentStage, String atelierSite) {}

  public record OrderSummary(
      long totalOrders, long pendingOrders, long confirmedOrders,
      long shippedOrders, long deliveredOrders) {}

  public record DashboardResponse(
      Map<String, Long> velocityByDay,
      Map<String, Long> loadByAtelier,
      List<MaterialHealth> materialHealth,
      List<RecentProduct> recentProducts,
      OrderSummary orderSummary,
      long totalActive,
      long totalArchived) {}
}
