package org.easyc.vacation.service;

import lombok.RequiredArgsConstructor;
import org.easyc.common.constant.BasicStatus;
import org.easyc.common.dto.PageResponseDto;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.easyc.member.entity.MemberProfile;
import org.easyc.member.repository.MemberProfileRepository;
import org.easyc.schedule.dto.CalendarEventDto;
import org.easyc.schedule.entity.Schedule;
import org.easyc.vacation.constant.TransactionType;
import org.easyc.vacation.constant.VacationCategory;
import org.easyc.vacation.constant.VacationPolicyType;
import org.easyc.vacation.dto.VacationCompanySearchRequestDto;
import org.easyc.vacation.dto.VacationHistorySearchRequestDto;
import org.easyc.vacation.dto.VacationResponseDto;
import org.easyc.vacation.entity.*;
import org.easyc.vacation.repository.*;
import org.springframework.cglib.core.Local;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VacationService {

    private final VacationPolicyRepository vacationPolicyRepository;
    private final VacationPolicyMapRepository vacationPolicyMapRepository;
    private final MemberProfileRepository memberProfileRepository;
    private final VacationRepository vacationRepository;
    private final VacationHistoryRepository vacationHistoryRepository;
    private final VacationRepositoryCustom vacationRepositoryCustom;
    private final VacationHistoryRepositoryCustom vacationHistoryRepositoryCustom;
    private final VacationApplicationRepository vacationApplicationRepository;

    public VacationResponseDto getVacation(Long memberId){
        LocalDate today = LocalDate.now();

        //1. 통계 테이블에서 올해 해당 데이터 있는 지 조회
        Vacation vacation = vacationRepository.findAllByYearAndMemberId(today.getYear(), memberId).orElse(null);
        VacationPolicy vacationPolicy = vacationPolicyMapRepository.findPolicyByMemberIdAndActivedTrue(memberId).orElse(null);
        MemberProfile memberProfile = memberProfileRepository.findById(memberId).orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND));

        //2. 정책 데이터 없는 경우 - 신규 데이터 로직 생성
        if(vacationPolicy == null){
            vacationPolicy = vacationPolicyRepository.findByVacationPolicyIdAndActiveTrue(Long.valueOf(1)).orElse(null);

            VacationPolicyMap vacationPolicyMap = new VacationPolicyMap();
            vacationPolicyMap.setMemberId(memberId);
            vacationPolicyMap.setVacationPolicyId(Long.valueOf(1));
            vacationPolicyMap.setApplyStart(LocalDate.of(today.getYear(), 1, 1));
            vacationPolicyMapRepository.save(vacationPolicyMap);
        }

        List<VacationHistory> vacationHistoryList = new ArrayList<>();

        //3. 해당 연차 데이터 없는 경우 - 신규 데이터 로직 생성
        if(vacation == null){
            vacationHistoryList = makeVacationHistory(memberProfile, vacationPolicy.getVacationPolicyType());
            vacation = makeVacation(memberProfile, vacationPolicy, vacationHistoryList, null);

            vacationHistoryRepository.saveAll(vacationHistoryList);
            vacationRepository.save(vacation);
        }

        //4. 데이터 있는데 추가 필요한 경우 - 1년 미만에 입사일 기준이거나 회계일기준인데 해가 바뀌지 않아서 달마다 연차 하나씩 부여
        else{
            vacationHistoryList = vacationHistoryRepository.findTop10ByMemberIdAndAccrualDateBetweenAndActiveTrueOrderByRegisterDateDesc(memberId, LocalDate.of(today.getYear(), 1, 1), LocalDate.of(today.getYear(), 12, 31));

            LocalDate hireDate = memberProfile.getHireDate();
            long workingYears = ChronoUnit.YEARS.between(hireDate, today);

            if(workingYears == 0){
                if (!(vacationPolicy.equals(VacationPolicyType.FINANCIAL_DAY) && today.getYear() != hireDate.getYear())){
                    Long durationMonth = ChronoUnit.MONTHS.between(hireDate, today);
                    LocalDate expectedAccrualDate = hireDate.plusMonths(durationMonth);

                    boolean exists = vacationHistoryList.stream()
                            .anyMatch(history ->
                                    history.getAccrualDate().equals(hireDate.plusMonths(durationMonth))
                            );

                    if(today.isAfter(expectedAccrualDate) && !exists){
                        VacationHistory newHistory = createHistory(
                                memberProfile,
                                1.0,
                                hireDate.plusMonths(durationMonth),
                                hireDate.plusYears(1).minusDays(1),
                                "1년 미만 월차"
                        );
                        VacationHistory saved = vacationHistoryRepository.save(newHistory);

                        vacationHistoryList.add(saved);

                        Vacation newVacation = makeVacation(memberProfile, vacationPolicy, vacationHistoryList, vacation);
                        vacation = vacationRepository.save(newVacation);
                    }
                }
            }
        }

        VacationResponseDto result = new VacationResponseDto();
        result.setVacation(vacation);
        result.setHistory(
                vacationHistoryList.stream()
                        .limit(10)
                        .collect(Collectors.toList())
        );

        return result;
    }

    public PageResponseDto<Vacation> getVacationCompanySearch(VacationCompanySearchRequestDto request, Pageable pageable){
        return new PageResponseDto<Vacation>(vacationRepositoryCustom.search(request, pageable));
    }

    public List<Vacation> excelVacationCompany(VacationCompanySearchRequestDto request, Pageable pageable) {
        Page<Vacation> searchList = vacationRepositoryCustom.search(request, pageable);
        return searchList.getContent();
    }

    public PageResponseDto<VacationHistory> searchVacationHistoryData(VacationHistorySearchRequestDto request, Pageable pageable) {
        return new PageResponseDto<VacationHistory>(vacationHistoryRepositoryCustom.search(request, pageable));
    }


    public Vacation makeVacation (MemberProfile targetMemberProfile, VacationPolicy targetVacationPolicy, List<VacationHistory> vh, Vacation targetVacation ){
        LocalDate hireDate = targetMemberProfile.getHireDate();
        LocalDate today = LocalDate.now();
        Long minusYear = ChronoUnit.YEARS.between(hireDate, today);
        Map<String, LocalDate> calculateDate = calculateDate(hireDate, targetVacationPolicy);

        Double annualVacation = 0.0;
        Double sickVacation = 0.0;
        Double holidayVacation = 0.0;
        Double specialVacation = 0.0;
        Double carryOverVacation = 0.0;

        Double grantedDay = 0.0;
        Double usedDay = 0.0;

        for(VacationHistory vhItem : vh){
            double amount = Math.abs(vhItem.getDay());

            switch (vhItem.getTransactionType()){
                case GRANT:
                    grantedDay += amount;
                    updateCategoryAmount(vhItem, amount, carryOverVacation, sickVacation, holidayVacation, specialVacation, annualVacation);
                    break;

                case EXPIRE: // 정책 변경 등으로 인한 만료(회수)
                    grantedDay -= amount;
                    updateCategoryAmount(vhItem, -amount, carryOverVacation, sickVacation, holidayVacation, specialVacation, annualVacation);
                    break;

                case USE:
                    usedDay += amount;
                    break;

                case CANCEL:
                    usedDay -= amount;
                    break;

                default:
                    break;
            }

        }

        Vacation newVacation = targetVacation != null
                ? targetVacation
                : Vacation.builder()
                        .memberId(targetMemberProfile.getMemberId())
                        .memberNm(targetMemberProfile.getMember().getMemberNm())
                        .vacationPolicyName(targetVacationPolicy.getVacationPolicyName())
                        .vacationPolicyType(targetVacationPolicy.getVacationPolicyType())
                        .year(today.getYear())
                        .yearsOfService(minusYear)
                        .accrualDate(calculateDate.get("accrualDate"))
                        .expireDate(calculateDate.get("expireDate"))
                        .grantedDay(grantedDay)
                        .usedDay(usedDay)
                        .remainDay(grantedDay - usedDay)
                        .annualVacation(annualVacation)
                        .sickVacation(sickVacation)
                        .holidayVacation(holidayVacation)
                        .specialVacation(specialVacation)
                        .carryOverVacation(carryOverVacation)
                        .build();

        return newVacation;
    }

    public List<VacationHistory> makeVacationHistory (MemberProfile targetMemberProfile, VacationPolicyType vacationPolicyType){
        LocalDate hireDate = targetMemberProfile.getHireDate();
        LocalDate today = LocalDate.now();
        LocalDate firstYear = LocalDate.of(today.getYear(), 1, 1);
        LocalDate lastYear = LocalDate.of(today.getYear(), 12, 31);
        VacationPolicyType policyType = vacationPolicyType != null ? vacationPolicyType : VacationPolicyType.FINANCIAL_DAY;

        // 재직 연수 계산 (0이면 1년 미만 신입)
        long workingYears = ChronoUnit.YEARS.between(hireDate, today);
        List<VacationHistory> saveVacationList = new ArrayList<>();

        //1. 1년 미만인 경우
        if (workingYears == 0) {
            //회계일기준인데 해가 다른 경우 비율 계산
            if (policyType.equals(VacationPolicyType.FINANCIAL_DAY) && today.getYear() != hireDate.getYear()){
                LocalDate anniversaryDate = hireDate.plusYears(1);

                //1월부터 입사일까지의 월차
                long monthlyCount = ChronoUnit.MONTHS.between(firstYear, anniversaryDate);
                if (monthlyCount > 0) {
                    saveVacationList.add(
                            createHistory(
                                    targetMemberProfile,
                                    (double) monthlyCount,
                                    firstYear,
                                    anniversaryDate.minusDays(1),
                                    "1년 미만 월차 선부여 (" + monthlyCount + "개월차)"
                            )
                    );
                }

                // 입사일 이후부터 마지막 날까지의 연차 - 15일 * (남은 일수 / 365)
                long remainingDays = ChronoUnit.DAYS.between(anniversaryDate, lastYear) + 1;
                double proRataDays = Math.round(15.0 * (remainingDays / 365.0) * 100.0) / 100.0;
                saveVacationList.add(
                        createHistory(
                                targetMemberProfile,
                                proRataDays,
                                firstYear,
                                lastYear,
                                "입사 1주년 이후 비례 연차 선부여"
                        )
                );

            }
            //해가 바뀌지 않았거나 입사일 기준인 경우
            else{
                long monthsPassed = ChronoUnit.MONTHS.between(hireDate, today);
                for (int i = 1; i <= monthsPassed; i++) {
                    saveVacationList.add(createHistory(targetMemberProfile, 1.0, hireDate.plusMonths(i), hireDate.plusYears(1), "1년 미만 월차"));
                }
            }
        }
        //2. 1년 이상인 경우
        else{
            double vacationDay = vacationDay(workingYears);
            LocalDate accrualDate = policyType.equals(VacationPolicyType.FINANCIAL_DAY) ? firstYear : LocalDate.of(today.getYear(), hireDate.getMonthValue(), hireDate.getDayOfMonth());
            LocalDate expireDate = accrualDate.plusYears(1).minusDays(1);

            saveVacationList.add(createHistory(targetMemberProfile, vacationDay, accrualDate, expireDate, "정기 연차"));
        }

        return saveVacationList;
    }

    public Map<LocalDate, List<CalendarEventDto>> createVacationAppToCalendarMap(List<Long> memberIds, LocalDate firstDay, LocalDate lastDay){
        List<VacationApplication> vacationApplicationList = vacationApplicationRepository.findAllByMemberIdInAndStartDateBetweenAndStatusAndDeletedFalse(memberIds, firstDay, lastDay, BasicStatus.APPROVED);

        Map<LocalDate, List<CalendarEventDto>> vacationMap = new HashMap<>();
        for (VacationApplication vacationApp : vacationApplicationList) {
            LocalDate endDate = vacationApp.getEndDate();
            LocalDate startDate = vacationApp.getStartDate();
            long diff = endDate != null ? ChronoUnit.DAYS.between(startDate, endDate): 0;

            for(int i = 0; i <= diff; i++) {
                LocalDate targetDate = startDate.plusDays(i);
                List<CalendarEventDto> list = vacationMap.getOrDefault(targetDate, new ArrayList<>());
                CalendarEventDto dto = CalendarEventDto.fromVacation(vacationApp);
                list.add(dto);

                vacationMap.put(targetDate, list);
            }
        }

        return vacationMap;

    }

    private VacationHistory createHistory(MemberProfile profile, Double days, LocalDate accrualDate, LocalDate expireDate, String desc) {
        return VacationHistory.builder()
                .memberId(profile.getMemberId())
                .vacationCategory(VacationCategory.ANNUAL)
                .transactionType(TransactionType.GRANT)
                .day(days)
                .accrualDate(accrualDate)
                .expireDate(expireDate)
                .violationReason(desc)
                .build();
    }

    private Double vacationDay (Long minusYear) {
        if(0 < minusYear && minusYear <= 2){
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

    private Map<String, LocalDate> calculateDate ( LocalDate hireDate, VacationPolicy targetVacationPolicy){
        Map<String, LocalDate> resultMap = new HashMap<String, LocalDate>();
        LocalDate today = LocalDate.now();
        Long minusYear = ChronoUnit.YEARS.between(hireDate, today);

        LocalDate accrualDate = null;
        LocalDate expireDate = null;

        if(targetVacationPolicy.getVacationPolicyType().equals(VacationPolicyType.valueOf("WORKING_DAY"))){
            accrualDate = LocalDate.of(LocalDate.now().getYear(), hireDate.getMonthValue(), hireDate.getDayOfMonth());
            expireDate = accrualDate.plusYears(1).minusDays(1);
        }else{

            if(minusYear == 0 && today.getYear() == hireDate.getYear()){
                accrualDate = hireDate;
                expireDate = accrualDate.plusYears(1).minusDays(1);
            }else{
                accrualDate = LocalDate.of(LocalDate.now().getYear(), 1, 1);
                expireDate = accrualDate.plusYears(1).minusDays(1);
            }

        }

        resultMap.put("accrualDate", accrualDate);
        resultMap.put("expireDate", expireDate);
        return resultMap;
    }

    private void updateCategoryAmount(
            VacationHistory vhItem,
            double amount,
            double carryOverVacation,
            double sickVacation,
            double holidayVacation,
            double specialVacation,
            double annualVacation
    ) {
        switch (vhItem.getVacationCategory()){
            case CARRYOVER: carryOverVacation += amount; break;
            case SICK:      sickVacation += amount;      break;
            case HOLIDAY:   holidayVacation += amount;   break;
            case SPECIAL:   specialVacation += amount;   break;
            default:        annualVacation += amount;    break;
        }
    }



}
