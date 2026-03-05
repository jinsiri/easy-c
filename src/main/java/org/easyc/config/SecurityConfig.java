package org.easyc.config;

import lombok.RequiredArgsConstructor;
import org.easyc.auth.jwt.JwtAuthenticationFilter;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authorization.SpringAuthorizationEventPublisher;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity // @PreAuthorize, @PostAuthorize 등 메서드 레벨 보안 활성화
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // CORS 설정 - 다른 origin(포트)에서 오는 요청 허용
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // CSRF 비활성화 - JWT 사용 시 불필요 (쿠키 기반 세션 안 쓰므로)
                .csrf(AbstractHttpConfigurer::disable)

                // 세션 사용 안 함 - JWT는 stateless, 매 요청마다 토큰으로 인증
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // 추가!
                )

                // 폼 로그인 비활성화 - REST API라 폼 로그인 페이지 필요 없음
                .formLogin(AbstractHttpConfigurer::disable)

                // HTTP Basic 비활성화 - JWT 사용하므로 Basic 인증 불필요
                .httpBasic(AbstractHttpConfigurer::disable)

                // URL별 접근 권한 설정
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        .anyRequest().authenticated() // 그 외 인증 필요 (세부 권한은 @PreAuthorize로 처리)
//                       .anyRequest().permitAll() // 테스트용
                )

                // JWT 필터 추가 - UsernamePasswordAuthenticationFilter 전에 실행
                // 매 요청마다 쿠키에서 JWT 꺼내서 인증 처리
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class
        );


        return http.build();
    }

    /**
     * CORS 설정
     * 브라우저에서 다른 origin(프론트 3000 → 백엔드 8081)으로 요청 시 필요
     * 포스트맨은 CORS 검사 안 해서 이 설정 없어도 됨
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 개발용 (프론트 포트 변경되어도 허용, 배포 시 보안상 위험하므로 반드시 배포용에서는 특정 오리진만 허용)
        // 이대로 배포 원하는 경우, 배포시 프록시 설정 필요 (예: nginx에서 /api로 들어오는 요청만 백엔드로 프록시)
        config.setAllowedOriginPatterns(List.of("*"));

        // 허용할 HTTP 메서드
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 허용할 헤더
        config.setAllowedHeaders(List.of("*"));

        // 쿠키 포함 요청 허용 - httpOnly 쿠키(JWT) 전송에 필요
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 모든 경로에 CORS 설정 적용
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /**
     * 비밀번호 암호화 - BCrypt 사용
     * 회원가입 시 암호화, 로그인 시 비교에 사용
     */
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 인증 매니저 - 로그인 시 아이디/비밀번호 검증에 사용
     */
    @Bean
    AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * AuthorizationDeniedEvent 활성화
     * 기본적으로 비활성화되어 있어 명시적으로 등록해야 한다.
     * HTTP URL 기반 인가 거부 및 @PreAuthorize 거부 모두 이벤트를 발행한다.
     */
    @Bean
    SpringAuthorizationEventPublisher authorizationEventPublisher(ApplicationEventPublisher eventPublisher) {
        return new SpringAuthorizationEventPublisher(eventPublisher);
    }


}
