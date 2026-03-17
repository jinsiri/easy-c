package org.easyc.vacation.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.service.AttendanceService;
import org.easyc.common.constant.BasicStatus;
import org.easyc.common.dto.SearchRequestDto;
import org.easyc.deptMemberMap.entity.DeptMemberMap;
import org.easyc.deptMemberMap.repository.DeptMemberMapRepository;
import org.easyc.member.repository.MemberRepository;
import org.easyc.vacation.constant.VacationCategory;
import org.easyc.vacation.dto.VacationApplicationDto;
import org.easyc.vacation.dto.VacationApplicationResponseDto;
import org.easyc.vacation.entity.Vacation;
import org.easyc.vacation.entity.VacationApplication;
import org.easyc.vacation.entity.VacationHistory;
import org.easyc.vacation.repository.VacationHistoryRepository;
import org.easyc.vacation.repository.VacationRepository;
import org.easyc.vacation.repository.VacationApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VacationApplicationService {

    private final VacationApplicationRepository vacationApplicationRepository;
    private final VacationRepository vacationRepository;
    private final MemberRepository memberRepository;
    private final VacationHistoryRepository vacationHistoryRepository;
    private final AttendanceService attendanceService;
    private final DeptMemberMapRepository deptMemberMapRepository;

    public void saveVacationApplication(VacationApplicationDto request) {
        DeptMemberMap deptMemberMap = deptMemberMapRepository.findOneByMemberIdWithFetchJoinPrimaryTrue(request.getMemberId());

        VacationApplication application = request.returnEntity();
        application.setMemberNm(deptMemberMap.getMember().getMemberNm());
        application.setDeptNm(deptMemberMap.getDept().getDeptNm());
        application.setJobGrade(deptMemberMap.getJobTitle().getJobTitleNm());

        vacationApplicationRepository.save(application);
    }

    public List<VacationApplication> searchVacationApplicationData(SearchRequestDto request) {
        String searchCategory = request.getSearchCategory();
        String searchValue = request.getSearchValue();

        List<VacationApplication> vacationList = new ArrayList<>();

        if(searchValue== null || searchValue.equals("")  || searchValue.equals("all")){
            vacationList = vacationApplicationRepository.findAllByDeletedFalseOrderByRegisterDateAsc();
        }else{
            switch (searchCategory){
                case "memberNm":
                    vacationList = vacationApplicationRepository.findAllByMemberNmContainsAndActiveTrueOrderByVacationApplicationIdAsc(searchValue);
                    break;

                case "depthNm":
                    vacationList = vacationApplicationRepository.findAllByDeptNmContainsAndActiveTrueOrderByVacationApplicationIdAsc(searchValue);
                    break;

                case "workDate":
                    LocalDate workDate = LocalDate.parse(searchValue, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                    vacationList = vacationApplicationRepository.findAllByStartDateLessThanEqualAndEndDateGreaterThanEqualAndActiveTrueOrderByVacationApplicationIdAsc(workDate, workDate);
                    break;

                default: //처리상태

                    vacationList = vacationApplicationRepository.findAllByStatusAndActiveTrueOrderByVacationApplicationIdAsc(BasicStatus.valueOf(searchValue));
                    break;
            }
        }

        return vacationList;
    }

    public VacationApplicationResponseDto findUserVacationApplicationData(Long memberId){
        VacationApplicationResponseDto result = new VacationApplicationResponseDto();

        LocalDate todayDate = LocalDate.now();
        Vacation targetVacation = vacationRepository.findAllByMemberIdAndExpireDateAfter(memberId, todayDate).orElse(null);
        if(targetVacation != null){
            LocalDate accrualDate = targetVacation.getAccrualDate();
            LocalDate expireDate = targetVacation.getExpireDate();

            List<VacationApplication> vacationApplications = vacationApplicationRepository.findAllByMemberIdAndStartDateBetween(memberId, accrualDate, expireDate);
            List<VacationApplication> planVacation = new ArrayList<>();
            List<VacationApplication> endVacation = new ArrayList<>();

            for(VacationApplication vacationApplication : vacationApplications){
                if(vacationApplication.getStartDate().isBefore(todayDate)){
                    endVacation.add(vacationApplication);
                }else{
                    planVacation.add(vacationApplication);
                }
            }

            result.setPlanVacation(planVacation);
            result.setEndVacation(endVacation);
        }

        return result;
    }

    public void approveVacationApplicationData( List<VacationApplication> request) {
        List<VacationApplication> vacationApplicationList = new ArrayList<>();
        List<Vacation> vacationList = new ArrayList<>();
        List<VacationHistory> vacationHistoryList = new ArrayList<>();

        for(VacationApplication vacationApplication : request){
            if(vacationApplication.getStatus().equals(BasicStatus.PENDING)){
                Map<String, Object> vacationData = approveVacationData(vacationApplication);

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

    public Map<String, Object> approveVacationData(VacationApplication request) {
        Vacation targetVacation = vacationRepository.findAllByMemberIdAndExpireDateAfter(request.getMemberId(), LocalDate.now()).orElse(null);
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
                    .vacationDesc(request.getViolationReason())
                    .build();

            targetVacation.setUsedDay(targetVacation.getUsedDay() + request.getVacationDuration());
            targetVacation.setRemainDay(targetVacation.getRemainDay() - request.getVacationDuration());

            /* 근태 휴가 입력 */
            attendanceService.saveVacationAttendance(request);
        }
        return Map.of("vacationHistory", newHistory, "vacation", targetVacation);

    }



}
