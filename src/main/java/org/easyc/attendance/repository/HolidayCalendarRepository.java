package org.easyc.attendance.repository;

import org.easyc.attendance.entity.AttendancePolicy;
import org.easyc.attendance.entity.HolidayCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HolidayCalendarRepository extends JpaRepository<HolidayCalendar, Long> {
    List<HolidayCalendar> findByYearEquals(String year);

    Optional<HolidayCalendar> findByStartDate(LocalDate startDate);
}
