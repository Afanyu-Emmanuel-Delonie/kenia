package com.auca.kenia.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/** Binds app.jwt.* properties for type-safe injection. */
@Component
@ConfigurationProperties(prefix = "app.jwt")
@Getter
@Setter
public class AppProperties {

  private String secret;
  private long expirationMs;
}
