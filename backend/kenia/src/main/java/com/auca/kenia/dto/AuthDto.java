package com.auca.kenia.dto;

import com.auca.kenia.domain.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Data Transfer Objects for authentication endpoints. */
public final class AuthDto {

  private AuthDto() {}

  public record RegisterRequest(
      @NotBlank @Email String email,
      @NotBlank @Size(min = 8) String password,
      @NotBlank String fullName,
      @NotNull Role role) {}

  public record LoginRequest(
      @NotBlank @Email String email,
      @NotBlank String password) {}

  public record TokenResponse(
      String token,
      String email,
      String role,
      String fullName) {}
}
