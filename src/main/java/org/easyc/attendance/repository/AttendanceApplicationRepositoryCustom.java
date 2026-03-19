package org.easyc.attendance.repository;

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

import static org.easyc.attendance.entity.QAttendanceApplication.attendanceApplication;

@Repository
@RequiredArgsConstructor
public class AttendanceApplicationRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public Page<AttendanceApplication> searchApp(AttendanceAppSearchRequestDto req, Pageable pageable) {
        //등록일 기준으로 기간 검색
        List<AttendanceApplication> content = queryFactory
                .selectFrom(attendanceApplication)
                .where(
                        registerDateGoe(req.getStartDate()),
                        registerDateLt(req.getEndDate()),
                        statusEq(req.getStatus()),
                        deptNmContains(req.getDeptNm()),
                        memberNmContains(req.getMemberNm()),
                        summaryContains(req.getSummary())
                )
                .orderBy(attendanceApplication.registerDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(attendanceApplication.count())
                .from(attendanceApplication)
                .where(
                        registerDateGoe(req.getStartDate()),
                        registerDateLt(req.getEndDate()),
                        statusEq(req.getStatus()),
                        deptNmContains(req.getDeptNm()),
                        memberNmContains(req.getMemberNm()),
                        summaryContains(req.getSummary()))
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

    private BooleanExpression deptNmContains(String depthNm) {
        return StringUtils.hasText(depthNm) ? attendanceApplication.deptNm.containsIgnoreCase(depthNm) : null;
    }

    private BooleanExpression memberNmContains(String memberNm) {
        return StringUtils.hasText(memberNm) ? attendanceApplication.memberNm.containsIgnoreCase(memberNm) : null;
    }

    private BooleanExpression summaryContains(String summary) {
        return StringUtils.hasText(summary) ? attendanceApplication.summary.containsIgnoreCase(summary) : null;
    }

}

