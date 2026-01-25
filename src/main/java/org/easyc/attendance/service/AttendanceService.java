package org.easyc.attendance.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.AttendanceCalendarResponseDto;
import org.easyc.attendance.dto.AttendanceRequestDto;
import org.easyc.attendance.dto.AttendanceResponseDto;
import org.easyc.attendance.dto.AttendanceSaveRequestDto;
import org.easyc.attendance.entity.Attendance;
import org.easyc.attendance.entity.AttendancePolicy;
import org.easyc.attendance.repository.AttendancePolicyRepository;
import org.easyc.attendance.repository.AttendanceRepository;
import org.easyc.common.constant.VacationType;
import org.easyc.common.constant.WorkStatus;
import org.easyc.common.constant.WorkType;
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

    public AttendanceResponseDto getAttendanceTodayData (AttendanceRequestDto req){
        LocalDate workDate = parseDate(req.getWorkDate());

        Attendance targetAttendance = attendanceRepository.findByMemberIdAndWorkDate(req.getMemberId(), workDate).orElseGet(() -> Attendance.builder()
                .memberId(req.getMemberId())
                .workDate(workDate)
                .build());

        AttendanceResponseDto findWeekData = findWeekData(req.getMemberId(), workDate);

        AttendanceResponseDto result = new AttendanceResponseDto(targetAttendance);
        result.setTotalWorkDay(findWeekData.getTotalWorkDay());
        result.setTotalWorkTime(findWeekData.getTotalWorkTime());
        result.setWorkDay(findWeekData.getWorkDay());
        result.setWorkTime(findWeekData.getWorkTime());
        result.setVacationTime(findWeekData.getVacationTime());

        return result;
    }

    public List<Map<String, AttendanceCalendarResponseDto>> getAttendanceCalendarData(AttendanceRequestDto req) {
        Long memberId = req.getMemberId();
        String workDateStr = req.getWorkDate();
        LocalDate workDate = parseDate(workDateStr);

        Integer targetYear = workDate.getYear();
        Integer targetMonth = workDate.getMonthValue();

        YearMonth yearMonth = YearMonth.of(targetYear, targetMonth);
        LocalDate firstDay = yearMonth.atDay(1);
        LocalDate lastDay = yearMonth.atEndOfMonth();

        List<Attendance> targetMonthAttendanceList = attendanceRepository.findAllByMemberIdAndWorkDateBetween(memberId, firstDay, lastDay);
        Map<Integer, Attendance> attendanceMap = targetMonthAttendanceList.stream()
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
        Attendance targetAttendance = attendanceRepository.findByMemberIdAndWorkDate(req.getMemberId(), workDate)
                .orElseGet(() -> Attendance.builder()
                        .memberId(req.getMemberId())
                        .workDate(workDate)
                        .build());

        // 상태업데이트 해서 save
        Attendance saveTargetAttendance = attendanceRepository.saveAndFlush(updateAttendanceByStartTime(req, targetAttendance, startTime));

       // 주단위 데이터 생성
        AttendanceResponseDto findWeekData = findWeekData(req.getMemberId(), workDate);

        AttendanceResponseDto result = new AttendanceResponseDto(saveTargetAttendance);
        result.setTotalWorkDay(findWeekData.getTotalWorkDay());
        result.setTotalWorkTime(findWeekData.getTotalWorkTime());
        result.setWorkDay(findWeekData.getWorkDay());
        result.setWorkTime(findWeekData.getWorkTime());
        result.setVacationTime(findWeekData.getVacationTime());

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
        Attendance targetAttendance = attendanceRepository.findByMemberIdAndWorkDate(req.getMemberId(), workDate).orElseThrow(() -> new RuntimeException(workDate + " 날짜의 출근 기록을 찾을 수 없습니다."));

        // 상태업데이트 해서 save
        Attendance saveTargetAttendance = attendanceRepository.saveAndFlush(updateAttendanceByEndTime(req, targetAttendance, endTime));

        // 주단위 데이터 생성
        AttendanceResponseDto findWeekData = findWeekData(req.getMemberId(), workDate);

        AttendanceResponseDto result = new AttendanceResponseDto(saveTargetAttendance);
        result.setTotalWorkDay(findWeekData.getTotalWorkDay());
        result.setTotalWorkTime(findWeekData.getTotalWorkTime());
        result.setWorkDay(findWeekData.getWorkDay());
        result.setWorkTime(findWeekData.getWorkTime());
        result.setVacationTime(findWeekData.getVacationTime());

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
        }

        dto.setYear(date.getYear());
        dto.setMonth(date.getMonthValue());
        dto.setDay(date.getDayOfMonth());
        dto.setIsCurrentMonth(isCurrentMonth);
        return dto;
    }

    private Attendance updateAttendanceByStartTime(AttendanceSaveRequestDto req, Attendance targetAttendance, LocalDateTime startTime) {
        if(targetAttendance != null){
            //!! 추후에 멤버와 연결된 정보로 다시 수정

            AttendancePolicy targetPolicy = attendancePolicyRepository.findByAttendancePolicyId(Long.valueOf(1))
                    .orElseGet(() -> AttendancePolicy.builder()
                            .startTime(LocalTime.of(9,0))
                            .endTime(LocalTime.of(18,0))
                            .halfLeaveStartTime(LocalTime.of(13,0))
                            .halfLeaveEndTime(LocalTime.of(13,0))
                            .allowMarginMinute(Long.valueOf(5))
                            .workingDay("1,2,3,4,5")
                            .build());

            int dayOfWeek = startTime.getDayOfWeek().getValue();
            LocalTime currentTime = startTime.toLocalTime();

            // 지각 여부 판별
            LocalTime limitTime = (targetAttendance.isVacationed() && VacationType.HALF_AM.name().equals(targetAttendance.getVacationType()))
                    ? targetPolicy.getHalfLeaveStartTime().plus(targetPolicy.getAllowMarginMinute(), ChronoUnit.MINUTES)
                    : targetPolicy.getStartTime().plus(targetPolicy.getAllowMarginMinute(), ChronoUnit.MINUTES);

            String status = currentTime.isAfter(limitTime) ? WorkStatus.LATE.name() : WorkStatus.PRESENT.name();

            // 근무 타입 판별
            String workType = WorkType.NORMAL.name();
            if (dayOfWeek >= 6) {
                workType = WorkType.WEEKEND.name();
            } else if (!targetPolicy.getWorkingDay().contains(String.valueOf(dayOfWeek))) {
                workType = WorkType.HOLIDAY.name();
            }

            targetAttendance.setStartTime(startTime);
            targetAttendance.setWorkStatus(status);
            targetAttendance.setWorkType(workType);
            targetAttendance.setRegisterLatitude(req.getRegisterLatitude());
            targetAttendance.setRegisterLongitude(req.getRegisterLongitude());

        }
        return targetAttendance;
    }

    private Attendance updateAttendanceByEndTime(AttendanceSaveRequestDto req, Attendance targetAttendance, LocalDateTime endTime) {
        if(targetAttendance != null){
            //!! 추후에 멤버와 연결된 정보로 다시 수정
            AttendancePolicy targetPolicy = attendancePolicyRepository.findByAttendancePolicyId(Long.valueOf(1))
                    .orElseGet(() -> AttendancePolicy.builder()
                            .startTime(LocalTime.of(9,0))
                            .endTime(LocalTime.of(18,0))
                            .halfLeaveStartTime(LocalTime.of(13,0))
                            .halfLeaveEndTime(LocalTime.of(13,0))
                            .allowMarginMinute(Long.valueOf(5))
                            .workingDay("1,2,3,4,5")
                            .build());

            // 조퇴 여부 판별
            // 날짜가 바뀌지 않았고(당일 퇴근), 정책의 퇴근 시간보다 일찍 나갔을 때
            LocalTime limitTime = (targetAttendance.isVacationed() && VacationType.HALF_PM.name().equals(targetAttendance.getVacationType()))
                    ? targetPolicy.getHalfLeaveEndTime().minus(targetPolicy.getAllowMarginMinute(), ChronoUnit.MINUTES)
                    : targetPolicy.getEndTime().minus(targetPolicy.getAllowMarginMinute(), ChronoUnit.MINUTES);

            String status = WorkStatus.PRESENT.name();

            // 출근일과 퇴근일이 같을 때만 조퇴
            if (targetAttendance.getWorkDate().equals(endTime.toLocalDate())) {
                if (endTime.toLocalTime().isBefore(limitTime)) {
                    status = WorkStatus.EARLY_LEAVE.name();
                }
            }

            // 총 근무 / 초과 근무 시간
            Duration duration = Duration.between(targetAttendance.getStartTime(), endTime);
            long totalMinutes = duration.toMinutes();
            long overtimeMinutes = 0;

            // 10시간 이상 근무 시
            if (totalMinutes >= 600) { overtimeMinutes = totalMinutes - 600; }

            targetAttendance.setEndTime(endTime);
            targetAttendance.setWorkStatus(status);
            targetAttendance.setTotalWorkMinute(totalMinutes);
            targetAttendance.setOvertimeMinute(overtimeMinutes);
        }

        return targetAttendance;
    }

    private AttendanceResponseDto findWeekData (Long memberId, LocalDate workDate) {
        LocalDate monday = workDate.with(DayOfWeek.MONDAY);
        LocalDate sunday = workDate.with(DayOfWeek.SUNDAY);

        List<Attendance> weekAttendanceData = attendanceRepository.findAllByMemberIdAndWorkDateBetween(memberId, monday, sunday);

        Integer defaultWorkDay = 5;
        Long defaultWorkTime = Long.valueOf(40 * 60); //분 단위
        Long defaultDayWorkTime = Long.valueOf(8 * 60); //분 단위

        Long workTime = Long.valueOf(0); //분 단위
        Long vacationTime = Long.valueOf(0); //분 단위

        if(weekAttendanceData != null && weekAttendanceData.size() > 0) {
            for (Attendance attendance : weekAttendanceData) {
                if(attendance.isVacationed()) {
                    if(attendance.getVacationType().equals(VacationType.FULL) ){
                        vacationTime += Long.valueOf( 8 * 60 );
                    }else {
                        vacationTime += Long.valueOf( 4 * 60 );
                        workTime += Long.valueOf( 4 * 60 );
                    }
                }else{
                    if(attendance.getTotalWorkMinute() != null){
                        workTime += attendance.getTotalWorkMinute();
                    }
                }
            }
        }

        AttendanceResponseDto resDto = new AttendanceResponseDto();
        resDto.setTotalWorkDay(defaultWorkDay);
        resDto.setTotalWorkTime(defaultWorkTime);
        resDto.setWorkDay(weekAttendanceData.size());
        resDto.setWorkTime(workTime);
        resDto.setVacationTime(vacationTime);

        return resDto;
    }

}
