package org.easyc.vacation.service;

import lombok.RequiredArgsConstructor;
import org.easyc.common.constant.BasicStatus;
import org.easyc.vacation.dto.VacationApplicationDto;
import org.easyc.vacation.dto.VacationApplicationResponseDto;
import org.easyc.vacation.entity.Vacation;
import org.easyc.vacation.entity.VacationApplication;
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

    public void saveVacationApplication(VacationApplicationDto request) {
        vacationApplicationRepository.save(request.returnEntity());
    }

    public List<VacationApplication> findVacationApplicationData(){
        return vacationApplicationRepository.findAllByDeletedFalseOrderByRegisterDateAsc();
    }

    public VacationApplicationResponseDto findUserVacationApplicationData(Long memberId){
        VacationApplicationResponseDto result = new VacationApplicationResponseDto();

        Vacation targetVacation = vacationRepository.findAllByMemberId(memberId).orElse(null);
        if(targetVacation != null){
            LocalDate accrualDate = targetVacation.getAccrualDate();
            LocalDate expireDate = targetVacation.getExpireDate();

            List<VacationApplication> vacationApplications = vacationApplicationRepository.findAllByMemberIdAndStartDateBetween(memberId, accrualDate, expireDate);
            List<VacationApplication> planVacation = new ArrayList<>();
            List<VacationApplication> endVacation = new ArrayList<>();

            for(VacationApplication vacationApplication : vacationApplications){
                if(vacationApplication.getStatus().equals(BasicStatus.APPROVED)){
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


}
