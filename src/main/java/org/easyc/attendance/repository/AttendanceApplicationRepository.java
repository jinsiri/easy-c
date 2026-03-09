package org.easyc.attendance.repository;

import org.easyc.attendance.entity.AttendanceApplication;
import org.easyc.common.constant.BasicStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceApplicationRepository extends JpaRepository<AttendanceApplication, Long> {
    List<AttendanceApplication> findAllByWorkDateAndMemberId(LocalDate workDate, Long memberId);
    List<AttendanceApplication> findAllByWorkDateAndActiveTrueOrderByAttendanceApplicationIdAsc(LocalDate workDate);
    List<AttendanceApplication> findAllByMemberIdAndActiveTrueAndWorkDateBetween(Long memberId, LocalDate startDate, LocalDate endDate);


    List<AttendanceApplication> findAllByActiveTrueOrderByAttendanceApplicationIdAsc();
    List<AttendanceApplication> findAllByDeptNmAndActiveTrueOrderByAttendanceApplicationIdAsc(String deptNm);
    List<AttendanceApplication> findAllByMemberNmContainsAndActiveTrueOrderByAttendanceApplicationIdAsc(String searchValue);

}
