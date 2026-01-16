package org.easyc.attendance.repository;

import org.easyc.attendance.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findAllByMemberIdAndWorkDateBetween(Long memberId, LocalDate workDateAfter, LocalDate workDateBefore);

    Optional<Attendance> findByMemberIdAndWorkDate(Long memberId, LocalDate workDate);
    Attendance findAllByMemberIdAndWorkDate(Long memberId, LocalDate workDate);
}
