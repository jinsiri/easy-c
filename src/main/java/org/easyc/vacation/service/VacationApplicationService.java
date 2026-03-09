package org.easyc.vacation.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.service.AttendanceService;
import org.easyc.common.constant.BasicStatus;
import org.easyc.common.dto.SearchRequestDto;
import org.easyc.member.entity.Member;
import org.easyc.member.repository.MemberRepository;
import org.easyc.vacation.constant.VacationCategory;
import org.easyc.vacation.constant.VacationType;
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
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VacationApplicationService {

    private final VacationApplicationRepository vacationApplicationRepository;
    private final VacationRepository vacationRepository;
    private final MemberRepository memberRepository;
    private final VacationHistoryRepository vacationHistoryRepository;
    private final AttendanceService attendanceService;

    public void saveVacationApplication(VacationApplicationDto request) {
        Member member = memberRepository.findByMemberId(request.getMemberId()).orElse(null);
        VacationApplication application = request.returnEntity();
        application.setMemberNm(member.getMemberNm());
        application.setDeptNm("인사팀");
        application.setJobGrade("과장");

        vacationApplicationRepository.save(application);
    }

    public List<VacationApplication> searchVacationApplicationData(SearchRequestDto request) {
        return vacationApplicationRepository.findAllByDeletedFalseOrderByRegisterDateAsc();
    }

    public VacationApplicationResponseDto findUserVacationApplicationData(Long memberId){
        VacationApplicationResponseDto result = new VacationApplicationResponseDto();

        Vacation targetVacation = vacationRepository.findAllByMemberId(memberId).orElse(null);
        if(targetVacation != null){
            LocalDate todayDate = LocalDate.now();
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

    public void approveVacationApplicationData(VacationApplication request) {
        Vacation targetVacation = vacationRepository.findAllByMemberId(request.getMemberId()).orElse(null);

        if(targetVacation != null){
            VacationCategory vacationCategory = null;
            switch (request.getVacationType()){
                case SICK_LEAVE: vacationCategory = VacationCategory.SICK; break;
                case SPECIAL_LEAVE: vacationCategory = VacationCategory.SPECIAL; break;
                case HOLIDAY: vacationCategory = VacationCategory.HOLIDAY; break;
                default: vacationCategory = VacationCategory.ANNUAL;
            }

            request.setStatus(BasicStatus.APPROVED);

            VacationHistory newHistory = VacationHistory.builder()
                    .memberId(request.getMemberId())
                    .vacationCategory(vacationCategory)
                    .day(request.getVacationDuration() * 1.0)
                    .vacationDesc(request.getViolationReason())
                    .build();

            targetVacation.setUsedDay(targetVacation.getUsedDay() + request.getVacationDuration());
            targetVacation.setRemainDay(targetVacation.getRemainDay() - request.getVacationDuration());

            vacationApplicationRepository.save(request);
            vacationHistoryRepository.save(newHistory);
            vacationRepository.save(targetVacation);

            /* 근태 휴가 입력 */
            attendanceService.saveVacationAttendance(request);

        }
    }

    public void rejectVacationApplicationData (VacationApplication request) {
        request.setStatus(BasicStatus.REJECTED);
        vacationApplicationRepository.save(request);
    }



}
