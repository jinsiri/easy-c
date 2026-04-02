package org.easyc.vacation.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.easyc.member.entity.MemberProfile;
import org.easyc.member.repository.MemberProfileRepository;
import org.easyc.member.repository.MemberRepositoryCustom;
import org.easyc.vacation.constant.TransactionType;
import org.easyc.vacation.dto.VacationPolicyDto;
import org.easyc.vacation.dto.VacationPolicyMemberDto;
import org.easyc.vacation.dto.VacationPolicyMemberRequestDto;
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
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class VacationPolicyService {

    private final VacationService vacationService;

    private final VacationPolicyRepository vacationPolicyRepository;
    private final VacationPolicyMapRepository vacationPolicyMapRepository;
    private final MemberRepositoryCustom memberRepositoryCustom;
    private final MemberProfileRepository memberProfileRepository;
    private final VacationHistoryRepository vacationHistoryRepository;
    private final VacationRepository vacationRepository;

    public List<VacationPolicyDto> getAllPolicy (){
        List<VacationPolicy> policyList = vacationPolicyRepository.findAllByActiveTrueOrderByVacationPolicyIdAsc();
        List<Object[]> mapCountList = vacationPolicyMapRepository.countGroupByVacationPolicyId();

        Map<Long, Long> policyCount = mapCountList.stream().collect(Collectors.toMap(
                obj -> (Long) obj[0],
                obj -> (Long) obj[1]
        ));

        List<VacationPolicyDto> resultList = policyList.stream().map(entity -> {
            VacationPolicyDto dto = new VacationPolicyDto(entity);
            dto.setMappingUserCount(policyCount.get(dto.getVacationPolicyId()));
            return dto;
        }).collect(Collectors.toList());

        return resultList;
    }

    public void savePolicyData(VacationPolicyDto request){
       VacationPolicy policy = request.makeEntity();
        vacationPolicyRepository.save(policy);
    }

    public void deletePolicyData(Long id){
        // 1. 해당 정책 delete 처리
        VacationPolicy targetData = vacationPolicyRepository.findByVacationPolicyIdAndActiveTrue(id).orElseThrow();
        targetData.delete();

        // 2. 기존에 이 정책이었던 근로자들 기본정책으로 일괄 수정
        VacationPolicy defaultPolicy = vacationPolicyRepository.findByVacationPolicyIdAndActiveTrue(1L).orElseThrow();
        List<VacationPolicyMap> targetPolicyMapList = vacationPolicyMapRepository.findAllByVacationPolicyIdAndActivedTrue(id);
        List<VacationPolicyMap> newPolicyMapList = new ArrayList<>();
        for(VacationPolicyMap map : targetPolicyMapList){
            map.deactivate();
            newPolicyMapList.add(map);
            newPolicyMapList.add(saveNewMapping(map.getMemberId(), 1L));
        }

        // 3. 로직이 변경된 사람들의 vacationHistory 변경 및 vacation 변경
        recalculateMemberVacation(List.of(defaultPolicy),newPolicyMapList);

        vacationPolicyRepository.save(targetData);
        vacationPolicyMapRepository.saveAll(newPolicyMapList);
    }


    public List<VacationPolicyMemberDto> getPolicyMemberData() {
        return memberRepositoryCustom.findVacationPolicyMembers();
    }

    @Transactional
    public void savePolicyMemberMapping(VacationPolicyMemberRequestDto request) {
        Long policyId = request.getPolicyId();
        List<Long> memberIdList = request.getMemberIdList();
        List<VacationPolicyMap> saveList = new ArrayList<>();

        // 1. 기존에 이 정책이었으나 리스트에서 제외된 사람들 처리 - 기본 정책(1L)으로 변경
        List<VacationPolicyMap> currentMemberMapList = vacationPolicyMapRepository.findAllByVacationPolicyIdAndActivedTrue(policyId);
        for(VacationPolicyMap map : currentMemberMapList){
            if(!memberIdList.contains(map.getMemberId())){
                map.deactivate();
                saveList.add(map);
                saveList.add(saveNewMapping(map.getMemberId(),1L ));
            }
        }

        // 2. 새 리스트에 담겨온 사람들 처리
        List<Long> currentMemberList = currentMemberMapList.stream().map(VacationPolicyMap::getMemberId).collect(Collectors.toList());
        List<Long> updateList = memberIdList.stream().filter(id -> !currentMemberList.contains(id)).collect(Collectors.toList());

        List<VacationPolicyMap> updateMemberPrevList = vacationPolicyMapRepository.findAllByMemberIdIsInAndActivedTrue(updateList);
        Map<Long, VacationPolicyMap> updateMemberPrevMap = updateMemberPrevList.stream().collect(Collectors.toMap(VacationPolicyMap::getMemberId, v -> v));

        for(Long updateMemberId : updateList){
            VacationPolicyMap prevMap = updateMemberPrevMap.get(updateMemberId);
            if(prevMap != null){
                prevMap.deactivate();
                saveList.add(prevMap);
            }
            saveList.add(saveNewMapping(updateMemberId, policyId));
        }

        //3. 정책이 변경된 사람들의 vacationHistory 변경 및 vacation 변경
        List<VacationPolicy> policyList = vacationPolicyRepository.findAllByVacationPolicyIdInAndActiveTrue(List.of(1L, policyId));
        recalculateMemberVacation(policyList,saveList);

        vacationPolicyMapRepository.saveAll(saveList);
    }

    public void recalculateMemberVacation(List<VacationPolicy> policyList, List<VacationPolicyMap> changeMapList) {
        LocalDate today = LocalDate.now();
        Map<Long, VacationPolicy> policyMap = policyList.stream().collect(Collectors.toMap(VacationPolicy::getVacationPolicyId, v -> v));

        Set<Long> changedMemberIdList = changeMapList.stream()
                .map(VacationPolicyMap::getMemberId)
                .collect(Collectors.toSet());

        if (!changedMemberIdList.isEmpty()) {
            // 1. 변경 대상자들의 올해 연차 제공 내역 가져오기
            List<VacationHistory> changeMemberHistoryList = vacationHistoryRepository.findAllByMemberIdInAndAccrualDateBetweenAndActiveTrue(
                    changedMemberIdList,
                    LocalDate.of(today.getYear(), 1, 1),
                    LocalDate.of(today.getYear(), 12, 31)
            );

            // 2. 기존 GRANT 내역을 바탕으로 'EXPIRE'를 위한 새로운 히스토리 객체들을 생성함
            List<VacationHistory> expireHistoryList = changeMemberHistoryList.stream()
                    .filter(vh -> vh.getTransactionType() == TransactionType.GRANT)
                    .map(vh -> {
                        // 기존 객체 복사 및 필드 설정 (새로운 Row 생성)
                        return VacationHistory.builder()
                                .memberId(vh.getMemberId())
                                .vacationCategory(vh.getVacationCategory())
                                .transactionType(TransactionType.EXPIRE)
                                .day(vh.getDay() * -1)
                                .accrualDate(null)
                                .expireDate(today)
                                .violationReason("기존 연차 만료 - 정책 변경 (" + vh.getViolationReason() + ")")
                                .build();
                    })
                    .collect(Collectors.toList());

            // 3. 메모리 내 계산을 위해 Map으로 그룹화
            // 기존 데이터들(GRANT, USE, CANCEL)은 계산용으로만 사용
            Map<Long, List<VacationHistory>> existingHistoryMap = changeMemberHistoryList.stream()
                    .collect(Collectors.groupingBy(VacationHistory::getMemberId));

            // 신규 데이터
            Map<Long, List<VacationHistory>> newExpireMap = expireHistoryList.stream()
                    .collect(Collectors.groupingBy(VacationHistory::getMemberId));

            // 정책 매핑 정보
            Map<Long, Long> activePolicyIdMap = changeMapList.stream()
                    .filter(VacationPolicyMap::isActived)
                    .collect(Collectors.toMap(VacationPolicyMap::getMemberId, VacationPolicyMap::getVacationPolicyId));

            //변경 대상자들의 프로필과 vacation 가져오기
            List<MemberProfile> changeMemberProfileList = memberProfileRepository.findAllByMemberIdIsIn(changedMemberIdList);
            List<Vacation> changeVacationList = vacationRepository.findAllByMemberIdIsInAndYear(changedMemberIdList, today.getYear());
            Map<Long, Vacation> changeVacationMap = changeVacationList.stream().collect(Collectors.toMap(Vacation::getMemberId, v -> v));

            List<VacationHistory> finalUpdateHistoryList = new ArrayList<>();
            List<Vacation> finalUpdateVacationList = new ArrayList<>();

            for (MemberProfile profile : changeMemberProfileList) {
                Long mId = profile.getMemberId();
                VacationPolicy targetPolicy = policyMap.get(activePolicyIdMap.get(mId));

                // 새 정책 기반 신규 부여분 생성
                List<VacationHistory> newGrants = vacationService.makeVacationHistory(profile, targetPolicy.getVacationPolicyType());

                // 통계 계산을 위해 모든 이력을 합침 (기존 전체 + 만료 내역 + 새 부여 내역)
                List<VacationHistory> combinedForSummary = new ArrayList<>();
                combinedForSummary.addAll(existingHistoryMap.getOrDefault(mId, Collections.emptyList())); // 원본 데이터
                combinedForSummary.addAll(newExpireMap.getOrDefault(mId, Collections.emptyList()));      // 만료 처리분
                combinedForSummary.addAll(newGrants);                                                    // 새 정책 부여분

                // 통계 갱신
                Vacation targetVacation = changeVacationMap.get(profile.getMemberId());
                Vacation newVacation = vacationService.makeVacation(profile, targetPolicy, combinedForSummary, targetVacation);

                // DB에 새로 저장할 내역들만 리스트에 추가
                finalUpdateHistoryList.addAll(newExpireMap.getOrDefault(mId, Collections.emptyList()));
                finalUpdateHistoryList.addAll(newGrants);
                finalUpdateVacationList.add(newVacation);
            }

            vacationHistoryRepository.saveAll(finalUpdateHistoryList);
            vacationRepository.saveAll(finalUpdateVacationList);
        }
    }

    private VacationPolicyMap saveNewMapping(Long memberId, Long policyId) {
        VacationPolicyMap newMapping = VacationPolicyMap.builder()
                .memberId(memberId)
                .vacationPolicyId(policyId)
                .applyStart(LocalDate.now())
                .applyEnd(null)
                .actived(true)
                .build();

        return newMapping;
    }
}
