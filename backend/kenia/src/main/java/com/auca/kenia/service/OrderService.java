package com.auca.kenia.service;

import com.auca.kenia.domain.Order;
import com.auca.kenia.domain.OrderStatus;
import com.auca.kenia.domain.StoreListing;
import com.auca.kenia.dto.OrderDto.*;
import com.auca.kenia.exception.ResourceNotFoundException;
import com.auca.kenia.repository.OrderRepository;
import com.auca.kenia.repository.StoreListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;

/** Handles customer order placement and lifecycle management. */
@Service
@RequiredArgsConstructor
public class OrderService {

  private final OrderRepository orderRepository;
  private final StoreListingRepository listingRepository;

  @Transactional
  public OrderResponse placeOrder(PlaceOrderRequest req) {
    StoreListing listing = listingRepository.findById(req.listingId())
        .orElseThrow(() -> new ResourceNotFoundException("Listing not found: " + req.listingId()));

    if (!listing.isAvailable()) {
      throw new IllegalStateException("This bag is no longer available for purchase");
    }

    Order order = new Order();
    order.setReference(generateReference());
    order.setListing(listing);
    order.setCustomerName(req.customerName());
    order.setCustomerEmail(req.customerEmail());
    order.setCustomerPhone(req.customerPhone());
    order.setDeliveryMethod(req.deliveryMethod());
    order.setDeliveryAddress(req.deliveryAddress());
    order.setDeliveryCity(req.deliveryCity());
    order.setDeliveryCountry(req.deliveryCountry());
    order.setPostalCode(req.postalCode());
    order.setNotes(req.notes());
    order.setTotalAmount(listing.getPrice());
    order.setCurrency(listing.getCurrency());

    return toResponse(orderRepository.save(order));
  }

  /** Staff updates the order status. Marks listing unavailable when confirmed. */
  @Transactional
  public OrderResponse updateStatus(Long id, UpdateStatusRequest req) {
    Order order = findOrder(id);
    order.setStatus(req.status());

    // Once confirmed, mark the listing as sold (unavailable)
    if (req.status() == OrderStatus.CONFIRMED) {
      order.getListing().setAvailable(false);
      listingRepository.save(order.getListing());
    }
    // If cancelled, re-open the listing
    if (req.status() == OrderStatus.CANCELLED) {
      order.getListing().setAvailable(true);
      listingRepository.save(order.getListing());
    }
    return toResponse(orderRepository.save(order));
  }

  @Transactional(readOnly = true)
  public OrderResponse getOrder(Long id) {
    return toResponse(findOrder(id));
  }

  @Transactional(readOnly = true)
  public OrderResponse getOrderByReference(String reference) {
    return toResponse(orderRepository.findByReference(reference)
        .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + reference)));
  }

  @Transactional(readOnly = true)
  public List<OrderResponse> getAllOrders() {
    return orderRepository.findAll().stream().map(this::toResponse).toList();
  }

  @Transactional(readOnly = true)
  public List<OrderResponse> getOrdersByStatus(OrderStatus status) {
    return orderRepository.findByStatus(status).stream().map(this::toResponse).toList();
  }

  @Transactional(readOnly = true)
  public List<OrderResponse> getOrdersByEmail(String email) {
    return orderRepository.findByCustomerEmailOrderByPlacedAtDesc(email)
        .stream().map(this::toResponse).toList();
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private Order findOrder(Long id) {
    return orderRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
  }

  /** Generates a reference like ORD-2026-0001. */
  private String generateReference() {
    String prefix = "ORD-" + Year.now().getValue() + "-";
    return orderRepository.findMaxReferenceByPrefix(prefix)
        .map(max -> {
          int seq = Integer.parseInt(max.substring(max.lastIndexOf('-') + 1)) + 1;
          return String.format("%s%04d", prefix, seq);
        })
        .orElse(prefix + "0001");
  }

  private OrderResponse toResponse(Order o) {
    return new OrderResponse(
        o.getId(),
        o.getReference(),
        o.getListing().getProduct().getSku(),
        o.getListing().getTitle(),
        o.getCustomerName(),
        o.getCustomerEmail(),
        o.getCustomerPhone(),
        o.getDeliveryMethod(),
        o.getDeliveryAddress(),
        o.getDeliveryCity(),
        o.getDeliveryCountry(),
        o.getPostalCode(),
        o.getNotes(),
        o.getTotalAmount(),
        o.getCurrency(),
        o.getStatus(),
        o.getPlacedAt(),
        o.getUpdatedAt());
  }
}
