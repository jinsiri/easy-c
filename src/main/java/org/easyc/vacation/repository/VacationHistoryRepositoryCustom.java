package org.easyc.vacation.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.easyc.vacation.constant.TransactionType;
import org.easyc.vacation.constant.VacationCategory;
import org.easyc.vacation.dto.VacationHistorySearchRequestDto;
import org.easyc.vacation.entity.VacationHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.easyc.vacation.entity.QVacationHistory.vacationHistory;

@Repository
@RequiredArgsConstructor
public class VacationHistoryRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public Page<VacationHistory> search(VacationHistorySearchRequestDto req, Pageable pageable) {
        List<VacationHistory> content = queryFactory
                .selectFrom(vacationHistory)
                .where(
                        memberIdEq(req.getMemberId()),
                        dateGoe(req.getStartDate()),
                        dateLt(req.getEndDate()),
                        transactionTypeEq(req.getTransactionType()),
                        vacationCategoryEq(req.getVacationCategory()),
                        descContains(req.getVacationCategory()))
                .orderBy(vacationHistory.accrualDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(vacationHistory.count())
                .from(vacationHistory)
                .where(
                        memberIdEq(req.getMemberId()),
                        dateGoe(req.getStartDate()),
                        dateLt(req.getEndDate()),
                        transactionTypeEq(req.getTransactionType()),
                        vacationCategoryEq(req.getVacationCategory()),
                        descContains(req.getViolationReason()))
                .fetchOne();

        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    private BooleanExpression memberIdEq(Long memberId) {
        return memberId != null ? vacationHistory.memberId.eq(memberId) : null;
    }


    private BooleanExpression vacationCategoryEq(String vacationCategory) {
        VacationCategory type = vacationCategory != null ?
                Arrays.stream(VacationCategory.values())
                    .filter(t -> t.name().equalsIgnoreCase(vacationCategory))
                    .findFirst()
                    .orElse(null)
                : null;

        return type != null ? vacationHistory.vacationCategory.eq(type) : null;
    }

    private BooleanExpression transactionTypeEq(String transactionType) {
        TransactionType type = transactionType != null ?
                Arrays.stream(TransactionType.values())
                        .filter(t -> t.name().equalsIgnoreCase(transactionType))
                        .findFirst()
                        .orElse(null)
                : null;

        return type != null ? vacationHistory.transactionType.eq(type) : null;
    }

    private BooleanExpression descContains(String description) {
        return StringUtils.hasText(description) ? vacationHistory.violationReason.containsIgnoreCase(description) : null;
    }

    private BooleanExpression dateGoe(LocalDate start) {
        return start != null ? vacationHistory.accrualDate.goe(start) : null;
    }

    private BooleanExpression dateLt(LocalDate end) {
        return end != null ? vacationHistory.accrualDate.lt(end) : null;
    }
}

