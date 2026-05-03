package org.easyc.attendance.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.easyc.attendance.constant.WorkStatus;
import org.easyc.attendance.constant.WorkType;
import org.easyc.attendance.dto.AttendanceAppSearchRequestDto;
import org.easyc.attendance.dto.AttendanceCompanySearchRequestDto;
import org.easyc.attendance.dto.AttendanceCompanySearchResponseDto;
import org.easyc.attendance.dto.AttendanceDayResponseDto;
import org.easyc.attendance.entity.Attendance;
import org.easyc.attendance.entity.AttendanceApplication;
import org.easyc.common.constant.BasicStatus;
import org.easyc.common.dto.PageResponseDto;
import org.easyc.vacation.constant.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static org.easyc.attendance.entity.QAttendance.attendance;
import static org.easyc.attendance.entity.QAttendanceApplication.attendanceApplication;
import static org.easyc.vacation.entity.QVacationHistory.vacationHistory;

@Repository
@RequiredArgsConstructor
public class AttendanceRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Getter
    @Setter
    @NoArgsConstructor
    public static class AttendanceStatsVo {
        private Long allCount;
        private Long lateCount;
        private Long earlyLeaveCount;
        private Long absentCount;
    }

    public Page<AttendanceDayResponseDto> search(AttendanceCompanySearchRequestDto req, Pageable pageable) {
        //등록일 기준으로 기간 검색
        BooleanBuilder whereClause = new BooleanBuilder();
        whereClause.and(dateGoe(req.getStartDate()))
                .and(dateLoe(req.getEndDate()))
                .and(deptNmContains(req.getDeptNm()))
                .and(memberNmContains(req.getMemberNm()))
                .and(workTypeEq(req.getWorkType()))
                .and(workStatusEq(req.getWorkStatus()))
                .and(attendance.deleted.isFalse())
        ;

        List<Attendance> content = queryFactory
                .selectFrom(attendance)
                .where(whereClause)
                .orderBy(attendance.registerDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(attendance.count())
                .from(attendance)
                .where(whereClause)
                .fetchOne();

        List<AttendanceDayResponseDto> dtoList = content.stream().map(a -> AttendanceDayResponseDto.fromEntity(a)).toList();
        return new PageImpl<>(dtoList, pageable, total != null ? total : 0L);
    }

    public AttendanceCompanySearchResponseDto searchStatic(AttendanceCompanySearchRequestDto req, Pageable pageable) {
        //등록일 기준으로 기간 검색
        BooleanBuilder whereClause = new BooleanBuilder();
        whereClause.and(dateGoe(req.getStartDate()))
                .and(dateLoe(req.getEndDate()))
                .and(deptNmContains(req.getDeptNm()))
                .and(memberNmContains(req.getMemberNm()))
                .and(workTypeEq(req.getWorkType()))
                .and(workStatusEq(req.getWorkStatus()))
                .and(attendance.deleted.isFalse())
        ;

        List<Attendance> content = queryFactory
                .selectFrom(attendance)
                .where(whereClause)
                .orderBy(attendance.registerDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        AttendanceStatsVo stats = queryFactory
                .select(Projections.fields(AttendanceStatsVo.class,
                        attendance.count().as("allCount"),
                        attendance.workStatus.when(WorkStatus.LATE).then(1L).otherwise(0L).sum().coalesce(0L).as("lateCount"),
                        attendance.workStatus.when(WorkStatus.EARLY_LEAVE).then(1L).otherwise(0L).sum().coalesce(0L).as("earlyLeaveCount"),
                        attendance.workStatus.when(WorkStatus.ABSENT).then(1L).otherwise(0L).sum().coalesce(0L).as("absentCount")
                ))
                .from(attendance)
                .where(whereClause)
                .fetchOne();

        List<Long> memberIdList = content.stream()
                .map(a -> a.getMemberId())
                .filter(Objects::nonNull)
                .toList();

        Long changeRequestApp = queryFactory
                .select( attendanceApplication.count())
                .from(attendanceApplication)
                .where(
                        attendanceApplication.memberId.in(memberIdList)
                                .and(appDateGoe(req.getStartDate()))
                                .and(appDateLoe(req.getEndDate()))
                                .and(attendanceApplication.deleted.isFalse())
                ).fetchOne();

        AttendanceCompanySearchResponseDto response = new AttendanceCompanySearchResponseDto();
        response.setAllCount(stats.getAllCount().intValue());
        response.setLateCount(stats.getLateCount().intValue());
        response.setEarlyLeaveCount(stats.getEarlyLeaveCount().intValue());
        response.setAbsentCount(stats.getAbsentCount().intValue());
        response.setChangeRequestCount(changeRequestApp != null ? changeRequestApp : 0L);

        List<AttendanceDayResponseDto> dtoList = content.stream().map(a -> AttendanceDayResponseDto.fromEntity(a)).toList();
        Long total = stats.getAllCount() != null ? stats.getAllCount().longValue() : 0L;
        Page<AttendanceDayResponseDto> dayData = new PageImpl<>(dtoList, pageable, total);
        response.setDayData(new PageResponseDto<>(dayData));

        return response;
    }



    private BooleanExpression dateGoe(LocalDate start) {
        return start != null ? attendance.workDate.goe(start) : null;
    }

    private BooleanExpression dateLoe(LocalDate end) {
        return end != null ? attendance.workDate.loe(end) : null;
    }

    private BooleanExpression deptNmContains(String deptNm) {
        if (!StringUtils.hasText(deptNm)) return null;

        List<String> keywords = Arrays.stream(deptNm.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        return keywords.stream()
                .map(attendance.deptNm::containsIgnoreCase)
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
                .map(attendance.memberNm::containsIgnoreCase)
                .reduce(BooleanExpression::or)
                .orElse(null);
    }

    private BooleanExpression workTypeEq(String workType) {
        WorkType type = workType != null ?
                Arrays.stream(WorkType.values())
                        .filter(t -> t.name().equalsIgnoreCase(workType))
                        .findFirst()
                        .orElse(null)
                : null;

        return type != null ? attendance.workType.eq(type) : null;
    }

    private BooleanExpression workStatusEq(String workStatus) {
        WorkStatus type = workStatus != null ?
                Arrays.stream(WorkStatus.values())
                        .filter(t -> t.name().equalsIgnoreCase(workStatus))
                        .findFirst()
                        .orElse(null)
                : null;

        return type != null ? attendance.workStatus.eq(type) : null;
    }

    private BooleanExpression appDateGoe(LocalDate start) {
        return start != null ? attendanceApplication.workDate.goe(start) : null;
    }

    private BooleanExpression appDateLoe(LocalDate end) {
        return end != null ? attendanceApplication.workDate.loe(end) : null;
    }


}

