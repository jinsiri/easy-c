package org.easyc.vacation.repository;

import com.querydsl.core.BooleanBuilder;
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

import static org.easyc.attendance.entity.QAttendance.attendance;
import static org.easyc.vacation.entity.QVacation.vacation;
import static org.easyc.vacation.entity.QVacationApplication.vacationApplication;


@Repository
@RequiredArgsConstructor
public class VacationApplicationRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public Page<VacationApplication> searchApp(VacationAppSearchRequestDto req, Pageable pageable) {
        //등록일 기준으로 기간 검색
        BooleanBuilder whereClause = new BooleanBuilder();
        whereClause.and(registerDateGoe(req.getStartDate()))
                .and(registerDateLt(req.getEndDate()))
                .and(statusEq(req.getStatus()))
                .and(vacationTypeEq(req.getVacationType()))
                .and(durationGoe(req.getVacationStart()))
                .and(durationLoe(req.getVacationEnd()))
                .and(deptNmContains(req.getDeptNm()))
                .and(memberNmContains(req.getMemberNm()))
                .and(vacationApplication.deleted.isFalse())
        ;


        List<VacationApplication> content = queryFactory
                .selectFrom(vacationApplication)
                .where(whereClause)
                .orderBy(vacationApplication.registerDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(vacationApplication.count())
                .from(vacationApplication)
                .where(whereClause)
                .fetchOne();

        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }


    public Page<VacationApplication> searchUserApp(VacationAppSearchRequestDto req, Pageable pageable) {
        //휴가일 기준으로 기간 검색
        BooleanBuilder whereClause = new BooleanBuilder();
        whereClause.and( memberIdEq(req.getMemberId()))
                .and(dateGoe(req.getStartDate()))
                .and(dateLt(req.getEndDate()))
                .and(statusEq(req.getStatus()))
                .and(vacationTypeEq(req.getVacationType()))
                .and(durationGoe(req.getVacationStart()))
                .and(durationLoe(req.getVacationEnd()))
                .and(vacationApplication.deleted.isFalse())
        ;

        List<VacationApplication> content = queryFactory
                .selectFrom(vacationApplication)
                .where(whereClause)
                .orderBy(vacationApplication.registerDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(vacationApplication.count())
                .from(vacationApplication)
                .where(whereClause)
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

    private BooleanExpression deptNmContains(String deptNm) {
        if (!StringUtils.hasText(deptNm)) return null;

        List<String> keywords = Arrays.stream(deptNm.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        return keywords.stream()
                .map(vacationApplication.deptNm::containsIgnoreCase)
                .reduce(BooleanExpression::or)
                .orElse(null);
    }

    private BooleanExpression memberNmContains(String memberNm) {
        if (!StringUtils.hasText(memberNm)) return null;

        List<String> keywords = Arrays.stream(memberNm.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        return keywords.stream()
                .map(vacationApplication.memberNm::containsIgnoreCase)
                .reduce(BooleanExpression::or)
                .orElse(null);
    }

}

