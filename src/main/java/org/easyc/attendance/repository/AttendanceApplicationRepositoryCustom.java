package org.easyc.attendance.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.AttendanceAppSearchRequestDto;
import org.easyc.attendance.entity.AttendanceApplication;
import org.easyc.common.constant.BasicStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.easyc.attendance.entity.QAttendance.attendance;
import static org.easyc.attendance.entity.QAttendanceApplication.attendanceApplication;

@Repository
@RequiredArgsConstructor
public class AttendanceApplicationRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public Page<AttendanceApplication> searchApp(AttendanceAppSearchRequestDto req, Pageable pageable) {
        //등록일 기준으로 기간 검색
        BooleanBuilder whereClause = new BooleanBuilder();
        whereClause.and(registerDateGoe(req.getStartDate()))
                .and(registerDateLt(req.getEndDate()))
                .and(workDateEq(req.getWorkDate()))
                .and(statusEq(req.getStatus()))
                .and(deptNmContains(req.getDeptNm()))
                .and(memberNmContains(req.getMemberNm()))
                .and(summaryContains(req.getSummary()))
        ;

        List<AttendanceApplication> content = queryFactory
                .selectFrom(attendanceApplication)
                .where(whereClause)
                .orderBy(attendanceApplication.registerDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(attendanceApplication.count())
                .from(attendanceApplication)
                .where(whereClause)
                .fetchOne();

        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }


    private BooleanExpression memberIdEq(Long memberId) {
        return memberId != null ? attendanceApplication.memberId.eq(memberId) : null;
    }


    private BooleanExpression statusEq(String status) {
        BasicStatus type = status != null ?
                Arrays.stream(BasicStatus.values())
                    .filter(t -> t.name().equalsIgnoreCase(status))
                    .findFirst()
                    .orElse(null)
                : null;

        return type != null ? attendanceApplication.status.eq(type) : null;
    }

    private BooleanExpression registerDateGoe(LocalDate start) {
        return start != null ? attendanceApplication.registerDate.goe(start.atStartOfDay()) : null;
    }

    private BooleanExpression registerDateLt(LocalDate end) {
        return end != null ? attendanceApplication.registerDate.lt(end.atStartOfDay()) : null;
    }

    private BooleanExpression workDateEq(LocalDate workDate) {
        return workDate != null ? attendanceApplication.workDate.eq(workDate) : null;
    }



    private BooleanExpression deptNmContains(String deptNm) {
        if (!StringUtils.hasText(deptNm)) return null;

        List<String> keywords = Arrays.stream(deptNm.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        return keywords.stream()
                .map(attendanceApplication.deptNm::containsIgnoreCase)
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
                .map(attendanceApplication.memberNm::containsIgnoreCase)
                .reduce(BooleanExpression::or)
                .orElse(null);
    }

    private BooleanExpression summaryContains(String summary) {
        return StringUtils.hasText(summary) ? attendanceApplication.summary.containsIgnoreCase(summary) : null;
    }

}

