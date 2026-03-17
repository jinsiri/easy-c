package org.easyc.vacation.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.easyc.common.constant.BasicStatus;
import org.easyc.vacation.constant.TransactionType;
import org.easyc.vacation.constant.VacationCategory;
import org.easyc.vacation.constant.VacationType;
import org.easyc.vacation.dto.VacationAppSearchRequestDto;
import org.easyc.vacation.dto.VacationHistorySearchRequestDto;
import org.easyc.vacation.entity.VacationApplication;
import org.easyc.vacation.entity.VacationHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.easyc.vacation.entity.QVacationApplication.vacationApplication;
import static org.easyc.vacation.entity.QVacationHistory.vacationHistory;


@Repository
@RequiredArgsConstructor
public class VacationApplicationRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public Page<VacationApplication> searchUserApp(VacationAppSearchRequestDto req, Pageable pageable, String type) {
        List<VacationApplication> content = queryFactory
                .selectFrom(vacationApplication)
                .where(dateGoe(req.getStartDate()),
                        dateLt(req.getEndDate()),
                        statusEq(req.getStatus()),
                        vacationTypeEq(req.getVacationType()),
                        durationGoe(req.getVacationStart()),
                        durationLoe(req.getVacationEnd()))
                .orderBy(type.equals("plan") ? vacationApplication.startDate.asc() : vacationApplication.startDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(vacationApplication.count())
                .from(vacationApplication)
                .where(dateGoe(req.getStartDate()),
                        dateLt(req.getEndDate()),
                        statusEq(req.getStatus()),
                        vacationTypeEq(req.getVacationType()),
                        durationGoe(req.getVacationStart()),
                        durationLoe(req.getVacationEnd()))
                .fetchOne();

        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    private BooleanExpression statusEq(String status) {
        BasicStatus type = status != null ?
                Arrays.stream(BasicStatus.values())
                    .filter(t -> t.name().equalsIgnoreCase(status))
                    .findFirst()
                    .orElse(null)
                : null;

        return type != null ? vacationApplication.status.eq(type) : null;
    }

    private BooleanExpression vacationTypeEq(String vacationType) {
        VacationType type = vacationType != null ?
                Arrays.stream(VacationType.values())
                        .filter(t -> t.name().equalsIgnoreCase(vacationType))
                        .findFirst()
                        .orElse(null)
                : null;

        return type != null ? vacationApplication.vacationType.eq(type) : null;
    }

    private BooleanExpression durationGoe(String startDays) {
        if (startDays == null || "all".equals(startDays)) return null;
        return vacationApplication.vacationDuration.goe(Integer.parseInt(startDays));
    }

    private BooleanExpression durationLoe(String endDays) {
        if (endDays == null || "all".equals(endDays)) return null;
        return vacationApplication.vacationDuration.loe(Integer.parseInt(endDays));
    }

    private BooleanExpression dateGoe(LocalDate start) {
        return start != null ? vacationApplication.startDate.goe(start) : null;
    }

    private BooleanExpression dateLt(LocalDate end) {
        return end != null ? vacationApplication.startDate.lt(end) : null;
    }
}

