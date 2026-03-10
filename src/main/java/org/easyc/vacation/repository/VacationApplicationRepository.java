package org.easyc.vacation.repository;

import org.easyc.common.constant.BasicStatus;
import org.easyc.vacation.entity.VacationApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VacationApplicationRepository extends JpaRepository<VacationApplication, Long> {
    List<VacationApplication> findAllByMemberIdAndStartDateBetween(Long memberId, LocalDate startDate, LocalDate endDate);
    List<VacationApplication> findAllByDeletedFalseOrderByRegisterDateAsc();

    List<VacationApplication> findAllByMemberNmContainsAndActiveTrueOrderByVacationApplicationIdAsc(String searchValue);

    List<VacationApplication> findAllByStatusAndActiveTrueOrderByVacationApplicationIdAsc(BasicStatus basicStatus);

    List<VacationApplication> findAllByDeptNmContainsAndActiveTrueOrderByVacationApplicationIdAsc(String searchValue);

    List<VacationApplication> findAllByStartDateLessThanEqualAndEndDateGreaterThanEqualAndActiveTrueOrderByVacationApplicationIdAsc(LocalDate workDate1, LocalDate workDate2);
}
