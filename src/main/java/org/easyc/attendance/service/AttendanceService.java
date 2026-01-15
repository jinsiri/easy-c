package org.easyc.attendance.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.AttendanceCalendarResDto;
import org.easyc.attendance.dto.AttendanceReqDto;
import org.easyc.attendance.dto.AttendanceResDto;
import org.easyc.attendance.dto.AttendanceSaveReqDto;
import org.easyc.attendance.entity.Attendance;
import org.easyc.attendance.repository.AttendanceRepository;
import org.easyc.common.constant.VACATION_TYPE;
import org.easyc.member.repository.MemberRepository;
import org.springframework.stereotype.Service;

import javax.swing.text.DateFormatter;
import java.math.BigDecimal;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjuster;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;

    public AttendanceResDto getAttendanceTodayData (AttendanceReqDto req){
        Long memberId = req.getMemberId();
        String workDateStr = req.getWorkDate();
        LocalDate workDate = LocalDate.parse(workDateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        Attendance targetAttendance = attendanceRepository.findAllByMemberIdAndWorkDate(memberId, workDate);
        AttendanceResDto findWeekData = findWeekData(memberId, workDate);

        AttendanceResDto result = new AttendanceResDto(targetAttendance);
        result.setTotalWorkDay(findWeekData.getTotalWorkDay());
        result.setTotalWorkTime(findWeekData.getTotalWorkTime());
        result.setWorkDay(findWeekData.getWorkDay());
        result.setWorkTime(findWeekData.getWorkTime());
        result.setVacationTime(findWeekData.getVacationTime());

        return result;
    }

    public List<Map<String, AttendanceCalendarResDto>> getAttendanceCalendarData(AttendanceReqDto req) {
        Long memberId = req.getMemberId();
        String workDateStr = req.getWorkDate();
        LocalDate workDate = LocalDate.parse(workDateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        Integer targetYear = workDate.getYear();
        Integer targetMonth = workDate.getMonthValue();

        YearMonth yearMonth = YearMonth.of(targetYear, targetMonth);
        LocalDate firstDay = yearMonth.atDay(1);
        LocalDate lastDay = yearMonth.atEndOfMonth();

        List<Attendance> targetMonthAttendanceList = attendanceRepository.findAllByMemberIdAndWorkDateBetween(memberId, firstDay, lastDay);
        Map<Integer, Attendance> attendanceMap = targetMonthAttendanceList.stream()
                .collect(Collectors.toMap(a -> a.getWorkDate().getDayOfMonth(), a -> a));

        String[] weekKeys = {"mon", "tue", "wed", "thu", "fri", "sat", "sun"};
        List<Map<String, AttendanceCalendarResDto>> calendarList = new ArrayList<>();
        Map<String, AttendanceCalendarResDto> currentWeek = new LinkedHashMap<>();

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
            AttendanceCalendarResDto dto = createResDto(cursor, targetAttendance, true );
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

    public Map<String, Object> startAttendanceData (AttendanceSaveReqDto req, String ipAddress) {
        Long memberId = req.getMemberId();
        String startTimeStr = req.getStartTime();
        BigDecimal registerLatitude = req.getRegisterLatitude();
        BigDecimal registerLongitude = req.getRegisterLongitude();

        //시간 포맷팅
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime startTime = LocalDateTime.parse(startTimeStr, formatter);
        LocalDate workDate = startTime.toLocalDate();

        Map<String, Object> res = new HashMap<>();
        try {
            /** ip Address가 등록한 IP와 같은지 확인하는 로직 추가 필요 */

            /** 기준 시간 대비 현재 출근 시간 판별하여 status - NOMAL, RATE 처리 */

            Attendance attendance = new Attendance();
            attendance.setMemberId(memberId);
            attendance.setRegisterIp(ipAddress);
            attendance.setWorkDate(workDate);
            attendance.setStartTime(startTime);
            attendance.setRegisterLatitude(registerLatitude);
            attendance.setRegisterLongitude(registerLongitude);

            Attendance targetAttendance = attendanceRepository.saveAndFlush(attendance);
            AttendanceResDto findWeekData = findWeekData(memberId, workDate);

            AttendanceResDto result = new AttendanceResDto(targetAttendance);
            result.setTotalWorkDay(findWeekData.getTotalWorkDay());
            result.setTotalWorkTime(findWeekData.getTotalWorkTime());
            result.setWorkDay(findWeekData.getWorkDay());
            result.setWorkTime(findWeekData.getWorkTime());
            result.setVacationTime(findWeekData.getVacationTime());

            res.put("status", "success");
            res.put("message", "출근 시간이 등록되었습니다.");
            res.put("attendanceData", result);
        } catch (Exception e){res.put("status", "error");
            res.put("message", "출근 시간 등록에 실패했습니다.");
        }

        return res;
    }

    public Map<String, Object> finishAttendanceCalendar (AttendanceSaveReqDto req, String ipAddress) {
        Long memberId = req.getMemberId();
        String endTimeStr = req.getEndTime();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime endTime = LocalDateTime.parse(endTimeStr, formatter);
        LocalDate workDate = endTime.toLocalDate();

        Map<String, Object> res = new HashMap<>();
        try {
            Attendance attendance = attendanceRepository.findAllByMemberIdAndWorkDate(memberId, workDate);

            /** status 로직 추가 필요 */
            LocalDateTime startTime = attendance.getStartTime();
            Duration duration = Duration.between(startTime, endTime);

            Long totalTime = duration.toMinutes();
            Long overTime = totalTime - Long.valueOf(8 * 60);

            attendance.setEndTime(endTime);
            attendance.setTotalWorkMinute(totalTime);
            attendance.setOvertimeMinute(overTime > 60 ? overTime - 60 : 0);
            attendanceRepository.save(attendance);

            res.put("status", "success");
            res.put("message", "퇴근 시간이 등록되었습니다.");
        } catch (Exception e){res.put("status", "error");
            res.put("message", "퇴근 시간 등록에 실패했습니다.");
        }

        return res;
    }

    private AttendanceCalendarResDto createResDto(LocalDate date, Attendance attendance, boolean isCurrentMonth) {
        AttendanceCalendarResDto dto = new AttendanceCalendarResDto();

        if (attendance != null) {
            dto = new AttendanceCalendarResDto(attendance);
        }

        dto.setDay(date.getDayOfMonth());
        dto.setIsCurrentMonth(isCurrentMonth);
        return dto;
    }

    private AttendanceResDto findWeekData (Long memberId, LocalDate workDate) {
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
                if(attendance.getVacationed() != null && attendance.getVacationed()) {
                    if(attendance.getVacationType().equals(VACATION_TYPE.FULL) ){
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

        AttendanceResDto resDto = new AttendanceResDto();
        resDto.setTotalWorkDay(defaultWorkDay);
        resDto.setTotalWorkTime(defaultWorkTime);
        resDto.setWorkDay(weekAttendanceData.size());
        resDto.setWorkTime(workTime);
        resDto.setVacationTime(vacationTime);

        return resDto;
    }

}
