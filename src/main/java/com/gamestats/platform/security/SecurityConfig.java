package com.gamestats.platform.security;

import com.gamestats.platform.security.JwtAuthFilter;
import com.gamestats.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.context.annotation.Lazy;

@Configuration
public class SecurityConfig {

    private final UserRepository userRepository;

    public SecurityConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByUsername(username)
                .map(user -> org.springframework.security.core.userdetails.User
                        .withUsername(user.getUsername())
                        .password(user.getPassword())
                        .authorities("USER")
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }



    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }
    @Bean
    public JwtService jwtService() {
        return new JwtService();
    }
    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter(
                jwtService(),
                userDetailsService()
        );
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        // Public endpoints
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()

                        // Protected endpoints
                        .requestMatchers(
                                "/api/test/**",
                                "/api/users/**",
                                "/api/matches/**"
                        ).authenticated()

                        // Everything else
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter(),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}