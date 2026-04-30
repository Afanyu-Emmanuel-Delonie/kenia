package com.auca.zyra.config;

import com.auca.zyra.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/** Central security configuration — stateless JWT, role-based access. */
@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtAuthFilter jwtAuthFilter;
  private final UserDetailsService userDetailsService;
  private final AppProperties appProperties;

  private static final String[] PUBLIC_PATHS = {
      "/auth/**",
      "/health",
      "/uploads/**",
      "/v3/api-docs/**",
      "/swagger-ui/**",
      "/swagger-ui.html"
  };

  /** Public read-only store catalog. */
  private static final String[] PUBLIC_GET_PATHS = {
      "/store",
      "/store/*",
      "/store/all",
      "/api/v1/store",
      "/api/v1/store/*",
      "/api/v1/store/all"
  };

  /** Public customer-action endpoints (place order, track, inquire). */
  private static final String[] PUBLIC_POST_PATHS = {
      "/orders",
      "/inquiries",
      "/api/v1/orders",
      "/api/v1/inquiries"
  };

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> cors.configurationSource(corsSource()))
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers(PUBLIC_PATHS).permitAll()
            .requestMatchers(HttpMethod.GET, PUBLIC_GET_PATHS).permitAll()
            .requestMatchers(HttpMethod.POST, PUBLIC_POST_PATHS).permitAll()
            .requestMatchers(HttpMethod.GET, "/orders/track/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/orders/my").permitAll()
            // Store mutations — allow any authenticated user for this class project
            .requestMatchers(HttpMethod.POST, "/store/**", "/api/v1/store/**").authenticated()
            .requestMatchers(HttpMethod.PUT, "/store/**", "/api/v1/store/**").authenticated()
            .requestMatchers(HttpMethod.DELETE, "/store/**", "/api/v1/store/**").authenticated()
            // Dashboard — managers and admins only
            .requestMatchers("/dashboard/**").hasAnyRole("ADMIN", "MANAGER")
            // Material management — admin only for mutations
            .requestMatchers(HttpMethod.POST, "/materials/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.PUT, "/materials/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/materials/**").hasRole("ADMIN")
            // Everything else requires authentication
            .anyRequest().authenticated())
        .authenticationProvider(authProvider())
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public DaoAuthenticationProvider authProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder());
    return provider;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
      throws Exception {
    return config.getAuthenticationManager();
  }

  @Bean
  public CorsConfigurationSource corsSource() {
    CorsConfiguration config = new CorsConfiguration();
    List<String> allowedOrigins = appProperties.getCors().getAllowedOrigins();
    if (allowedOrigins == null || allowedOrigins.isEmpty()) {
      allowedOrigins = List.of(
          "http://localhost:5173",
          "http://localhost:4173",
          "https://zyra-atlier.netlify.app");
    }
    config.setAllowedOrigins(allowedOrigins);
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }
}
