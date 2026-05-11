package com.auca.zyra.controller;

import com.auca.zyra.domain.OrderStatus;
import com.auca.zyra.dto.OrderDto.*;
import com.auca.zyra.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Customer order placement and staff order management. */
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "Orders")
public class OrderController {

  private final OrderService orderService;

  // ── Public endpoints (no auth) ────────────────────────────────────────────

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Place an order for a bag (public — customer facing)")
  public OrderResponse placeOrder(@Valid @RequestBody PlaceOrderRequest req) {
    return orderService.placeOrder(req);
  }

  @GetMapping("/track/{reference}")
  @Operation(summary = "Track an order by reference number (public)")
  public OrderResponse track(@PathVariable String reference) {
    return orderService.getOrderByReference(reference);
  }

  @GetMapping("/my")
  @Operation(summary = "Get all orders for a customer email (public)")
  public List<OrderResponse> myOrders(@RequestParam String email) {
    return orderService.getOrdersByEmail(email);
  }

  // ── Staff endpoints ───────────────────────────────────────────────────────

  @GetMapping
  @Operation(summary = "List all orders (staff)")
  public List<OrderResponse> list() {
    return orderService.getAllOrders();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get a single order (staff)")
  public OrderResponse get(@PathVariable Long id) {
    return orderService.getOrder(id);
  }

  @GetMapping("/status/{status}")
  @Operation(summary = "Filter orders by status (staff)")
  public List<OrderResponse> byStatus(@PathVariable OrderStatus status) {
    return orderService.getOrdersByStatus(status);
  }

  @PatchMapping("/{id}/status")
  @Operation(summary = "Update order status — CONFIRMED marks the bag as sold (staff)")
  public OrderResponse updateStatus(
      @PathVariable Long id,
      @Valid @RequestBody UpdateStatusRequest req) {
    return orderService.updateStatus(id, req);
  }
}
