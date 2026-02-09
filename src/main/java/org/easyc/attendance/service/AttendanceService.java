package org.easyc.attendance.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.*;
import org.easyc.attendance.entity.*;
import org.easyc.attendance.repository.*;
import org.easyc.common.constant.*;
import org.easyc.member.entity.Member;
import org.easyc.member.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import static org.easyc.common.util.utilFunc.parseDate;
import static org.easyc.common.util.utilFunc.parseDateTime;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final AttendancePolicyRepository attendancePolicyRepository;
    private final MappingAttendancePolicyRepository mappingAttendancePolicyRepository;
    private final HolidayCalendarRepository holidayCalendarRepository;

    public AttendanceResponseDto getAttendanceTodayData (AttendanceRequestDto req){
        LocalDate workDate = parseDate(req.getWorkDate());

        //데이터 조회
        Attendance targetAttendance = attendanceRepository.findByRegisterUser_UserIdAndWorkDate(req.getLoginId(), workDate).orElseGet(() -> Attendance.builder()
                .workDate(workDate)
                .build());
        AttendancePolicy targetPolicy = findAttendancePolicy(req.getLoginId());

        AttendanceResponseDto findStatData = findStatData(req.getLoginId(), workDate, targetPolicy);
        AttendanceResponseDto result = new AttendanceResponseDto(targetAttendance);
        result.applyWeekData(findStatData);

        return result;
    }

    public List<Map<String, AttendanceCalendarResponseDto>> getAttendanceCalendarData(AttendanceRequestDto req) {
        String loginId = req.getLoginId();
        String workDateStr = req.getWorkDate();
        LocalDate workDate = parseDate(workDateStr);

        Integer targetYear = workDate.getYear();
        Integer targetMonth = workDate.getMonthValue();

        YearMonth yearMonth = YearMonth.of(targetYear, targetMonth);
        LocalDate firstDay = yearMonth.atDay(1);
        LocalDate lastDay = yearMonth.atEndOfMonth();

        List<Attendance> targetMonthAttendanceList = attendanceRepository.findAllByRegisterUser_UserIdAndWorkDateBetween(loginId, firstDay, lastDay);
        Map<Integer, Attendance> attendanceMap = targetMonthAttendanceList.stream()
                .collect(Collectors.toMap(a -> a.getWorkDate().getDayOfMonth(), a -> a));

        List<HolidayCalendar> holidayCalendarList = holidayCalendarRepository.findByYearEquals("2026");
        Map<LocalDate,String> holidayMap = holidayCalendarList.stream().collect(Collectors.toMap(a -> a.getStartDate() , a -> a.getSubject()));


        String[] weekKeys = {"mon", "tue", "wed", "thu", "fri", "sat", "sun"};
        List<Map<String, AttendanceCalendarResponseDto>> calendarList = new ArrayList<>();
        Map<String, AttendanceCalendarResponseDto> currentWeek = new LinkedHashMap<>();

        // 1일 시작 전 이전 달 날짜 채우기 ---
        int firsrDayOfWeek = firstDay.getDayOfWeek().getValue();
        int offset = firsrDayOfWeek - 1; // 월요일(1)이면 0, 수요일(3)이면 2

        if (offset > 0) {
            LocalDate prevMonthCursor = firstDay.minusDays(offset);
            for (int i = 0; i < offset; i++) {
                currentWeek.put(weekKeys[i], createResDto(prevMonthCursor, null, false));
                prevMonthCursor = prevMonthCursor.plusDays(1);
            }
        }

        LocalDate cursor = firstDay;
        while (!cursor.isAfter(lastDay)) {
            DayOfWeek dayOfWeek = cursor.getDayOfWeek();
            String key = weekKeys[dayOfWeek.getValue() - 1];

            Attendance targetAttendance = attendanceMap.get(cursor.getDayOfMonth());
            AttendanceCalendarResponseDto dto = createResDto(cursor, targetAttendance, true );

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
                        currentWeek.put(weekKeys[i], createResDto(nextMonthCursor, null, false));
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

    public Map<String, Object> startAttendanceData (AttendanceSaveRequestDto req, String ipAddress) {
        LocalDateTime startTime = parseDateTime(req.getStartTime());
        LocalDate workDate = startTime.toLocalDate();

        /** ip Address가 등록한 IP와 같은지 확인하는 로직 추가 필요 */

        // 데이터 조회
        Attendance targetAttendance = attendanceRepository.findByRegisterUser_UserIdAndWorkDate(req.getLoginId(), workDate)
                .orElseGet(() -> Attendance.builder()
                        .workDate(workDate)
                        .build());

        AttendancePolicy targetPolicy = findAttendancePolicy(req.getLoginId());

        // 상태업데이트 해서 save
        Attendance saveTargetAttendance = attendanceRepository.saveAndFlush(updateAttendanceByStartTime(req, targetAttendance, targetPolicy, startTime));

       // 주단위 데이터 생성
        AttendanceResponseDto findStatData = findStatData(req.getLoginId(), workDate, targetPolicy);
        AttendanceResponseDto result = new AttendanceResponseDto(saveTargetAttendance);
        result.applyWeekData(findStatData);

        Map<String, Object> res = new HashMap<>();
        res.put("status", "success");
        res.put("message", "출근 시간이 등록되었습니다.");
        res.put("attendanceData", result);

        return res;
    }

    public Map<String, Object> finishAttendanceCalendar (AttendanceSaveRequestDto req, String ipAddress) {
        LocalDateTime endTime = parseDateTime(req.getEndTime());
        LocalTime time = endTime.toLocalTime();

        // 새벽 07:00:00 이전 퇴근일 경우에만 전날(어제) 업무로 간주
        LocalDate workDate = (time.isBefore(LocalTime.of(7, 0)))
                ? endTime.toLocalDate().minusDays(1)
                : endTime.toLocalDate();


        /** ip Address가 등록한 IP와 같은지 확인하는 로직 추가 필요 */

        // 데이터 조회
        Attendance targetAttendance = attendanceRepository.findByRegisterUser_UserIdAndWorkDate(req.getLoginId(), workDate).orElseThrow(() -> new RuntimeException(workDate + " 날짜의 출근 기록을 찾을 수 없습니다."));
        AttendancePolicy targetPolicy = findAttendancePolicy(req.getLoginId());

        // 상태업데이트 해서 save
        Attendance saveTargetAttendance = attendanceRepository.saveAndFlush(updateAttendanceByEndTime(req, targetAttendance, targetPolicy, endTime));

        // 주단위 데이터 생성
        AttendanceResponseDto findStatData = findStatData(req.getLoginId(), workDate, targetPolicy);
        AttendanceResponseDto result = new AttendanceResponseDto(saveTargetAttendance);
        result.applyWeekData(findStatData);

        Map<String, Object> res = new HashMap<>();
        res.put("status", "success");
        res.put("message", "퇴근 시간이 등록되었습니다.");
        res.put("attendanceData", result);

        return res;
    }

    private AttendanceCalendarResponseDto createResDto(LocalDate date, Attendance attendance, boolean isCurrentMonth) {
      AttendanceCalendarResponseDto dto = new AttendanceCalendarResponseDto();

       if (attendance != null) {
            dto = new AttendanceCalendarResponseDto(attendance);

            AttendancePolicy targetPolicy = findAttendancePolicy(attendance.getRegisterUser().getUserId());
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
        if(targetAttendance != null){
            int dayOfWeek = startTime.getDayOfWeek().getValue();
            LocalTime currentTime = startTime.toLocalTime();

            // 지각 여부 판별
            LocalTime limitTime = (targetAttendance.isVacationed() && VacationType.HALF_AM.equals(targetAttendance.getVacationType()))
                    ? targetPolicy.getHalfLeaveStartTime().plus(targetPolicy.getAllowMarginMinute(), ChronoUnit.MINUTES)
                    : targetPolicy.getStartTime().plus(targetPolicy.getAllowMarginMinute(), ChronoUnit.MINUTES);

            WorkStatus status = currentTime.isAfter(limitTime) ? WorkStatus.LATE : WorkStatus.PRESENT;

            // 근무 타입 판별
            WorkType workType = WorkType.NORMAL;
            if (dayOfWeek >= 6) {
                workType = WorkType.WEEKEND;
            } else if (!targetPolicy.getWorkingDay().contains(String.valueOf(dayOfWeek))) {
                workType = WorkType.HOLIDAY;
            }

            targetAttendance.setStartTime(startTime);
            targetAttendance.setNormalized(status != WorkStatus.LATE);
            targetAttendance.setWorkStatus(status);
            targetAttendance.setWorkType(workType);
            targetAttendance.setRegisterLatitude(req.getRegisterLatitude());
            targetAttendance.setRegisterLongitude(req.getRegisterLongitude());

        }
        return targetAttendance;
    }

    private Attendance updateAttendanceByEndTime(AttendanceSaveRequestDto req, Attendance targetAttendance, AttendancePolicy targetPolicy, LocalDateTime endTime) {
        if(targetAttendance != null){

            // 조퇴 여부 판별
            // 날짜가 바뀌지 않았고(당일 퇴근), 정책의 퇴근 시간보다 일찍 나갔을 때
            LocalTime limitTime = (targetAttendance.isVacationed() && VacationType.HALF_PM.equals(targetAttendance.getVacationType()))
                    ? targetPolicy.getHalfLeaveEndTime().minus(targetPolicy.getAllowMarginMinute(), ChronoUnit.MINUTES)
                    : targetPolicy.getEndTime().minus(targetPolicy.getAllowMarginMinute(), ChronoUnit.MINUTES);

            boolean normalized = targetAttendance.isNormalized();
            WorkStatus status = targetAttendance.getWorkStatus();

            // 출근일과 퇴근일이 같을 때만 조퇴
            if (targetAttendance.getWorkDate().equals(endTime.toLocalDate())) {
                if (endTime.toLocalTime().isBefore(limitTime)) {
                    status = WorkStatus.EARLY_LEAVE;
                    normalized = false;
                }
            }

            // 총 근무 / 초과 근무 시간
            Duration duration = Duration.between(targetAttendance.getStartTime(), endTime);
            long totalMinutes = duration.toMinutes();
            long overtimeMinutes = 0;

            // 10시간 이상 근무 시
            if (totalMinutes >= 600) { overtimeMinutes = totalMinutes - 600; }

            targetAttendance.setEndTime(endTime);
            targetAttendance.setNormalized(normalized);
            targetAttendance.setWorkStatus(status);
            targetAttendance.setTotalWorkMinute(totalMinutes);
            targetAttendance.setOvertimeMinute(overtimeMinutes);
        }

        return targetAttendance;
    }

    private AttendancePolicy findAttendancePolicy(String loginId) {
        MappingAttendancePolicy mappingAttendancePolicy = mappingAttendancePolicyRepository.findTopByLoginIdOrderByAttendancePolicyIdDesc(loginId).orElse(null);
        AttendancePolicy attendancePolicy = attendancePolicyRepository.findByAttendancePolicyId(mappingAttendancePolicy != null ? mappingAttendancePolicy.getAttendancePolicyId() : 1).orElseGet(() -> AttendancePolicy.builder()
                .attendancePolicyName("기본 정책")
                .attendanceType(AttendanceType.FIXED)
                .settlementPeriod(SettlementPeriod.WEEK)
                .worktimeRule(WorktimeRule.ALWAYS_40)
                .workingTimeDay( 8 * 60)
                .workingDay("1,2,3,4,5")
                .startTime(LocalTime.of(9,0))
                .endTime(LocalTime.of(18,0))
                .halfLeaveStartTime(LocalTime.of(13,0))
                .halfLeaveEndTime(LocalTime.of(13,0))
                .allowMarginMinute(Long.valueOf(5))
                .build());

        return attendancePolicy;
    }

    private AttendanceResponseDto findStatData (String loginId, LocalDate workDate, AttendancePolicy targetPolicy) {
        //근무시간 정산 기준 가져오기
        Set<Integer> dayOfWeekSet =  Arrays.stream(targetPolicy.getWorkingDay().trim().split(",")).map(Integer::valueOf).collect(Collectors.toSet());

        SettlementPeriod settlementPeriod = targetPolicy.getSettlementPeriod(); // 정산 기준 단위
        Integer defaultTotalWorkDay = dayOfWeekSet.size() * settlementPeriod.getWeekNumber(); // 단위 근로일
        Integer defaultTotalWorkTime = settlementPeriod.getBaseMinute(); // 단위 근로시간(분)
        Integer defaultDayWorkTime = targetPolicy.getWorkingTimeDay();  // 일일 기준 근로시간(분)

        //단위 기간으로 근태 데이터 조회
        Map<String, LocalDate> resolveDateRange = resolveDateRange(settlementPeriod, workDate);
        List<Attendance> weekAttendanceData = attendanceRepository.findAllByRegisterUser_UserIdAndWorkDateBetween(loginId, resolveDateRange.get("start"), resolveDateRange.get("end"));

        Integer effectiveWorkDay = defaultTotalWorkDay;
        Integer effectiveWorkTime = defaultTotalWorkTime;
        Long workTime = Long.valueOf(0); //분 단위
        Long vacationTime = Long.valueOf(0); //분 단위

        if(weekAttendanceData != null && weekAttendanceData.size() > 0) {
            for (Attendance attendance : weekAttendanceData) {
                if(attendance.isVacationed()) {
                    if(attendance.getVacationType().equals(VacationType.FULL) ){
                        effectiveWorkDay -= 1;
                        effectiveWorkTime -= defaultDayWorkTime;
                        vacationTime += Long.valueOf( defaultDayWorkTime );
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
