package com.auca.zyra.controller;

import com.auca.zyra.dto.DashboardDto.DashboardResponse;
import com.auca.zyra.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Provides the Intelligence Dashboard (Bento Overview) for managers. */
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard")
public class DashboardController {

  private final DashboardService dashboardService;

  @GetMapping
  @Operation(summary = "Get the full dashboard snapshot: velocity, atelier load, material health")
  public DashboardResponse getDashboard() {
    return dashboardService.getDashboard();
  }
}
