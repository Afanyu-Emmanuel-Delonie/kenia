package com.auca.zyra;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class ZyraApplication {

  public static void main(String[] args) {
    SpringApplication.run(ZyraApplication.class, args);
  }
}
