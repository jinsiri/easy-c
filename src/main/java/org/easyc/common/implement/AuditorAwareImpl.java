package org.easyc.common.implement;

import org.easyc.common.dto.BaseUserDto;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuditorAwareImpl implements AuditorAware<BaseUserDto> {

    @Override
    public Optional<BaseUserDto> getCurrentAuditor() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return Optional.empty();
        }

        BaseUserDto user =
                (BaseUserDto) authentication.getPrincipal();

        BaseUserDto dto =
                new BaseUserDto(
                        user.getUserId(),
                        user.getUserNm(),
                        authentication.getAuthorities()
                                .iterator()
                                .next()
                                .getAuthority()
                );

        return Optional.of(dto);
    }
}
