package org.easyc.audit.activity.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.easyc.audit.activity.dto.ActivityLogSearchCondition;
import org.easyc.audit.activity.entity.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

import static org.easyc.audit.activity.entity.QActivityLog.activityLog;

@Repository
@RequiredArgsConstructor
public class ActivityLogRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public Page<ActivityLog> search(ActivityLogSearchCondition cond, Pageable pageable) {
        List<ActivityLog> content = queryFactory
                .selectFrom(activityLog)
                .where(
                        loginIdContains(cond.getLoginId()),
                        actionCodeContains(cond.getActionCode()),
                        resultEq(cond.getResult()),
                        dateGoe(cond.getFromDateTime()),
                        dateLt(cond.getToDateTime())
                )
                .orderBy(activityLog.registerDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(activityLog.count())
                .from(activityLog)
                .where(
                        loginIdContains(cond.getLoginId()),
                        actionCodeContains(cond.getActionCode()),
                        resultEq(cond.getResult()),
                        dateGoe(cond.getFromDateTime()),
                        dateLt(cond.getToDateTime())
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    private BooleanExpression loginIdContains(String loginId) {
        return StringUtils.hasText(loginId) ? activityLog.registerUser.loginId.containsIgnoreCase(loginId) : null;
    }

    private BooleanExpression actionCodeContains(String actionCode) {
        return StringUtils.hasText(actionCode) ? activityLog.actionCode.containsIgnoreCase(actionCode) : null;
    }

    private BooleanExpression resultEq(String result) {
        return StringUtils.hasText(result) ? activityLog.result.eq(result) : null;
    }

    private BooleanExpression dateGoe(LocalDateTime from) {
        return from != null ? activityLog.registerDate.goe(from) : null;
    }

    private BooleanExpression dateLt(LocalDateTime to) {
        return to != null ? activityLog.registerDate.lt(to) : null;
    }
}
