package org.easyc.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@Configuration
@EnableMethodSecurity
public class MethodSecurityConfig {


    /**
     * Method Level Security 활성화
     *
     * - @PreAuthorize
     * - @PostAuthorize
     * - @Secured
     *
     * 등의 어노테이션을 컨트롤러 / 서비스 메서드에서 사용할 수 있도록 한다.
     *
     * URL 기반 보안(SecurityFilterChain)과 별도로
     * 메서드 단위에서 권한을 한 번 더 검증하는 2차 방어 역할.
     *
     * 예)
     *  @PreAuthorize("hasRole('ADMIN')")
     *  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
     */

}
