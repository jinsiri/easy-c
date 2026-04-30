package org.easyc.schedule.service;

import lombok.RequiredArgsConstructor;

import org.easyc.attendance.dto.AttendanceRequestDto;
import org.easyc.attendance.entity.Attendance;
import org.easyc.attendance.entity.AttendanceApplication;
import org.easyc.attendance.repository.AttendanceApplicationRepository;
import org.easyc.attendance.repository.AttendanceRepository;
import org.easyc.attendance.repository.HolidayCalendarRepository;
import org.easyc.attendance.service.AttendanceService;
import org.easyc.deptMemberMap.entity.DeptMemberMap;
import org.easyc.deptMemberMap.repository.DeptMemberMapRepository;
import org.easyc.member.entity.Member;
import org.easyc.member.repository.MemberRepository;
import org.easyc.schedule.dto.CalendarDayDto;
import org.easyc.schedule.dto.CalendarEventDto;
import org.easyc.schedule.dto.CalendarRequestDto;
import org.easyc.schedule.dto.ScheduleRequestDto;
import org.easyc.schedule.entity.Schedule;
import org.easyc.schedule.repository.ScheduleRepository;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.*;


@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final AttendanceService attendanceService;
    private final ScheduleRepository scheduleRepository;
    private final MemberRepository memberRepository;
    private final DeptMemberMapRepository deptMemberMapRepository;

    public List<Map<String, CalendarDayDto>> getUserMonthSchedules(CalendarRequestDto request) {
        Long memberId = Optional.ofNullable(request.getMemberIds())
                .filter(list -> !list.isEmpty())
                .map(list -> list.get(0))
                .orElseThrow(() -> new IllegalArgumentException("memberIds is required"));

        YearMonth yearMonth = YearMonth.of(request.getDate().getYear(), request.getDate().getMonthValue());
        LocalDate firstDay = yearMonth.atDay(1);
        LocalDate lastDay = yearMonth.atEndOfMonth();

        List<Map<String, CalendarDayDto>> calendarFrame =  attendanceService.createCalendarFrame(firstDay, lastDay, request.getScheduleType());

        Map<LocalDate, List<CalendarEventDto>> attendanceMap = attendanceService.createAttendanceToCalendarMap(memberId, firstDay, lastDay, request.getScheduleType());
        Map<LocalDate, List<CalendarEventDto>> scheduleMap = createScheduleToCalendarMap(memberId, firstDay, lastDay);
        Map<LocalDate, List<AttendanceApplication>> attendanceApplicationMap = attendanceService.createAttendanceAppMap(memberId, firstDay, lastDay);

        List<Map<String, CalendarDayDto>> resultList =
            calendarFrame.stream().map(dayMap -> {

                dayMap.forEach((key, dayDto) -> {
                    LocalDate date = dayDto.getDate();

                    dayDto.addEvents(attendanceMap.getOrDefault(date, List.of()));
                    dayDto.addEvents(scheduleMap.getOrDefault(date, List.of()));
                    dayDto.addApplications(attendanceApplicationMap.getOrDefault(date, List.of()));
                });

                return dayMap;
            }).toList();

        return resultList;
    }

    public void createUserSchedule( ScheduleRequestDto request) {
        Schedule schedule = request.toEntity();
        scheduleRepository.save(schedule);
    }

    public Map<LocalDate, List<CalendarEventDto>> createScheduleToCalendarMap(Long memberId, LocalDate firstDay, LocalDate lastDay){
        DeptMemberMap deptMemberMaps = deptMemberMapRepository.findOneByMemberIdWithFetchJoinPrimaryTrue(memberId);
        String memberNm = Optional.ofNullable(deptMemberMaps.getMember().getMemberNm()).orElse(null);
        String deptNm= Optional.ofNullable(deptMemberMaps.getDept().getDeptNm()).orElse(null);
        String jobGrade= Optional.ofNullable(deptMemberMaps.getJobTitle().getJobTitleNm()).orElse(null);

        if(deptMemberMaps == null){
            Member member = memberRepository.findByMemberId(memberId).orElseThrow();
            memberNm = member.getMemberNm();
        }

        List<Schedule> scheduleList = scheduleRepository.findByMemberIdAndScheduleStartDateBetweenAndDeletedFalse(memberId, firstDay, lastDay);


        Map<LocalDate, List<CalendarEventDto>> calendarMap = new HashMap<>();
        for (Schedule schedule : scheduleList) {
            LocalDate endDate = schedule.getScheduleEndDate();
            LocalDate startDate = schedule.getScheduleStartDate();
            long diff = ChronoUnit.DAYS.between(startDate, endDate);

            for(int i = 0; i < diff; i++) {
                List<CalendarEventDto> list = calendarMap.getOrDefault(startDate, new ArrayList<>());
                CalendarEventDto dto = new CalendarEventDto(schedule, memberNm, deptNm, jobGrade);
                list.add(dto);

                calendarMap.put(startDate, list);
            }
        }

        return calendarMap;
    }
}
