package org.easyc.common.implement;

import org.easyc.common.dto.AuditUser;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuditorAwareImpl implements AuditorAware<AuditUser> {

    @Override
    public Optional<AuditUser> getCurrentAuditor() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return Optional.empty();
        }

        AuditUser user =
                (AuditUser) authentication.getPrincipal();

        AuditUser dto =
                new AuditUser(
                        user.getLoginId(),
                        user.getMemberNm(),
                        authentication.getAuthorities()
                                .iterator()
                                .next()
                                .getAuthority()
                );

        return Optional.of(dto);
    }
}
