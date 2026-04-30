package com.auca.zyra.controller;

import com.auca.zyra.dto.AuthDto.LoginRequest;
import com.auca.zyra.dto.AuthDto.RegisterRequest;
import com.auca.zyra.dto.AuthDto.TokenResponse;
import com.auca.zyra.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/** Handles user registration and authentication. */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthController {

  private final AuthService authService;

  @PostMapping("/register")
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Register a new user")
  public TokenResponse register(@Valid @RequestBody RegisterRequest req) {
    return authService.register(req);
  }

  @PostMapping("/login")
  @Operation(summary = "Login and receive a JWT")
  public TokenResponse login(@Valid @RequestBody LoginRequest req) {
    return authService.login(req);
  }
}
