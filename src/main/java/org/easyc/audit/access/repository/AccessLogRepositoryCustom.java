package org.easyc.audit.access.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.easyc.audit.access.dto.AccessLogSearchCondition;
import org.easyc.audit.access.entity.AccessLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

import static org.easyc.audit.access.entity.QAccessLog.accessLog;

@Repository
@RequiredArgsConstructor
public class AccessLogRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public Page<AccessLog> search(AccessLogSearchCondition cond, Pageable pageable) {
        List<AccessLog> content = queryFactory
                .selectFrom(accessLog)
                .where(
                        loginIdContains(cond.getLoginId()),
                        methodEq(cond.getMethod()),
                        uriContains(cond.getUri()),
                        statusEq(cond.getStatus()),
                        deviceTypeEq(cond.getDeviceType()),
                        dateGoe(cond.getFromDateTime()),
                        dateLt(cond.getToDateTime())
                )
                .orderBy(accessLog.registerDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(accessLog.count())
                .from(accessLog)
                .where(
                        loginIdContains(cond.getLoginId()),
                        methodEq(cond.getMethod()),
                        uriContains(cond.getUri()),
                        statusEq(cond.getStatus()),
                        deviceTypeEq(cond.getDeviceType()),
                        dateGoe(cond.getFromDateTime()),
                        dateLt(cond.getToDateTime())
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    private BooleanExpression loginIdContains(String loginId) {
        return StringUtils.hasText(loginId) ? accessLog.registerUser.loginId.containsIgnoreCase(loginId) : null;
    }

    private BooleanExpression methodEq(String method) {
        return StringUtils.hasText(method) ? accessLog.method.eq(method.toUpperCase()) : null;
    }

    private BooleanExpression uriContains(String uri) {
        return StringUtils.hasText(uri) ? accessLog.uri.containsIgnoreCase(uri) : null;
    }

    private BooleanExpression statusEq(Integer status) {
        return status != null ? accessLog.status.eq(status) : null;
    }

    private BooleanExpression deviceTypeEq(String deviceType) {
        return StringUtils.hasText(deviceType) ? accessLog.deviceType.eq(deviceType) : null;
    }

    private BooleanExpression dateGoe(LocalDateTime from) {
        return from != null ? accessLog.registerDate.goe(from) : null;
    }

    private BooleanExpression dateLt(LocalDateTime to) {
        return to != null ? accessLog.registerDate.lt(to) : null;
    }
}
