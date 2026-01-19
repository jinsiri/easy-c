package org.easyc.auth.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 쿠키에서 JWT 가져오기
        String token = resolveToken(request);

        try {
            if (token != null && jwtProvider.validateToken(token)) {
                String loginId = jwtProvider.getSubject(token);
//                UserDetails userDetails = userDetailsService.loadUserByUsername(loginId);

                String role = jwtProvider.getRole(token);

                GrantedAuthority authority =
                        new SimpleGrantedAuthority(role);


                // Authentication
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                loginId,
                                null,
                                List.of(authority) // DB에서 가져온 권한 (MemberRole)
                        );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (Exception e) {
            logger.debug(e.getMessage());
            // JWT 이상 시 인증 무시 -> 401/403은 컨트롤러 접근 시 처리
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }


    private String resolveToken(HttpServletRequest request) {
        // 쿠키에서 ACCESS_TOKEN 추출
        if (request.getCookies() != null) {
            return Arrays.stream(request.getCookies())
                    .filter(c -> "ACCESS_TOKEN".equals(c.getName()))
                    .findFirst()
                    .map(Cookie::getValue)
                    .orElse(null);
        }
        return null;
    }
}
