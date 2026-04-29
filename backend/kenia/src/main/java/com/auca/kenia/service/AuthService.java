package com.auca.kenia.service;

import com.auca.kenia.domain.User;
import com.auca.kenia.dto.AuthDto.LoginRequest;
import com.auca.kenia.dto.AuthDto.RegisterRequest;
import com.auca.kenia.dto.AuthDto.TokenResponse;
import com.auca.kenia.repository.UserRepository;
import com.auca.kenia.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Handles user registration and JWT-based login. */
@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authManager;
  private final JwtUtil jwtUtil;

  /** Registers a new user. Throws if the email is already taken. */
  @Transactional
  public TokenResponse register(RegisterRequest req) {
    if (userRepository.existsByEmail(req.email())) {
      throw new IllegalStateException("Email already registered: " + req.email());
    }
    User user = new User();
    user.setEmail(req.email());
    user.setPassword(passwordEncoder.encode(req.password()));
    user.setFullName(req.fullName());
    user.setRole(req.role());
    userRepository.save(user);
    return buildTokenResponse(user);
  }

  /** Authenticates credentials and returns a JWT. */
  public TokenResponse login(LoginRequest req) {
    Authentication auth = authManager.authenticate(
        new UsernamePasswordAuthenticationToken(req.email(), req.password()));
    User user = (User) auth.getPrincipal();
    return buildTokenResponse(user);
  }

  private TokenResponse buildTokenResponse(User user) {
    return new TokenResponse(
        jwtUtil.generateToken(user),
        user.getEmail(),
        user.getRole().name(),
        user.getFullName());
  }
}
