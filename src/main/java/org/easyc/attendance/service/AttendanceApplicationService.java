package org.easyc.attendance.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.*;
import org.easyc.attendance.entity.Attendance;
import org.easyc.attendance.entity.AttendanceApplication;
import org.easyc.attendance.entity.AttendancePolicy;
import org.easyc.attendance.repository.AttendanceApplicationRepository;
import org.easyc.attendance.repository.AttendanceApplicationRepositoryCustom;
import org.easyc.attendance.repository.AttendanceRepository;
import org.easyc.common.constant.BasicStatus;
import org.easyc.common.dto.PageResponseDto;
import org.easyc.common.dto.SearchRequestDto;

import org.easyc.deptMemberMap.entity.DeptMemberMap;
import org.easyc.deptMemberMap.repository.DeptMemberMapRepository;
import org.easyc.member.repository.MemberRepository;
import org.easyc.vacation.entity.VacationApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AttendanceApplicationService {
    private final AttendanceApplicationRepository attendanceApplicationRepository;
    private final AttendanceRepository attendanceRepository;
    private final AttendanceService attendanceService;
    private final DeptMemberMapRepository deptMemberMapRepository;

    private final AttendanceApplicationRepositoryCustom attendanceApplicationRepositoryCustom;

    public List<AttendanceApplication> getAllAttendanceApplication (){
        return attendanceApplicationRepository.findAll();
    }

    public List<AttendanceApplication> getUserAttendanceApplication(AttendanceRequestDto request){
        LocalDate workDate = request.getWorkDate().toLocalDate();
        return attendanceApplicationRepository.findAllByWorkDateAndMemberId(workDate, request.getMemberId());
    }

    public void saveAttendanceApplication (AttendanceApplicationDto req){
        AttendanceApplication attendanceApplication = req.returnAttendanceApplicationEntity();
        Attendance targetAttendance = attendanceRepository.findByMemberIdAndWorkDateAndDeletedFalse(req.getMemberId(), req.getWorkDate()).orElse(null);

        DeptMemberMap deptMemberMap = deptMemberMapRepository.findOneByMemberIdWithFetchJoinPrimaryTrue(req.getMemberId());
        attendanceApplication.setMemberNm(deptMemberMap.getMember().getMemberNm());
        attendanceApplication.setDeptNm(deptMemberMap.getDept().getDeptNm());
        attendanceApplication.setJobGrade(deptMemberMap.getJobTitle().getJobTitleNm());

        //summary 자동 계산
        String summary = makeSummary(targetAttendance, attendanceApplication);
        attendanceApplication.setSummary(summary);

        attendanceApplicationRepository.save(attendanceApplication);
    }

    public PageResponseDto<AttendanceApplication> searchAttendanceApplication(AttendanceAppSearchRequestDto request, Pageable pageable){
        return new PageResponseDto<AttendanceApplication>(attendanceApplicationRepositoryCustom.searchApp(request, pageable));
    }

    public List<AttendanceApplication> excelAttendanceApplication(AttendanceAppSearchRequestDto request, Pageable pageable){
        Page<AttendanceApplication> searchList = attendanceApplicationRepositoryCustom.searchApp(request, pageable);
        return searchList.getContent();
    }

    public void approveAttendanceApplicationData(List<AttendanceApplication> request){
        List<Attendance> attendanceList = new ArrayList<>();
        List<AttendanceApplication> applicationList = new ArrayList<>();

        for(AttendanceApplication attendanceApplication : request){
            if(attendanceApplication.getStatus().equals(BasicStatus.PENDING)){
                attendanceList.add(approveAttendanceData(attendanceApplication));

                attendanceApplication.setStatus(BasicStatus.APPROVED);
                applicationList.add(attendanceApplication);
            }
        }

        attendanceRepository.saveAll(attendanceList);
        attendanceApplicationRepository.saveAll(applicationList);
    }

    public void rejectAttendanceApplicationData(List<AttendanceApplication> request){
        List<AttendanceApplication> applicationList = new ArrayList<>();

        for(AttendanceApplication attendanceApplication : request){
            if(attendanceApplication.getStatus().equals(BasicStatus.PENDING)) {
                attendanceApplication.setStatus(BasicStatus.REJECTED);
                applicationList.add(attendanceApplication);
            }
        }

        attendanceApplicationRepository.saveAll(applicationList);
    }

    public Attendance approveAttendanceData(AttendanceApplication request){
        // 대상 근태 가져오기
        AttendancePolicy targetPolicy = attendanceService.findAttendancePolicy(request.getMemberId());
        Attendance targetAttendance = attendanceRepository
                .findByMemberIdAndWorkDateAndDeletedFalse(request.getMemberId(), request.getWorkDate())
                .orElseGet(() -> attendanceService.makeNewAttendance(
                        request.getMemberId(),
                        request.getWorkDate(),
                        null
                ));

        // 근태 로직 계산 - 출퇴근시간
        Attendance convertAttendance = targetAttendance;

        // 근태 로직 계산 - 출근시간
        if (request.getStartTime() != null) {
            convertAttendance = attendanceService.updateAttendanceByStartTime(
                    convertAttendance,
                    targetPolicy,
                    LocalDateTime.of(request.getWorkDate(), request.getStartTime())
            );
        }

        // 근태 로직 계산 - 퇴근시간
        LocalDateTime endTime = null;

        if (request.getEndTime() != null) {
            endTime = LocalDateTime.of(request.getWorkDate(), request.getEndTime());
        } else if (targetAttendance.getEndTime() != null) {
            endTime = targetAttendance.getEndTime();
        }

        if (endTime != null) {
            convertAttendance = attendanceService.updateAttendanceByEndTime(
                    convertAttendance,
                    targetPolicy,
                    endTime
            );
        }

        // 근태 로직 계산 - 근태상태
        switch(request.getWorkStatus()){
            case ABSENT :
                convertAttendance.setNormalized(false);
                convertAttendance.setWorkStatus(request.getWorkStatus());
                break;
            case OUTSIDE:
            case BUSINESS_TRIP:
                convertAttendance.setWorkStatus(request.getWorkStatus());
                convertAttendance.setRemoted(true);
                break;
        }

        return convertAttendance;
    }


    private String makeSummary(Attendance origin, AttendanceApplication update) {
        List<String> changes = new ArrayList<>();

        if(origin == null){
            changes.add("근태기록 생성");
        }else{
            LocalTime originStartTime = origin.getStartTime().toLocalTime();
            LocalTime originEndTime = origin.getEndTime().toLocalTime();
            LocalTime updateStartTime = update.getStartTime();
            LocalTime updateEndTime = update.getEndTime();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

            if (updateStartTime != null && !Objects.equals(originStartTime, updateStartTime)) {
                changes.add("출근시간: " + originStartTime.format(formatter) + " → " + updateStartTime.format(formatter));
            }

            if (updateEndTime != null && !Objects.equals(originEndTime, updateEndTime)) {
                changes.add("퇴근시간: " + originEndTime.format(formatter) + " → " + updateEndTime.format(formatter));
            }

            if (!Objects.equals(origin.getWorkStatus(), update.getWorkStatus())) {
                changes.add("근무상태: " + origin.getWorkStatus().formatViewText() + " → " + update.getWorkStatus().formatViewText());
            }
        }

        return String.join(", ", changes);
    }

}
