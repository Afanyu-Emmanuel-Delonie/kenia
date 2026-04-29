package com.auca.kenia.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Configures OpenAPI 3 documentation with JWT Bearer authentication. */
@Configuration
public class OpenApiConfig {

  private static final String SCHEME_NAME = "bearerAuth";

  @Bean
  public OpenAPI openApi() {
    return new OpenAPI()
        .info(new Info()
            .title("Kernia Atelier API")
            .description("Backend API for the Kernia luxury bag production system")
            .version("1.0.0"))
        .addSecurityItem(new SecurityRequirement().addList(SCHEME_NAME))
        .components(new Components()
            .addSecuritySchemes(SCHEME_NAME, new SecurityScheme()
                .name(SCHEME_NAME)
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")));
  }
}
