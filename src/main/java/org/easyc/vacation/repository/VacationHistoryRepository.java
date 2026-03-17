package org.easyc.vacation.repository;

import org.easyc.vacation.constant.TransactionType;
import org.easyc.vacation.entity.Vacation;
import org.easyc.vacation.entity.VacationHistory;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
public interface VacationHistoryRepository extends JpaRepository<VacationHistory, Long> {
    List<VacationHistory> findAllByMemberIdInAndAccrualDateBetweenAndActiveTrue(Collection<Long> memberIdList, LocalDate startDate, LocalDate endDate);
    List<VacationHistory> findAllByMemberIdAndAccrualDateBetweenAndActiveTrueOrderByVacationId(Long memberId, LocalDate startDate, LocalDate endDate);

    List<VacationHistory> findTop10ByMemberIdAndAccrualDateBetweenAndActiveTrueOrderByAccrualDateDesc(Long memberId, LocalDate startDate, LocalDate endDate);
}
