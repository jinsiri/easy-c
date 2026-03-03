package org.easyc.vacation.repository;

import org.easyc.attendance.entity.AttendancePolicyMap;
import org.easyc.vacation.entity.VacationPolicy;
import org.easyc.vacation.entity.VacationPolicyMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VacationPolicyMapRepository extends JpaRepository<VacationPolicyMap, Long> {
    Optional<VacationPolicyMap> findTopByMemberIdAndDeletedFalseOrderByMappingIdDesc(Long memberId);

    @Query("SELECT a.vacationPolicyId, count(a) FROM VacationPolicyMap a GROUP BY a.vacationPolicyId")
    List<Object[]> countGroupByVacationPolicyId();

}
