package com.auca.zyra.security;

import com.auca.zyra.config.AppProperties;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/** Handles JWT generation and validation. Stateless — no DB calls. */
@Component
@RequiredArgsConstructor
public class JwtUtil {

  private final AppProperties props;

  private SecretKey signingKey() {
    return Keys.hmacShaKeyFor(props.getSecret().getBytes(StandardCharsets.UTF_8));
  }

  /** Generates a signed JWT for the given user. */
  public String generateToken(UserDetails user) {
    long now = System.currentTimeMillis();
    return Jwts.builder()
        .subject(user.getUsername())
        .claim("role", user.getAuthorities().iterator().next().getAuthority())
        .issuedAt(new Date(now))
        .expiration(new Date(now + props.getExpirationMs()))
        .signWith(signingKey())
        .compact();
  }

  /** Extracts the subject (email) from a valid token. */
  public String extractEmail(String token) {
    return Jwts.parser()
        .verifyWith(signingKey())
        .build()
        .parseSignedClaims(token)
        .getPayload()
        .getSubject();
  }

  /** Returns true if the token is valid and not expired. */
  public boolean isValid(String token) {
    try {
      Jwts.parser().verifyWith(signingKey()).build().parseSignedClaims(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }
}
