package org.easyc.schedule.service;

import lombok.RequiredArgsConstructor;

import org.easyc.attendance.dto.AttendanceRequestDto;
import org.easyc.attendance.entity.Attendance;
import org.easyc.attendance.entity.AttendanceApplication;
import org.easyc.attendance.repository.AttendanceApplicationRepository;
import org.easyc.attendance.repository.AttendanceRepository;
import org.easyc.attendance.repository.HolidayCalendarRepository;
import org.easyc.attendance.service.AttendanceService;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.easyc.dept.entity.Dept;
import org.easyc.deptMemberMap.entity.DeptMemberMap;
import org.easyc.deptMemberMap.repository.DeptMemberMapRepository;
import org.easyc.jobTitle.entity.JobTitle;
import org.easyc.member.entity.Member;
import org.easyc.member.repository.MemberRepository;
import org.easyc.schedule.dto.CalendarDayDto;
import org.easyc.schedule.dto.CalendarEventDto;
import org.easyc.schedule.dto.CalendarRequestDto;
import org.easyc.schedule.dto.ScheduleRequestDto;
import org.easyc.schedule.entity.Schedule;
import org.easyc.schedule.repository.ScheduleRepository;
import org.easyc.vacation.service.VacationService;
import org.springframework.stereotype.Service;

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
    private final VacationService vacationService;

    public List<Map<String, CalendarDayDto>> getUserMonthSchedules(CalendarRequestDto request) {
        Long memberId = Optional.ofNullable(request.getMemberIds())
                .filter(list -> !list.isEmpty())
                .map(list -> list.get(0))
                .orElseThrow(() -> new IllegalArgumentException("memberIds is required"));

        YearMonth yearMonth = YearMonth.of(request.getDate().getYear(), request.getDate().getMonthValue());
        LocalDate firstDay = yearMonth.atDay(1);
        LocalDate lastDay = yearMonth.atEndOfMonth();

        List<Map<String, CalendarDayDto>> calendarFrame =  attendanceService.createCalendarFrame(firstDay, lastDay, request.getScheduleType());
        Map<LocalDate, List<CalendarEventDto>> scheduleMap = attendanceService.createScheduleToCalendarMap(memberId, firstDay, lastDay);
        Map<LocalDate, List<CalendarEventDto>> vacationMap = vacationService.createVacationAppToCalendarMap(memberId, firstDay, lastDay);
        Map<LocalDate, List<AttendanceApplication>> attendanceApplicationMap = attendanceService.createAttendanceAppMap(memberId, firstDay, lastDay);

        List<Map<String, CalendarDayDto>> resultList =
            calendarFrame.stream().map(dayMap -> {
                dayMap.forEach((key, dayDto) -> {
                    LocalDate date = dayDto.getDate();

                    dayDto.addEvents(vacationMap.getOrDefault(date, List.of()));
                    dayDto.addEvents(scheduleMap.getOrDefault(date, List.of()));
                    dayDto.addApplications(attendanceApplicationMap.getOrDefault(date, List.of()));
                });

                return dayMap;
            }).toList();

        return resultList;
    }

    public void createUserSchedule( ScheduleRequestDto request) {
        DeptMemberMap deptMemberMaps = deptMemberMapRepository.findOneByMemberIdWithFetchJoinPrimaryTrue(request.getMemberId());
        String memberNm = Optional.ofNullable(deptMemberMaps)
                .map(DeptMemberMap::getMember)
                .map(Member::getMemberNm)
                .orElse(null);
        String deptNm = Optional.ofNullable(deptMemberMaps)
                .map(DeptMemberMap::getDept)
                .map(Dept::getDeptNm)
                .orElse(null);

        String jobGrade = Optional.ofNullable(deptMemberMaps)
                .map(DeptMemberMap::getJobTitle)
                .map(JobTitle::getJobTitleNm)
                .orElse(null);

        if(deptMemberMaps == null){
            Member member = memberRepository.findByMemberId(request.getMemberId()).orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND));
            memberNm = member.getMemberNm();
        }

        scheduleRepository.save(request.toEntity(memberNm, deptNm, jobGrade));
    }
}
