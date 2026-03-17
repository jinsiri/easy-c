package org.easyc.vacation.repository;

import org.easyc.attendance.entity.AttendancePolicy;
import org.easyc.vacation.entity.VacationPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface VacationPolicyRepository extends JpaRepository<VacationPolicy, Long> {
    Optional<VacationPolicy> findByVacationPolicyIdAndActiveTrue(Long vacationPolicyId);
    List<VacationPolicy> findAllByActiveTrueOrderByVacationPolicyIdAsc();

    List<VacationPolicy> findAllByVacationPolicyIdInAndActiveTrue(Collection<Long> vacationPolicyIds);
}
