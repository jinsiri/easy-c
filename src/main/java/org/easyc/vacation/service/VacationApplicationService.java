package org.easyc.vacation.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.service.AttendanceService;
import org.easyc.common.constant.BasicStatus;
import org.easyc.common.dto.PageResponseDto;
import org.easyc.deptMemberMap.entity.DeptMemberMap;
import org.easyc.deptMemberMap.repository.DeptMemberMapRepository;
import org.easyc.vacation.constant.VacationCategory;
import org.easyc.vacation.dto.VacationAppSearchRequestDto;
import org.easyc.vacation.dto.VacationApplicationDto;
import org.easyc.vacation.entity.Vacation;
import org.easyc.vacation.entity.VacationApplication;
import org.easyc.vacation.entity.VacationHistory;
import org.easyc.vacation.repository.VacationApplicationRepositoryCustom;
import org.easyc.vacation.repository.VacationHistoryRepository;
import org.easyc.vacation.repository.VacationRepository;
import org.easyc.vacation.repository.VacationApplicationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VacationApplicationService {

    private final VacationApplicationRepository vacationApplicationRepository;
    private final VacationRepository vacationRepository;
    private final VacationHistoryRepository vacationHistoryRepository;
    private final AttendanceService attendanceService;
    private final DeptMemberMapRepository deptMemberMapRepository;
    private final VacationApplicationRepositoryCustom vacationApplicationRepositoryCustom;

    public void saveVacationApplication(VacationApplicationDto request) {
        DeptMemberMap deptMemberMap = deptMemberMapRepository.findOneByMemberIdWithFetchJoinPrimaryTrue(request.getMemberId());

        VacationApplication application = request.returnEntity();
        application.setMemberNm(deptMemberMap.getMember().getMemberNm());
        application.setDeptNm(deptMemberMap.getDept().getDeptNm());
        application.setJobGrade(deptMemberMap.getJobTitle().getJobTitleNm());

        vacationApplicationRepository.save(application);
    }

    public List<VacationApplication> findUserVacationApplicationData(Long memberId){
        List<VacationApplication> vacationList = vacationApplicationRepository
                .findTop10ByMemberIdAndDeletedFalseOrderByRegisterDateDesc(memberId);

        return vacationList;
    }

    public void approveVacationApplicationData( List<VacationApplication> request) {
        List<VacationApplication> vacationApplicationList = new ArrayList<>();
        List<Vacation> vacationList = new ArrayList<>();
        List<VacationHistory> vacationHistoryList = new ArrayList<>();

        List<Long> memberIdList = request.stream().map(VacationApplication::getMemberId).collect(Collectors.toList());
        List<Vacation> prevVacation = vacationRepository.findAllByMemberIdIsInAndYear(memberIdList, LocalDate.now().getYear());
        Map<Long, Vacation> prevVacationMap = prevVacation.stream().collect(Collectors.toMap(a -> a.getMemberId(), a -> a));

        for(VacationApplication vacationApplication : request){
            if(vacationApplication.getStatus().equals(BasicStatus.PENDING)){
                Vacation targetVacation = prevVacationMap.get(vacationApplication.getMemberId()) ;
                Map<String, Object> vacationData = approveVacationData(vacationApplication, targetVacation);

                vacationApplication.setStatus(BasicStatus.APPROVED);
                vacationApplicationList.add(vacationApplication);

                if(vacationData.get("vacation") != null) vacationList.add((Vacation) vacationData.get("vacation"));
                if(vacationData.get("history") != null)  vacationHistoryList.add((VacationHistory) vacationData.get("history"));
            }
        }

        vacationApplicationRepository.saveAll(vacationApplicationList);
        vacationHistoryRepository.saveAll(vacationHistoryList);
        vacationRepository.saveAll(vacationList);
    }

    public void rejectVacationApplicationData ( List<VacationApplication> request) {
        List<VacationApplication> vacationApplicationList = new ArrayList<>();

        for(VacationApplication vacationApplication : request){
            if(vacationApplication.getStatus().equals(BasicStatus.PENDING)){
                vacationApplication.setStatus(BasicStatus.REJECTED);
                vacationApplicationList.add(vacationApplication);
            }
        }
        vacationApplicationRepository.saveAll(vacationApplicationList);
    }

    public Map<String, Object> approveVacationData(VacationApplication request, Vacation targetVacation) {
        VacationHistory newHistory = null;

        if(targetVacation != null){
            VacationCategory vacationCategory = null;
            switch (request.getVacationType()){
                case SICK_LEAVE: vacationCategory = VacationCategory.SICK; break;
                case SPECIAL_LEAVE: vacationCategory = VacationCategory.SPECIAL; break;
                case HOLIDAY: vacationCategory = VacationCategory.HOLIDAY; break;
                default: vacationCategory = VacationCategory.ANNUAL;
            }

            newHistory = VacationHistory.builder()
                    .memberId(request.getMemberId())
                    .vacationCategory(vacationCategory)
                    .day(request.getVacationDuration() * 1.0)
                    .violationReason(request.getViolationReason())
                    .build();

            targetVacation.setUsedDay(targetVacation.getUsedDay() + request.getVacationDuration());
            targetVacation.setRemainDay(targetVacation.getRemainDay() - request.getVacationDuration());

            /* 근태 휴가 입력 */
            attendanceService.saveVacationAttendance(request);
        }
        return Map.of("vacationHistory", newHistory, "vacation", targetVacation);
    }

    public PageResponseDto<VacationApplication> searchVacationApplicationData(VacationAppSearchRequestDto request, Pageable pageable) {
        return new PageResponseDto<VacationApplication>(vacationApplicationRepositoryCustom.searchApp(request, pageable));
    }

    public PageResponseDto<VacationApplication> searchUserVacationApplicationData(VacationAppSearchRequestDto request,Pageable pageable) {
        return new PageResponseDto<VacationApplication>(vacationApplicationRepositoryCustom.searchUserApp(request, pageable));
    }

    public List<VacationApplication> excelVacationApplication(VacationAppSearchRequestDto request, Pageable pageable) {
        Page<VacationApplication> searchList = vacationApplicationRepositoryCustom.searchApp(request, pageable);
        return searchList.getContent();
    }

    public void deleteVacationApplicationData(Long vacationApplicationId) {
        VacationApplication target = vacationApplicationRepository.findByVacationApplicationIdAndDeletedFalse(vacationApplicationId).orElse(null);

        if(target != null){
            target.delete();
            vacationApplicationRepository.save(target);
        }
    }
}
