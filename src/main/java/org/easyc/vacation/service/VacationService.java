package org.easyc.vacation.service;

import lombok.RequiredArgsConstructor;
import org.easyc.common.dto.SearchRequestDto;
import org.easyc.member.entity.MemberProfile;
import org.easyc.member.repository.MemberProfileRepository;
import org.easyc.vacation.constant.TransactionType;
import org.easyc.vacation.constant.VacationCategory;
import org.easyc.vacation.constant.VacationPolicyType;
import org.easyc.vacation.dto.VacationResponseDto;
import org.easyc.vacation.entity.Vacation;
import org.easyc.vacation.entity.VacationHistory;
import org.easyc.vacation.entity.VacationPolicy;
import org.easyc.vacation.entity.VacationPolicyMap;
import org.easyc.vacation.repository.VacationHistoryRepository;
import org.easyc.vacation.repository.VacationPolicyMapRepository;
import org.easyc.vacation.repository.VacationPolicyRepository;
import org.easyc.vacation.repository.VacationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VacationService {

    private final VacationPolicyRepository vacationPolicyRepository;
    private final VacationPolicyMapRepository vacationPolicyMapRepository;
    private final MemberProfileRepository memberProfileRepository;
    private final VacationRepository vacationRepository;
    private final VacationHistoryRepository vacationHistoryRepository;


    public VacationResponseDto getVacation(Long memberId){
        VacationResponseDto result = new VacationResponseDto();
        Vacation target = vacationRepository.findAllByMemberId(memberId).orElse(null);
        List<VacationHistory> targetHistory = new ArrayList<>();

        VacationPolicy targetPolicy = null;
        if(target == null){
            MemberProfile targetMemberProfile = memberProfileRepository.findByMemberId(memberId);
            vacationPolicyMapRepository.saveAndFlush(VacationPolicyMap.builder().vacationPolicyId(Long.valueOf(1)).memberId(memberId).build());
            targetPolicy = vacationPolicyRepository.findAllByVacationPolicyId(Long.valueOf(1));

            VacationHistory targetHistoryItem = makeVacationHistory(targetMemberProfile, targetPolicy);
            targetHistory = List.of(targetHistoryItem);
            target = makeVacation(targetMemberProfile, targetPolicy, targetHistory);
        }else {
            targetHistory = vacationHistoryRepository.findAllByMemberIdAndTransactionTypeEqualsAndDeletedFalse(memberId, TransactionType.GRANT);
        }

        result.setVacation(target);
        result.setHistory(targetHistory);

        return result;
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

    public Vacation makeVacation (MemberProfile targetMemberProfile, VacationPolicy targetVacationPolicy, List<VacationHistory> vh){
        LocalDate resignationDate = targetMemberProfile.getResignationDate();
        LocalDate today = LocalDate.now();
        Long minusYear = ChronoUnit.YEARS.between(resignationDate, today);
        Map<String, LocalDate> calculateDate = calculateDate(resignationDate, targetVacationPolicy);

        Double annualVacation = 0.0;
        Double sickVacation = 0.0;
        Double holidayVacation = 0.0;
        Double specialVacation = 0.0;
        Double carryOverVacation = 0.0;

        Double grantedDay = 0.0;
        Double usedDay = 0.0;

        for(VacationHistory vhItem : vh){
            switch (vhItem.getVacationCategory()){
                case CARRYOVER:
                    carryOverVacation += vhItem.getDay();
                    break;
                case SICK:
                    sickVacation += vhItem.getDay();
                    break;
                case HOLIDAY:
                    holidayVacation += vhItem.getDay();
                    break;
                case SPECIAL:
                    specialVacation += vhItem.getDay();
                    break;
                default: annualVacation += vhItem.getDay();
            }

            switch (vhItem.getTransactionType()){
                case GRANT:
                    grantedDay += vhItem.getDay();
                    break;
                case USE:
                    usedDay += vhItem.getDay();
                    break;
                case CANCEL:
                    usedDay -= vhItem.getDay();
                    break;
                default: grantedDay += vhItem.getDay();
            }

        }

        Vacation newVacation = new Vacation();
        newVacation.setMemberId(targetMemberProfile.getMemberId());
        newVacation.setMemberNm(targetMemberProfile.getMember().getMemberNm());

        newVacation.setVacationPolicyName(targetVacationPolicy.getVacationPolicyName());
        newVacation.setVacationPolicyType(targetVacationPolicy.getVacationPolicyType());
        newVacation.setYearsOfService(minusYear);
        newVacation.setAccrualDate(calculateDate.get("accrualDate"));
        newVacation.setExpireDate(calculateDate.get("expireDate"));
        newVacation.setGrantedDay(grantedDay);
        newVacation.setUsedDay(usedDay);
        newVacation.setRemainDay(grantedDay - usedDay);
        newVacation.setAnnualVacation(annualVacation);
        newVacation.setSickVacation(sickVacation);
        newVacation.setHolidayVacation(holidayVacation);
        newVacation.setSpecialVacation(specialVacation);
        newVacation.setCarryOverVacation(carryOverVacation);

        return vacationRepository.save(newVacation);
    }

    private VacationHistory makeVacationHistory (MemberProfile targetMemberProfile, VacationPolicy targetVacationPolicy){
        LocalDate resignationDate = targetMemberProfile.getResignationDate();
        Map<String, LocalDate> calculateDate = calculateDate(resignationDate, targetVacationPolicy);

        LocalDate today = LocalDate.now();
        Long minusYear = ChronoUnit.YEARS.between(resignationDate, today);
        Double grantedDay = vacationDay(minusYear, resignationDate);

        VacationHistory vh = new VacationHistory();
        vh.setMemberId(targetMemberProfile.getMemberId());
        vh.setVacationCategory(VacationCategory.ANNUAL);
        vh.setTransactionType(TransactionType.GRANT);
        vh.setDay(grantedDay);
        vh.setAccrualDate(calculateDate.get("accrualDate"));
        vh.setExpireDate(calculateDate.get("expireDate"));
        vh.setVacationDesc("기본 연차");

        return vacationHistoryRepository.save(vh);
    }

    private Map<String, LocalDate> calculateDate ( LocalDate resignationDate, VacationPolicy targetVacationPolicy){
        Map<String, LocalDate> resultMap = new HashMap<String, LocalDate>();

        LocalDate accrualDate = null;
        LocalDate expireDate = null;
        if(targetVacationPolicy.getVacationPolicyType().equals(VacationPolicyType.valueOf("WORKING_DAY"))){
            accrualDate = LocalDate.of(LocalDate.now().getYear(), resignationDate.getMonthValue(), resignationDate.getDayOfMonth());
            expireDate = accrualDate.plusYears(1).minusDays(1);
        }else{
            accrualDate = LocalDate.of(LocalDate.now().getYear(), 1, 1);
            expireDate = accrualDate.plusYears(1).minusDays(1);
        }

        resultMap.put("accrualDate", accrualDate);
        resultMap.put("expireDate", expireDate);
        return resultMap;
    }

    private Double vacationDay (Long minusYear, LocalDate resignationDate) {
        LocalDate today = LocalDate.now();

        if(minusYear == 0){
            Long minusMonths = ChronoUnit.MONTHS.between(resignationDate, today);
            return Double.valueOf(String.valueOf(minusMonths));

        }else{
            if(minusYear <= 2){
                return 15.0;
            }else if(minusYear <= 4){
                return 16.0;
            }else if(minusYear <= 6){
                return 17.0;
            }else if(minusYear <= 8){
                return 18.0;
            }else if(minusYear <= 10){
                return 19.0;
            }else if(minusYear <= 12){
                return 20.0;
            }else if(minusYear <= 14){
                return 21.0;
            }else if(minusYear <= 16){
                return 22.0;
            }else if(minusYear <= 18){
                return 23.0;
            }else if(minusYear <= 20){
                return 24.0;
            }else{
                return 25.0;
            }
        }
    }


}
