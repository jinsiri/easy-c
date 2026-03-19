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


@Repository
@RequiredArgsConstructor
public class VacationApplicationRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public Page<VacationApplication> searchApp(VacationAppSearchRequestDto req, Pageable pageable) {
        //등록일 기준으로 기간 검색
        List<VacationApplication> content = queryFactory
                .selectFrom(vacationApplication)
                .where(
                        registerDateGoe(req.getStartDate()),
                        registerDateLt(req.getEndDate()),
                        statusEq(req.getStatus()),
                        vacationTypeEq(req.getVacationType()),
                        durationGoe(req.getVacationStart()),
                        durationLoe(req.getVacationEnd()),
                        deptNmContains(req.getDeptNm()),
                        memberNmContains(req.getMemberNm())
                )
                .orderBy(vacationApplication.registerDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(vacationApplication.count())
                .from(vacationApplication)
                .where(
                        registerDateGoe(req.getStartDate()),
                        registerDateLt(req.getEndDate()),
                        statusEq(req.getStatus()),
                        vacationTypeEq(req.getVacationType()),
                        durationGoe(req.getVacationStart()),
                        durationLoe(req.getVacationEnd()),
                        deptNmContains(req.getDeptNm()),
                        memberNmContains(req.getMemberNm())
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }


    public Page<VacationApplication> searchUserApp(VacationAppSearchRequestDto req, Pageable pageable, String type) {
        //휴가일 기준으로 기간 검색
        List<VacationApplication> content = queryFactory
                .selectFrom(vacationApplication)
                .where(
                        memberIdEq(req.getMemberId()),
                        dateGoe(req.getStartDate()),
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
                .where(
                        memberIdEq(req.getMemberId()),
                        dateGoe(req.getStartDate()),
                        dateLt(req.getEndDate()),
                        statusEq(req.getStatus()),
                        vacationTypeEq(req.getVacationType()),
                        durationGoe(req.getVacationStart()),
                        durationLoe(req.getVacationEnd()))
                .fetchOne();

        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    private BooleanExpression memberIdEq(Long memberId) {
        return memberId != null ? vacationApplication.memberId.eq(memberId) : null;
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

    private BooleanExpression registerDateGoe(LocalDate start) {
        return start != null ? vacationApplication.registerDate.goe(start.atStartOfDay()) : null;
    }

    private BooleanExpression registerDateLt(LocalDate end) {
        return end != null ? vacationApplication.registerDate.lt(end.atStartOfDay()) : null;
    }

    private BooleanExpression deptNmContains(String depthNm) {
        return StringUtils.hasText(depthNm) ? vacationApplication.deptNm.containsIgnoreCase(depthNm) : null;
    }

    private BooleanExpression memberNmContains(String memberNm) {
        return StringUtils.hasText(memberNm) ? vacationApplication.memberNm.containsIgnoreCase(memberNm) : null;
    }

}

