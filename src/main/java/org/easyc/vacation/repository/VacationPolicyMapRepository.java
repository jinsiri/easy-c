package org.easyc.vacation.repository;

import org.easyc.vacation.entity.VacationPolicy;
import org.easyc.vacation.entity.VacationPolicyMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface VacationPolicyMapRepository extends JpaRepository<VacationPolicyMap, Long> {
    List<VacationPolicyMap> findAllByVacationPolicyIdAndActivedTrue(Long policyId);
    List<VacationPolicyMap> findAllByMemberIdIsInAndActivedTrue(List<Long> updateList);

    @Query("""
        SELECT v.vacationPolicyId, count(v)
        FROM VacationPolicyMap v
        WHERE v.actived = true
        GROUP BY v.vacationPolicyId
    """)
    List<Object[]> countGroupByVacationPolicyId();

    @Query("""
        SELECT p
        FROM VacationPolicyMap v
        JOIN VacationPolicy p
        ON v.vacationPolicyId = p.vacationPolicyId
        WHERE v.actived = true AND v.memberId = :memberId
    """)
    Optional<VacationPolicy> findPolicyByMemberIdAndActivedTrue(Long memberId);

}
