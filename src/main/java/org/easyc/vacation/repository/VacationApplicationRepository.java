package org.easyc.vacation.repository;

import org.easyc.common.constant.BasicStatus;
import org.easyc.vacation.entity.VacationApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VacationApplicationRepository extends JpaRepository<VacationApplication, Long> {
    List<VacationApplication> findTop10ByMemberIdAndDeletedFalseOrderByRegisterDateDesc(Long memberId);
}
