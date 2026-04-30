package com.auca.zyra.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

/** Binds app.jwt.* and app.cors.* properties for type-safe injection. */
@Component
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {

  private Cors cors = new Cors();
  private String secret;
  private long expirationMs;

  @Getter
  @Setter
  public static class Cors {
    private List<String> allowedOrigins;
  }
}
