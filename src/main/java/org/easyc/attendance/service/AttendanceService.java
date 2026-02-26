package org.easyc.attendance.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.constant.*;
import org.easyc.attendance.dto.*;
import org.easyc.attendance.entity.*;
import org.easyc.attendance.repository.*;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final AttendancePolicyRepository attendancePolicyRepository;
    private final AttendancePolicyMapRepository attendancePolicyMapRepository;
    private final HolidayCalendarRepository holidayCalendarRepository;
    private final AttendanceApplicationRepository attendanceApplicationRepository;

    public AttendanceResponseDto getAttendanceTodayData (AttendanceRequestDto req){
        //데이터 조회 - 해당 일자 및 전날 데이터 불러와서 전날 데이터가 미완인 경우 전날 데이터
        LocalDate workDate = req.getWorkDate().toLocalDate();
        LocalTime workTime = req.getWorkDate().toLocalTime();
        Attendance targetAttendance = null;

        AttendancePolicy targetPolicy = findAttendancePolicy(req.getMemberId());

        if(workTime.isBefore(LocalTime.of(7, 0))){
            Attendance beforeAttendance = attendanceRepository.findByMemberIdAndWorkDate(req.getMemberId(), workDate.minus(1, ChronoUnit.DAYS)).orElse(null);


            if(beforeAttendance != null && beforeAttendance.getStartTime() != null && beforeAttendance.getEndTime() == null){
                targetAttendance = beforeAttendance;
            }
        }

        if(targetAttendance == null){
            targetAttendance = attendanceRepository.findByMemberIdAndWorkDate(req.getMemberId(), workDate).orElse(null);

            if(targetAttendance == null){
                targetAttendance = attendanceRepository.saveAndFlush(
                        Attendance.builder()
                                .workDate(workDate)
                                .attendancePolicyName(targetPolicy.getAttendancePolicyName())
                                .deptNm("인사팀")
                                .jobGrade("사원")
                                .build());
            }
        }

        AttendanceResponseDto findStatData = findStatData(req.getMemberId(), workDate, targetPolicy);
        AttendanceResponseDto result = new AttendanceResponseDto(targetAttendance);
        result.applyWeekData(findStatData);

        return result;
    }

    public List<Map<String, AttendanceCalendarResponseDto>> getAttendanceCalendarData(AttendanceRequestDto req) {
        Long memberId = req.getMemberId();

        Integer targetYear = req.getWorkDate().getYear();
        Integer targetMonth = req.getWorkDate().getMonthValue();

        YearMonth yearMonth = YearMonth.of(targetYear, targetMonth);
        LocalDate firstDay = yearMonth.atDay(1);
        LocalDate lastDay = yearMonth.atEndOfMonth();

        List<Attendance> targetMonthAttendanceList = attendanceRepository.findAllByMemberIdAndWorkDateBetween(memberId, firstDay, lastDay);
        Map<Integer, Attendance> attendanceMap = targetMonthAttendanceList.stream()
                .collect(Collectors.toMap(a -> a.getWorkDate().getDayOfMonth(), a -> a));

        List<HolidayCalendar> holidayCalendarList = holidayCalendarRepository.findByYearEquals(targetYear.toString());
        Map<LocalDate,String> holidayMap = holidayCalendarList.stream().collect(Collectors.toMap(a -> a.getStartDate() , a -> a.getSubject()));

        List<AttendanceApplication> targetAttendanceChangeRequestList = attendanceApplicationRepository.findAllByMemberIdAndActiveTrueAndWorkDateBetween(memberId, firstDay, lastDay);
        Map<Integer, AttendanceApplication> changeRequestMap = targetAttendanceChangeRequestList.stream()
                .collect(Collectors.toMap(a -> a.getWorkDate().getDayOfMonth(), a -> a));

        String[] weekKeys = {"mon", "tue", "wed", "thu", "fri", "sat", "sun"};
        List<Map<String, AttendanceCalendarResponseDto>> calendarList = new ArrayList<>();
        Map<String, AttendanceCalendarResponseDto> currentWeek = new LinkedHashMap<>();

        // 1일 시작 전 이전 달 날짜 채우기 ---
        int firsrDayOfWeek = firstDay.getDayOfWeek().getValue();
        int offset = firsrDayOfWeek - 1; // 월요일(1)이면 0, 수요일(3)이면 2

        if (offset > 0) {
            LocalDate prevMonthCursor = firstDay.minusDays(offset);
            for (int i = 0; i < offset; i++) {
                currentWeek.put(weekKeys[i], createResDto(prevMonthCursor, null, false, null));
                prevMonthCursor = prevMonthCursor.plusDays(1);
            }
        }

        LocalDate cursor = firstDay;
        while (!cursor.isAfter(lastDay)) {
            DayOfWeek dayOfWeek = cursor.getDayOfWeek();
            String key = weekKeys[dayOfWeek.getValue() - 1];

            Attendance targetAttendance = attendanceMap.get(cursor.getDayOfMonth());
            AttendanceApplication targetAttendanceApplication = changeRequestMap.get(cursor.getDayOfMonth());
            AttendanceCalendarResponseDto dto = createResDto(cursor, targetAttendance, true, targetAttendanceApplication );

            if(holidayMap.containsKey(cursor)){
                dto.setIsHoliday(true);
                dto.setHolidaySubject(holidayMap.get(cursor));
            }

            currentWeek.put(key, dto);

            // 일요일이거나 월의 마지막 날이면 리스트에 추가
            if (dayOfWeek == DayOfWeek.SUNDAY || cursor.equals(lastDay)) {

                // 마지막 날이 일요일이 아니면 다음 달 날짜로 마저 채우기
                if (cursor.equals(lastDay) && dayOfWeek != DayOfWeek.SUNDAY) {
                    LocalDate nextMonthCursor = lastDay.plusDays(1);
                    for (int i = dayOfWeek.getValue(); i < 7; i++) {
                        currentWeek.put(weekKeys[i], createResDto(nextMonthCursor, null, false, null));
                        nextMonthCursor = nextMonthCursor.plusDays(1);
                    }
                }

                calendarList.add(currentWeek);
                currentWeek = new LinkedHashMap<>();
            }
            cursor = cursor.plusDays(1);
        }

        return calendarList;
    }

    public void startAttendanceData (AttendanceSaveRequestDto req) {
        LocalDateTime startTime = req.getStartTime();
        LocalDate workDate = startTime.toLocalDate();

        // 유관 데이터 조회
        AttendancePolicy targetPolicy = findAttendancePolicy(req.getMemberId());
        /** 멤버 조회해서 부서 및 직급 확인 로직 필요 **/

        // 데이터 조회
        Attendance targetAttendance = attendanceRepository.findByMemberIdAndWorkDate(req.getMemberId(), workDate)
                .orElseGet(() -> Attendance.builder()
                        .workDate(workDate)
                        .attendancePolicyName(targetPolicy.getAttendancePolicyName())
                        .deptNm("인사팀")
                        .jobGrade("사원")
                        .build());

        attendanceRepository.save(updateAttendanceByStartTime(req, targetAttendance, targetPolicy, startTime));
    }

    public void finishAttendanceData (AttendanceSaveRequestDto req) {
        if(req.getAttendanceId() == null){
            throw new CustomException(CustomExceptionCode.ATTENDANCE_NOT_FOUND);
        }

        // 유관 데이터 조회
        AttendancePolicy targetPolicy = findAttendancePolicy(req.getMemberId());

        // 데이터 조회
        Attendance targetAttendance = attendanceRepository.findByMemberIdAndAttendanceId(req.getMemberId(), req.getAttendanceId()).orElseThrow();

        // 상태업데이트 해서 save
        attendanceRepository.saveAndFlush(updateAttendanceByEndTime(targetAttendance, targetPolicy, req.getEndTime()));
    }

    private AttendanceCalendarResponseDto createResDto(LocalDate date, Attendance attendance, boolean isCurrentMonth, AttendanceApplication changeRequest) {
        AttendanceCalendarResponseDto dto = new AttendanceCalendarResponseDto();

        if (attendance != null) {
            dto = new AttendanceCalendarResponseDto(attendance, changeRequest);

            AttendancePolicy targetPolicy = findAttendancePolicy(attendance.getMemberId());
            dto.setDefaultStartTime(targetPolicy.getStartTime());
            dto.setDefaultEndTime(targetPolicy.getEndTime());
        }

        dto.setYear(date.getYear());
        dto.setMonth(date.getMonthValue());
        dto.setDay(date.getDayOfMonth());
        dto.setIsCurrentMonth(isCurrentMonth);
        return dto;
    }

    private Attendance updateAttendanceByStartTime(AttendanceSaveRequestDto req, Attendance targetAttendance, AttendancePolicy targetPolicy, LocalDateTime startTime) {
        if(targetAttendance != null && targetPolicy != null) {
            int dayOfWeek = startTime.getDayOfWeek().getValue();
            LocalTime currentStartTime = startTime.toLocalTime();

            // 근무 타입 판별
            WorkType workType = WorkType.NORMAL;
            Optional<HolidayCalendar> holidayData = holidayCalendarRepository.findByStartDate(startTime.toLocalDate());

            if(holidayData.isPresent()){
                workType = WorkType.HOLIDAY;
            } else if(!targetPolicy.getWorkDayOfWeek().contains(String.valueOf(dayOfWeek))){
                workType = WorkType.HOLIDAY;
            } else if (dayOfWeek >= 6) {
                workType = WorkType.WEEKEND;
            }

            //근무 상태 판별 - 비정상출근(근로시간 외 출근) / 지각
            LocalTime policyEndTime = targetPolicy.getEndTime();
            LocalTime policyCoreEndTime = targetPolicy.getCoreEndTime();
            LocalTime limitTime = (targetAttendance.isVacationed() && VacationType.HALF_AM.equals(targetAttendance.getVacationType()))
                    ? targetPolicy.getHalfLeaveStartTime().plus(targetPolicy.getAllowMarginMinute(), ChronoUnit.MINUTES)
                    : targetPolicy.getStartTime().plus(targetPolicy.getAllowMarginMinute(), ChronoUnit.MINUTES);

            WorkStatus status = WorkStatus.PRESENT;

            if(policyCoreEndTime != null && currentStartTime.isAfter(policyEndTime)){
                status = WorkStatus.UNNORMAL_START;    //코어타임이 있는 경우 코어타임 이후 출근 비정상 처리
            } else if(currentStartTime.isAfter(policyEndTime)) {
                status = WorkStatus.UNNORMAL_START;    //코어타임이 없는 경우 고정 퇴근시간 이후 출근 비정상 처리
            }else if(currentStartTime.isAfter(limitTime)){
                status = WorkStatus.LATE;
            }

            targetAttendance.setNormalized(status == WorkStatus.PRESENT);
            targetAttendance.setStartTime(startTime);
            targetAttendance.setWorkType(workType);
            targetAttendance.setWorkStatus(status);
            //targetAttendance.setRegisterLatitude(req.getRegisterLatitude());
            //targetAttendance.setRegisterLongitude(req.getRegisterLongitude());
        }

        return targetAttendance;
    }

    private Attendance updateAttendanceByEndTime(Attendance targetAttendance, AttendancePolicy targetPolicy, LocalDateTime endTime) {
        if(targetAttendance != null && targetPolicy != null) {
            LocalTime currentEndTime = endTime.toLocalTime();

            //근무 상태 판별 - 비정상퇴근(7시까지 미퇴근) / 조퇴
            LocalTime limitTime = (targetAttendance.isVacationed() && VacationType.HALF_PM.equals(targetAttendance.getVacationType()))
                    ? targetPolicy.getHalfLeaveEndTime().minus(targetPolicy.getAllowMarginMinute(), ChronoUnit.MINUTES)
                    : targetPolicy.getEndTime().minus(targetPolicy.getAllowMarginMinute(), ChronoUnit.MINUTES);

            boolean normalized = targetAttendance.isNormalized();
            WorkStatus status = targetAttendance.getWorkStatus();
            if(currentEndTime.isBefore(LocalTime.of(7,0))){
                status = WorkStatus.UNNORMAL_END;    //오전 7시 이전 퇴근 비정상퇴근 처리
                normalized = false;
            }else if(currentEndTime.isBefore(limitTime)){
                status = WorkStatus.EARLY_LEAVE;
                normalized = false;
            }

            // 총 근무 / 초과 근무 시간 계산
            Duration duration = Duration.between(targetAttendance.getStartTime(), endTime);
            long totalMinutes = duration.toMinutes();
            long overtimeMinutes = 0;

            // 총근무 시간이 1일 근무 시간 + 1시간(법정휴게시간) 보다 30분 이상인 경우 초과 근무 처리
            Integer workingTimeDay = targetPolicy.getWorkingTimeDay();
            Integer overStandardTime = workingTimeDay + 60 + 30;
            if (totalMinutes >= overStandardTime) {
                overtimeMinutes = totalMinutes - overStandardTime;
            }

            targetAttendance.setEndTime(endTime);
            targetAttendance.setNormalized(normalized);
            targetAttendance.setWorkStatus(status);
            targetAttendance.setTotalWorkMinute(totalMinutes);
            targetAttendance.setOvertimeMinute(overtimeMinutes);
        }

        return targetAttendance;
    }

    private AttendancePolicy findAttendancePolicy(Long memberId) {
        AttendancePolicyMap attendancePolicyMap = attendancePolicyMapRepository.findTopByMemberIdAndDeletedFalseOrderByMappingIdDesc(memberId).orElse(null);
        AttendancePolicy attendancePolicy = attendancePolicyRepository.findByAttendancePolicyId(attendancePolicyMap != null ? attendancePolicyMap.getAttendancePolicyId() : 1).orElseThrow();
        return attendancePolicy;
    }

    private AttendanceResponseDto findStatData (Long memberId, LocalDate workDate, AttendancePolicy targetPolicy) {
        //휴일 데이터
        List<HolidayCalendar> holidayCalendarList = holidayCalendarRepository.findByYearEquals(String.valueOf(workDate.getYear()));
        Map<LocalDate,String> holidayMap = holidayCalendarList.stream().collect(Collectors.toMap(a -> a.getStartDate() , a -> a.getSubject()));

        //단위 기간으로 근태 데이터 조회
        Set<Integer> dayOfWeekSet =  Arrays.stream(targetPolicy.getWorkDayOfWeek().trim().split(",")).map(Integer::valueOf).collect(Collectors.toSet()); // 근무요일
        SettlementPeriod settlementPeriod = targetPolicy.getSettlementPeriod(); // 정산 기준 단위
        Map<String, LocalDate> resolveDateRange = resolveDateRange(settlementPeriod, workDate);
        LocalDate start = resolveDateRange.get("start");
        LocalDate end = resolveDateRange.get("end");

        Long defaultTotalWorkDay = start.datesUntil(end.plusDays(1))
                .filter(date -> dayOfWeekSet.contains(date.getDayOfWeek().getValue()))
                .filter(data -> holidayMap.get(data) == null)
                .count(); // 단위 근로일

        Integer defaultDayWorkTime = targetPolicy.getWorkingTimeDay(); // 일일 기준 근로시간(분)
        Long defaultTotalWorkTime = defaultTotalWorkDay * defaultDayWorkTime; // 단위 근로시간(분)

        List<Attendance> weekAttendanceData = attendanceRepository.findAllByMemberIdAndWorkDateBetween(memberId, start, end);

        Long effectiveWorkDay = defaultTotalWorkDay;
        Long effectiveWorkTime = defaultTotalWorkTime;
        Long workTime = Long.valueOf(0); //분 단위
        Long vacationTime = Long.valueOf(0); //분 단위

        if(weekAttendanceData != null && weekAttendanceData.size() > 0) {
            for (Attendance attendance : weekAttendanceData) {
                if(attendance.isVacationed()) {
                    if(attendance.getVacationType().equals(VacationType.FULL) ){
                        effectiveWorkDay -= 1;
                        effectiveWorkTime -= defaultDayWorkTime;
                        vacationTime +=  defaultDayWorkTime ;
                    }else {
                        effectiveWorkTime -= defaultDayWorkTime / 2;
                        vacationTime += Long.valueOf( defaultDayWorkTime / 2 );

                        if (attendance.getTotalWorkMinute() != null) {
                            workTime += attendance.getTotalWorkMinute();
                        }
                    }
                }else{
                    if(attendance.getTotalWorkMinute() != null){
                        workTime += attendance.getTotalWorkMinute();
                    }
                }
            }
        }

        AttendanceResponseDto resDto = new AttendanceResponseDto();
        resDto.setAttendanceType(targetPolicy.getAttendanceType());
        resDto.setSettlementPeriod(targetPolicy.getSettlementPeriod());
        resDto.setWorktimeRule(targetPolicy.getWorktimeRule());
        resDto.setStartTime(targetPolicy.getStartTime());
        resDto.setEndTime(targetPolicy.getEndTime());

        resDto.setMaxPolicyWorkTime(settlementPeriod.getMaxMinute());
        resDto.setPolicyWorkDay(defaultTotalWorkDay);
        resDto.setPolicyWorkTime(Long.valueOf(defaultTotalWorkTime));
        resDto.setEffectiveWorkDay(effectiveWorkDay);
        resDto.setEffectiveWorkTime(Long.valueOf(effectiveWorkTime));
        resDto.setWorkDay(weekAttendanceData.size());
        resDto.setWorkTime(workTime);
        resDto.setVacationTime(vacationTime);

        return resDto;
    }

    public Map<String, LocalDate> resolveDateRange(SettlementPeriod period, LocalDate today) {
        Map<String, LocalDate> dateMap = new HashMap<>();

        switch (period) {
            case WEEK -> {
                LocalDate monday = today.with(DayOfWeek.MONDAY);
                LocalDate sunday = today.with(DayOfWeek.SUNDAY);

                dateMap.put("start", monday);
                dateMap.put("end", sunday);
                return dateMap;
            }

            case WEEK_2 -> {
                LocalDate monday = today.with(DayOfWeek.MONDAY);
                LocalDate sunday = monday.plusWeeks(2).with(DayOfWeek.SUNDAY);

                dateMap.put("start", monday);
                dateMap.put("end", sunday);
                return dateMap;
            }

            case MONTH -> {
                LocalDate start = today.withDayOfMonth(1);
                LocalDate end = today.withDayOfMonth(today.lengthOfMonth());

                dateMap.put("start", start);
                dateMap.put("end", end);
                return dateMap;
            }

            case MONTH_2 -> {
                LocalDate start = today.withDayOfMonth(1);
                LocalDate end = start.plusMonths(2).minusDays(1);

                dateMap.put("start", start);
                dateMap.put("end", end);
                return dateMap;
            }

            case MONTH_3 -> {
                LocalDate start = today.withDayOfMonth(1);
                LocalDate end = start.plusMonths(3).minusDays(1);

                dateMap.put("start", start);
                dateMap.put("end", end);
                return dateMap;
            }

            default -> throw new IllegalArgumentException("Unsupported settlement period: " + period);
        }
    }

}
