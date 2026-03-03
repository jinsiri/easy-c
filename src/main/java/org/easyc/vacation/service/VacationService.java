package org.easyc.vacation.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.constant.WorkStatus;
import org.easyc.common.dto.SearchRequestDto;
import org.easyc.member.entity.Member;
import org.easyc.member.entity.MemberProfile;
import org.easyc.member.repository.MemberProfileRepository;
import org.easyc.member.repository.MemberRepository;
import org.easyc.vacation.constant.VacationPolicyType;
import org.easyc.vacation.dto.VacationPolicyDto;
import org.easyc.vacation.entity.Vacation;
import org.easyc.vacation.entity.VacationPolicy;
import org.easyc.vacation.entity.VacationPolicyMap;
import org.easyc.vacation.repository.VacationPolicyMapRepository;
import org.easyc.vacation.repository.VacationPolicyRepository;
import org.easyc.vacation.repository.VacationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VacationService {

    private final VacationPolicyRepository vacationPolicyRepository;
    private final VacationPolicyMapRepository vacationPolicyMapRepository;
    private final MemberRepository memberRepository;
    private final MemberProfileRepository memberProfileRepository;
    private final VacationRepository vacationRepository;

    public Vacation createVacation (Long memberId){
        MemberProfile targetMemberProfile = memberProfileRepository.findByMemberId(memberId);
        VacationPolicyMap targetVacationPolicyMap = vacationPolicyMapRepository.findTopByMemberIdAndDeletedFalseOrderByMappingIdDesc(memberId).orElse(null);
        if(targetVacationPolicyMap == null){
            Member targetMember = memberRepository.findById(memberId).orElse(null);
            targetVacationPolicyMap = new VacationPolicyMap().builder()
                    .memberId(memberId)
                    .vacationPolicyId(Long.valueOf("1"))
                    .build();
        }
        VacationPolicy targetVacationPolicy = vacationPolicyRepository.findAllByVacationPolicyId(targetVacationPolicyMap.getVacationPolicyId());

        LocalDate resignationDate = targetMemberProfile.getResignationDate();
        LocalDate accrualDate = null;
        LocalDate expireDate = null;
        if(targetVacationPolicy.getVacationPolicyType().equals(VacationPolicyType.valueOf("WORKING_DAY"))){
            accrualDate = LocalDate.of(LocalDate.now().getYear(), resignationDate.getMonthValue(), resignationDate.getDayOfMonth());
            expireDate = accrualDate.plusYears(1);
        }else{
            accrualDate = LocalDate.of(LocalDate.now().getYear(), 1, 1);
            expireDate = accrualDate.plusYears(1);
        }

        LocalDate today = LocalDate.now();
        Long minusYear = ChronoUnit.YEARS.between(resignationDate, today);
        Integer grantedDay = vacationDay(minusYear, resignationDate);

        Vacation newVacation = new Vacation();
        newVacation.setMemberId(memberId);
        newVacation.setVacationPolicyName(targetVacationPolicy.getVacationPolicyName());
        newVacation.setYearsOfService(minusYear);
        newVacation.setAccrualDate(accrualDate);
        newVacation.setExpireDate(expireDate);
        newVacation.setGrantedDay(grantedDay * 1.0);
        newVacation.setUsedDay(0.0);
        newVacation.setRemainDay(grantedDay * 1.0);
        newVacation.setAnnualVacation(grantedDay);
        newVacation.setCarryOverDay(0);

        return vacationRepository.save(newVacation);
    }

    public Vacation getVacationData(Long memberId){
        Vacation target = vacationRepository.findAllByMemberId(memberId).orElse(null);
        if(target == null){
            target = createVacation(memberId);
        }
        return target;
    }

    public List<Vacation> getVacationCompanySearch(SearchRequestDto request){
        String searchCategory = request.getSearchCategory();
        String searchValue = request.getSearchValue();

        List<Vacation> vacationList = new ArrayList<>();
        if(searchValue== null || searchValue.equals("")){
            vacationList = vacationRepository.findAll();
        }else{
            switch (searchCategory){
                case "memberNm":
                    vacationList = vacationRepository.findAllByMemberNmContains(searchValue);
                    break;

                case "depthNm":
                    vacationList = vacationRepository.findAllByDeptNm(searchValue);
                    break;

                default:
                    break;
            }
        }

        return vacationList;
    }

    private Integer vacationDay (Long minusYear, LocalDate resignationDate) {
        LocalDate today = LocalDate.now();

        if(minusYear == 0){
            Long minusMonths = ChronoUnit.MONTHS.between(resignationDate, today);
            return Integer.valueOf(String.valueOf(minusMonths));

        }else{
            if(minusYear <= 2){
                return 15;
            }else if(minusYear <= 4){
                return 16;
            }else if(minusYear <= 6){
                return 17;
            }else if(minusYear <= 8){
                return 18;
            }else if(minusYear <= 10){
                return 19;
            }else if(minusYear <= 12){
                return 20;
            }else if(minusYear <= 14){
                return 21;
            }else if(minusYear <= 16){
                return 22;
            }else if(minusYear <= 18){
                return 23;
            }else if(minusYear <= 20){
                return 24;
            }else{
                return 25;
            }
        }
    }


}
