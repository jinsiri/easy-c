package org.easyc.vacation.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.easyc.vacation.constant.TransactionType;
import org.easyc.vacation.constant.VacationCategory;
import org.easyc.vacation.dto.VacationCompanySearchRequestDto;
import org.easyc.vacation.dto.VacationHistorySearchRequestDto;
import org.easyc.vacation.entity.Vacation;
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
import static org.easyc.vacation.entity.QVacationHistory.vacationHistory;


@Repository
@RequiredArgsConstructor
public class VacationRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public Page<Vacation> search(VacationCompanySearchRequestDto req, Pageable pageable) {
        List<Vacation> content = queryFactory
                .selectFrom(vacation)
                .where(
                        vacation.year.eq(req.getYear()),
                        deptNmContains(req.getDeptNm()),
                        memberNmContains(req.getMemberNm())
                )
                .orderBy(vacation.memberId.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(vacation.count())
                .from(vacation)
                .where(
                        vacation.year.eq(req.getYear()),
                        deptNmContains(req.getDeptNm()),
                        memberNmContains(req.getMemberNm())
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    private BooleanExpression deptNmContains(String deptNm) {
        if (!StringUtils.hasText(deptNm)) return null;

        List<String> keywords = Arrays.stream(deptNm.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        return keywords.stream()
                .map(vacation.deptNm::containsIgnoreCase)
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
                .map(vacation.memberNm::containsIgnoreCase)
                .reduce(BooleanExpression::or)
                .orElse(null);
    }

}

