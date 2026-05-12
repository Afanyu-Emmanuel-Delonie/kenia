package com.auca.zyra.controller;

import java.time.Instant;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Lightweight public endpoint for uptime checks and keepalive pings. */
@RestController
@RequestMapping("/health")
public class HealthController {

  @GetMapping
  public ResponseEntity<Map<String, Object>> health() {
    return ResponseEntity.ok(
        Map.of(
            "status", "ok",
            "service", "zyra-backend",
            "timestamp", Instant.now().toString()));
  }
}
