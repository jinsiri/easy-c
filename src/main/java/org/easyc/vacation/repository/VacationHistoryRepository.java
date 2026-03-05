package org.easyc.vacation.repository;

import org.easyc.vacation.constant.TransactionType;
import org.easyc.vacation.entity.Vacation;
import org.easyc.vacation.entity.VacationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VacationHistoryRepository extends JpaRepository<VacationHistory, Long> {

    List<VacationHistory> findAllByMemberIdAndDeletedFalse(Long memberId);
    List<VacationHistory> findAllByMemberIdAndTransactionTypeEqualsAndDeletedFalse(Long memberId, TransactionType transactionType);
}
