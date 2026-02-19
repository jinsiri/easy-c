package org.easyc.attendance.repository;

import org.easyc.attendance.constant.WorkStatus;
import org.easyc.attendance.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findAllByRegisterUser_LoginIdAndWorkDateBetween(String registerId, LocalDate workDateAfter, LocalDate workDateBefore);
    Optional<Attendance> findByRegisterUser_LoginIdAndWorkDate(String registerId, LocalDate workDate);

    List<Attendance> findAllByWorkDate(LocalDate workDate);

    Optional<Attendance> findByRegisterUser_LoginIdAndAttendanceId(String loginId, Long attendanceId);

    List<Attendance> findAllByWorkDateAndDeptNm(LocalDate workDate, String deptNm);

    List<Attendance> findAllByWorkDateAndRegisterUser_MemberNm(LocalDate workDate, String memberNm);

    List<Attendance> findAllByWorkDateAndWorkStatus(LocalDate workDate, WorkStatus workStatus);


}
