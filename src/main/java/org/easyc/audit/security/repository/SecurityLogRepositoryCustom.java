package org.easyc.audit.security.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.easyc.audit.security.dto.SecurityLogSearchCondition;
import org.easyc.audit.security.entity.SecurityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

import static org.easyc.audit.security.entity.QSecurityLog.securityLog;

@Repository
@RequiredArgsConstructor
public class SecurityLogRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public Page<SecurityLog> search(SecurityLogSearchCondition cond, Pageable pageable) {
        List<SecurityLog> content = queryFactory
                .selectFrom(securityLog)
                .where(
                        loginIdContains(cond.getLoginId()),
                        eventTypeEq(cond.getEventType()),
                        ipContains(cond.getIp()),
                        dateGoe(cond.getFromDateTime()),
                        dateLt(cond.getToDateTime())
                )
                .orderBy(securityLog.registerDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(securityLog.count())
                .from(securityLog)
                .where(
                        loginIdContains(cond.getLoginId()),
                        eventTypeEq(cond.getEventType()),
                        ipContains(cond.getIp()),
                        dateGoe(cond.getFromDateTime()),
                        dateLt(cond.getToDateTime())
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    private BooleanExpression loginIdContains(String loginId) {
        return StringUtils.hasText(loginId) ? securityLog.loginId.containsIgnoreCase(loginId) : null;
    }

    private BooleanExpression eventTypeEq(String eventType) {
        return StringUtils.hasText(eventType) ? securityLog.eventType.eq(eventType) : null;
    }

    private BooleanExpression ipContains(String ip) {
        return StringUtils.hasText(ip) ? securityLog.ip.containsIgnoreCase(ip) : null;
    }

    private BooleanExpression dateGoe(LocalDateTime from) {
        return from != null ? securityLog.registerDate.goe(from) : null;
    }

    private BooleanExpression dateLt(LocalDateTime to) {
        return to != null ? securityLog.registerDate.lt(to) : null;
    }
}
