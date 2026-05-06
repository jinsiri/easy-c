package org.easyc.attendance.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.constant.*;
import org.easyc.attendance.dto.*;
import org.easyc.attendance.entity.*;
import org.easyc.attendance.repository.*;
import org.easyc.common.constant.BasicStatus;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.easyc.deptMemberMap.entity.DeptMemberMap;
import org.easyc.deptMemberMap.repository.DeptMemberMapRepository;
import org.easyc.member.entity.Member;
import org.easyc.member.entity.MemberProfile;
import org.easyc.member.repository.MemberProfileRepository;
import org.easyc.member.repository.MemberRepository;
import org.easyc.memberJobGradeMap.entity.MemberJobGradeMap;
import org.easyc.memberJobGradeMap.repository.MemberJobGradeMapRepository;
import org.easyc.schedule.constant.ScheduleType;
import org.easyc.schedule.dto.CalendarDayDto;
import org.easyc.schedule.dto.CalendarEventDto;
import org.easyc.schedule.dto.CalendarRequestDto;
import org.easyc.schedule.entity.Schedule;
import org.easyc.schedule.repository.ScheduleRepository;
import org.easyc.schedule.service.ScheduleService;
import org.easyc.vacation.constant.VacationType;
import org.easyc.vacation.entity.VacationApplication;
import org.easyc.vacation.repository.VacationApplicationRepository;
import org.easyc.vacation.service.VacationService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
    private final MemberRepository memberRepository;
    private final DeptMemberMapRepository deptMemberMapRepository;
    private final VacationApplicationRepository vacationApplicationRepository;
    private final ScheduleRepository scheduleRepository;

    private final VacationService vacationService;

    public AttendanceDayResponseDto getAttendanceUserData(AttendanceRequestDto req) {
        LocalDate workDate =  req.getWorkDate().toLocalDate();
        Attendance attendance = attendanceRepository.findByMemberIdAndWorkDateAndDeletedFalse(req.getMemberId(),workDate).orElse(new Attendance());
        return AttendanceDayResponseDto.fromEntity(attendance);
    }

    public AttendanceResponseDto getAttendanceTodayData (AttendanceRequestDto req){
        LocalDate workDate = req.getWorkDate().toLocalDate();
        LocalTime workTime = req.getWorkDate().toLocalTime();
        AttendancePolicy targetPolicy = findAttendancePolicy(req.getMemberId());

        //데이터 조회 - 오전 7시 이전이면 이전 데이터 이후면 당일 데이터
        Attendance targetAttendance = null;
        if(workTime.isBefore(LocalTime.of(7, 0))){
            Attendance beforeAttendance = attendanceRepository.findByMemberIdAndWorkDateAndDeletedFalse(req.getMemberId(), workDate.minus(1, ChronoUnit.DAYS)).orElse(null);
            if(beforeAttendance != null && beforeAttendance.getStartTime() != null && beforeAttendance.getEndTime() == null){
                targetAttendance = beforeAttendance;
            }
        }

        if(targetAttendance == null){
            targetAttendance = attendanceRepository.findByMemberIdAndWorkDateAndDeletedFalse(req.getMemberId(), workDate).orElse(
                    Attendance.builder()
                            .memberId(req.getMemberId())
                            .workDate(workDate)
                            .attendancePolicyName(targetPolicy.getAttendancePolicyName())
                            .build()
            );
        }

        AttendanceResponseDto findStatData = findStatData(req.getMemberId(), workDate, targetPolicy);
        AttendanceResponseDto result = new AttendanceResponseDto(targetAttendance);
        result.applyWeekData(findStatData);
        return result;
    }

    public List<Map<String, CalendarDayDto>> getAttendanceCalendarData(CalendarRequestDto request) {
        Long memberId = request.getMemberIds().get(0);

        YearMonth yearMonth = YearMonth.of(request.getDate().getYear(), request.getDate().getMonthValue());
        LocalDate firstDay = yearMonth.atDay(1);
        LocalDate lastDay = yearMonth.atEndOfMonth();

        List<Map<String, CalendarDayDto>> calendarFrame = createCalendarFrame(firstDay, lastDay, request.getScheduleType());

        Map<LocalDate, List<CalendarEventDto>> vacationMap = vacationService.createVacationAppToCalendarMap(memberId, firstDay, lastDay);
        Map<LocalDate, List<CalendarEventDto>> scheduleMap = createRemoteToCalendarMap(memberId, firstDay, lastDay);
        Map<LocalDate, AttendanceDayResponseDto> attendanceMap = createAttendanceMap(memberId, firstDay, lastDay, "PERSONAL");
        Map<LocalDate, List<AttendanceApplication>> attendanceApplicationMap = createAttendanceAppMap(memberId, firstDay, lastDay);

        List<Map<String, CalendarDayDto>> resultList =
                calendarFrame.stream().map(dayMap -> {
                    dayMap.forEach((key, dayDto) -> {
                        LocalDate date = dayDto.getDate();

                        dayDto.addEvents(vacationMap.getOrDefault(date, List.of()));
                        dayDto.addEvents(scheduleMap.getOrDefault(date, List.of()));
                        dayDto.addAttendance(attendanceMap.getOrDefault(date, new AttendanceDayResponseDto()));
                        dayDto.addApplications(attendanceApplicationMap.getOrDefault(date, List.of()));
                    });

                    return dayMap;
                }).toList();

        return resultList;
    }

    public void startAttendanceData (AttendanceSaveRequestDto req) {
        LocalDateTime startTime = req.getStartTime();
        LocalDate workDate = startTime.toLocalDate();

        // 유관 데이터 조회
        AttendancePolicy targetPolicy = findAttendancePolicy(req.getMemberId());
        Attendance targetAttendance = attendanceRepository.findByMemberIdAndWorkDateAndDeletedFalse(req.getMemberId(), workDate).orElse(null);

        if(targetAttendance == null){
            targetAttendance = makeNewAttendance(req.getMemberId(), workDate, targetPolicy);
        }

        Attendance updateAttendance = updateAttendanceByStartTime(targetAttendance, targetPolicy, startTime);
        attendanceRepository.save(updateAttendance);
    }

    public void finishAttendanceData (AttendanceSaveRequestDto req) {
        if(req.getAttendanceId() == null){
            throw new CustomException(CustomExceptionCode.ATTENDANCE_NOT_FOUND);
        }

        // 유관 데이터 조회
        AttendancePolicy targetPolicy = findAttendancePolicy(req.getMemberId());

        // 데이터 조회
        Attendance targetAttendance = attendanceRepository.findByMemberIdAndAttendanceIdAndDeletedFalse(req.getMemberId(), req.getAttendanceId()).orElseThrow();

        // 상태업데이트 해서 save
        attendanceRepository.saveAndFlush(updateAttendanceByEndTime(targetAttendance, targetPolicy, req.getEndTime()));
    }

    public void saveVacationAttendance (VacationApplication application) {
        LocalDate startDate = application.getStartDate();
        LocalDate endDate = application.getEndDate();
        long duration = endDate != null ? ChronoUnit.DAYS.between(startDate, endDate) : 0;

        List<Attendance> prevAttendanceList = attendanceRepository.findAllByMemberIdAndWorkDateBetweenAndDeletedFalse(application.getMemberId(), startDate, endDate);
        Map<LocalDate, Attendance> prevAttendanceMap = prevAttendanceList.stream().collect(Collectors.toMap(a -> a.getWorkDate(), a-> a));

        List<Attendance> attendanceList = new ArrayList<>();
        for(long i = 0; i <= duration; i++){
            LocalDate currentDate = startDate.plusDays(i);

            Attendance prevAttendance = prevAttendanceMap.get(currentDate);
            //해당 날짜에 데이터 있으면 지우고 새 근태 생성
            if(prevAttendance != null){
                prevAttendance.delete();
                attendanceList.add(prevAttendance);
            }

            Attendance result = Attendance.builder()
                    .memberId(application.getMemberId())
                    .memberNm(application.getMemberNm())
                    .deptNm(application.getDeptNm())
                    .jobGrade(application.getJobGrade())
                    .workDate(currentDate)
                    .workType(WorkType.NORMAL)
                    .workStatus(WorkStatus.VACATION)
                    .violationReason(application.getViolationReason())
                    .vacationAppId(application.getVacationApplicationId())
                    .build();

            attendanceList.add(result);
        }

        attendanceRepository.saveAll(attendanceList);
    }


    public Attendance makeNewAttendance(Long memberId, LocalDate workDate, AttendancePolicy targetPolicy) {
        DeptMemberMap deptMemberMaps = deptMemberMapRepository.findOneByMemberIdWithFetchJoinPrimaryTrue(memberId);

        if(targetPolicy == null){
            targetPolicy = findAttendancePolicy(memberId);
        }

        Attendance result = new Attendance();
        if(deptMemberMaps == null){
            Member member = memberRepository.findByMemberId(memberId)
                    .orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND));

            result = Attendance.builder()
                    .memberId(memberId)
                    .memberNm(member.getMemberNm())
                    .attendancePolicyName(targetPolicy.getAttendancePolicyName())
                    .workDate(workDate)
                    .build();

        }else{
            result = Attendance.builder()
                    .memberId(memberId)
                    .memberNm(deptMemberMaps.getMember().getMemberNm())
                    .deptNm(deptMemberMaps.getDept().getDeptNm())
                    .jobGrade(deptMemberMaps.getJobTitle().getJobTitleNm())
                    .attendancePolicyName(targetPolicy.getAttendancePolicyName())
                    .workDate(workDate)
                    .build();
        }

        return result;
    }

    public Attendance updateAttendanceByStartTime(Attendance targetAttendance, AttendancePolicy targetPolicy, LocalDateTime startTime) {
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
            VacationType vacationType = null;
            if(targetAttendance.getVacationAppId() != null){
                VacationApplication vacationApp = vacationApplicationRepository.findByVacationApplicationIdAndDeletedFalse(targetAttendance.getVacationAppId()).orElse(null);
                if(vacationApp != null){ vacationType = vacationApp.getVacationType(); }
            }

            LocalTime policyEndTime = targetPolicy.getEndTime();
            LocalTime policyCoreEndTime = targetPolicy.getCoreEndTime();
            LocalTime limitTime = (targetAttendance.getVacationAppId() != null && VacationType.HALF_AM.equals(vacationType))
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
        }

        return targetAttendance;
    }

    public Attendance updateAttendanceByEndTime(Attendance targetAttendance, AttendancePolicy targetPolicy, LocalDateTime endTime) {
        if(targetAttendance != null && targetPolicy != null) {
            LocalTime currentEndTime = endTime.toLocalTime();

            //근무 상태 판별 - 비정상퇴근(7시까지 미퇴근) / 조퇴
            VacationType vacationType = null;
            if(targetAttendance.getVacationAppId() != null){
                VacationApplication vacationApp = vacationApplicationRepository.findByVacationApplicationIdAndDeletedFalse(targetAttendance.getVacationAppId()).orElse(null);
                if(vacationApp != null){ vacationType = vacationApp.getVacationType(); }
            }

            LocalTime limitTime = (targetAttendance.getVacationAppId() != null && VacationType.HALF_PM.equals(vacationType))
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

    public AttendancePolicy findAttendancePolicy(Long memberId) {
        AttendancePolicyMap attendancePolicyMap = attendancePolicyMapRepository.findTopByMemberIdAndActivedTrueOrderByMappingIdDesc(memberId).orElse(null);
        AttendancePolicy attendancePolicy = attendancePolicyRepository.findByAttendancePolicyIdAndActiveTrue(attendancePolicyMap != null ? attendancePolicyMap.getAttendancePolicyId() : 1).orElseThrow();
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

        List<Attendance> weekAttendanceData = attendanceRepository.findAllByMemberIdAndWorkDateBetweenAndDeletedFalse(memberId, start, end);

        Long effectiveWorkDay = defaultTotalWorkDay;
        Long effectiveWorkTime = defaultTotalWorkTime;
        Long workTime = Long.valueOf(0); //분 단위
        Long vacationTime = Long.valueOf(0); //분 단위

        List<Long> vacationAppIdList = weekAttendanceData.stream()
                .map(Attendance::getVacationAppId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        List<VacationApplication> vacationApplicationList = vacationApplicationRepository.findAllByVacationApplicationIdInAndDeletedFalse(vacationAppIdList);
        Map<Long, VacationApplication> vacationApplicationMap = vacationApplicationList.stream().collect(Collectors.toMap(
                a -> a.getVacationApplicationId() , a -> a));

        if(weekAttendanceData != null && weekAttendanceData.size() > 0) {
            for (Attendance attendance : weekAttendanceData) {
                if(attendance.getVacationAppId() != null) {
                    VacationApplication targetVacationApp = vacationApplicationMap.get(attendance.getVacationAppId());

                    if(targetVacationApp.getVacationType().equals(VacationType.FULL) ){
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

        return AttendanceResponseDto.builder()
                .attendanceType(targetPolicy.getAttendanceType())
                .settlementPeriod(targetPolicy.getSettlementPeriod())
                .worktimeRule(targetPolicy.getWorktimeRule())
                .startTime(targetPolicy.getStartTime())
                .endTime(targetPolicy.getEndTime())
                .maxPolicyWorkTime(settlementPeriod.getMaxMinute())
                .policyWorkDay(defaultTotalWorkDay)
                .policyWorkTime(Long.valueOf(defaultTotalWorkTime))
                .effectiveWorkDay(effectiveWorkDay)
                .effectiveWorkTime(Long.valueOf(effectiveWorkTime))
                .workDay(weekAttendanceData.size())
                .workTime(workTime)
                .vacationTime(vacationTime)
                .build();

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


    //
    public Map<LocalDate, AttendanceDayResponseDto> createAttendanceMap(Long memberId, LocalDate firstDay, LocalDate lastDay, String scheduleType){
        List<Attendance> targetMonthAttendanceList = attendanceRepository.findAllByMemberIdAndWorkDateBetweenAndDeletedFalseOrderByWorkDateAsc(memberId, firstDay, lastDay);

        Map<LocalDate, AttendanceDayResponseDto> calendarMap = new HashMap<>();
        targetMonthAttendanceList.stream().forEach(attendance -> {
            LocalDate date = attendance.getWorkDate();
            calendarMap.put(date, AttendanceDayResponseDto.fromEntity(attendance));
        });

        return calendarMap;
    }

    public Map<LocalDate, List<CalendarEventDto>> createScheduleToCalendarMap(Long memberId, LocalDate firstDay, LocalDate lastDay){
        List<Schedule> scheduleList = scheduleRepository.findByMemberIdAndStartDateBetweenAndDeletedFalse(memberId, firstDay, lastDay);

        Map<LocalDate, List<CalendarEventDto>> calendarMap = new HashMap<>();
        for (Schedule schedule : scheduleList) {
            LocalDate endDate = schedule.getEndDate();
            LocalDate startDate = schedule.getStartDate();
            long diff = endDate != null ? ChronoUnit.DAYS.between(startDate, endDate): 0;

            for(int i = 0; i <= diff; i++) {
                LocalDate targetDate = startDate.plusDays(i);
                List<CalendarEventDto> list = calendarMap.getOrDefault(targetDate, new ArrayList<>());
                CalendarEventDto dto = CalendarEventDto.fromSchedule(schedule);
                list.add(dto);

                calendarMap.put(targetDate, list);
            }
        }
        return calendarMap;
    }

    public Map<LocalDate, List<CalendarEventDto>> createRemoteToCalendarMap(Long memberId, LocalDate firstDay, LocalDate lastDay){
        List<Schedule> scheduleList = scheduleRepository.findByMemberIdAndStartDateBetweenAndScheduleTypeInAndDeletedFalse(memberId, firstDay, lastDay, List.of(ScheduleType.OUTSIDE, ScheduleType.BUSINESS_TRIP));

        Map<LocalDate, List<CalendarEventDto>> calendarMap = new HashMap<>();
        for (Schedule schedule : scheduleList) {
            LocalDate endDate = schedule.getEndDate();
            LocalDate startDate = schedule.getStartDate();
            long diff = endDate != null ? ChronoUnit.DAYS.between(startDate, endDate): 0;

            for(int i = 0; i <= diff; i++) {
                LocalDate targetDate = startDate.plusDays(i);
                List<CalendarEventDto> list = calendarMap.getOrDefault(targetDate, new ArrayList<>());
                CalendarEventDto dto = CalendarEventDto.fromSchedule(schedule);
                list.add(dto);

                calendarMap.put(targetDate, list);
            }
        }
        return calendarMap;
    }

    public Map<LocalDate, List<AttendanceApplication>> createAttendanceAppMap(Long memberId, LocalDate firstDay, LocalDate lastDay){
        List<AttendanceApplication> targetAttendanceChangeRequestList = attendanceApplicationRepository.findAllByMemberIdAndWorkDateBetweenAndDeletedFalseOrderByWorkDate(memberId, firstDay, lastDay);
        Map<LocalDate, List<AttendanceApplication>> changeRequestMap =
                targetAttendanceChangeRequestList.stream()
                        .collect(Collectors.groupingBy(
                                a -> a.getWorkDate()
                        ));

        return changeRequestMap;
    }

    private Map<LocalDate,String> createHolidayMap(Integer targetYear){
        List<HolidayCalendar> holidayCalendarList = holidayCalendarRepository.findByYearEquals(targetYear.toString());
        Map<LocalDate,String> holidayMap = holidayCalendarList.stream()
                .collect(Collectors.toMap(
                        a -> a.getStartDate() ,
                        a -> a.getSubject(),
                        (existing, replacement) -> existing
                ));

        return holidayMap;
    }

    private CalendarDayDto createCalendarItem(LocalDate date, boolean isCurrentMonth, String holidaySubject, String scheduleType){
        CalendarDayDto calendarDayDto = CalendarDayDto.builder()
                .date(date)
                .scheduleType(scheduleType)
                .isCurrentMonth(isCurrentMonth)
                .isHoliday(holidaySubject != null)
                .holidaySubject(holidaySubject)
                .build();

        return calendarDayDto;
    }

    public List<Map<String, CalendarDayDto>> createCalendarFrame(LocalDate firstDay, LocalDate lastDay, String scheduleType){
        String[] weekKeys = {"mon", "tue", "wed", "thu", "fri", "sat", "sun"};
        List<Map<String, CalendarDayDto>> calendarList = new ArrayList<>();
        Map<String, CalendarDayDto> currentWeek = new LinkedHashMap<>();

        Map<LocalDate,String> holidayMap = createHolidayMap(firstDay.getYear());

        // 1일 시작 전 이전 달 날짜 채우기 ---
        int offset = firstDay.getDayOfWeek().getValue() - 1; // 월요일(1)이면 0, 수요일(3)이면 2
        if (offset > 0) {
            LocalDate prevMonthCursor = firstDay.minusDays(offset);
            for (int i = 0; i < offset; i++) {
                CalendarDayDto calendarDayDto = createCalendarItem(prevMonthCursor, false, holidayMap.get(prevMonthCursor), scheduleType);
                currentWeek.put(weekKeys[i], calendarDayDto);
                prevMonthCursor = prevMonthCursor.plusDays(1);
            }
        }

        LocalDate cursor = firstDay;
        while (!cursor.isAfter(lastDay) || currentWeek.size() != 0) {
            DayOfWeek dayOfWeek = cursor.getDayOfWeek();
            String key = weekKeys[dayOfWeek.getValue() - 1];

            currentWeek.put(key, createCalendarItem(cursor, cursor.getMonth() == firstDay.getMonth(), holidayMap.get(cursor), scheduleType));

            // 일요일이거나 월의 마지막 날이면 리스트에 추가
            if (dayOfWeek == DayOfWeek.SUNDAY || cursor.equals(lastDay)) {

                // 마지막 날이 일요일이 아니면 다음 달 날짜로 마저 채우기
                if (cursor.equals(lastDay) && dayOfWeek != DayOfWeek.SUNDAY) {
                    LocalDate nextMonthCursor = lastDay.plusDays(1);
                    for (int i = dayOfWeek.getValue(); i < 7; i++) {
                        currentWeek.put(weekKeys[i], createCalendarItem(nextMonthCursor, false, holidayMap.get(nextMonthCursor), scheduleType));
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
}
