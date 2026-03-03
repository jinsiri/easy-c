package org.easyc.vacation.repository;

import org.easyc.vacation.entity.Vacation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VacationRepository extends JpaRepository<Vacation, Long> {
    Optional<Vacation> findAllByMemberId(Long memberId);
    List<Vacation> findAllByDeptNm(String searchValue);
    List<Vacation> findAllByMemberNmContains(String searchValue);
}
