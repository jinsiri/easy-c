package org.easyc.schedule.repository;

import org.easyc.schedule.constant.ScheduleType;
import org.easyc.schedule.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByMemberId(Long memberId);
    List<Schedule> findByMemberIdAndStartDateBetweenAndDeletedFalse(Long memberId, LocalDate firstDay, LocalDate lastDay);
    List<Schedule> findByMemberIdInAndStartDateBetweenAndDeletedFalse(List<Long> memberIds, LocalDate firstDay, LocalDate lastDay);
    List<Schedule> findByMemberIdInAndStartDateBetweenAndPublishedTrueAndDeletedFalse(List<Long> memberIds, LocalDate firstDay, LocalDate lastDay);

    List<Schedule> findByMemberIdAndStartDateBetweenAndScheduleTypeInAndDeletedFalse(Long memberId, LocalDate firstDay, LocalDate lastDay, List<ScheduleType> scheduleTypes);
    List<Schedule> findByMemberIdInAndStartDateBetweenAndScheduleTypeInAndDeletedFalse(List<Long> memberIds, LocalDate firstDay, LocalDate lastDay, List<ScheduleType> scheduleTypes);

    Optional<Schedule> findByScheduleIdAndDeletedFalse(Long id);
    List<Schedule> findByMemberIdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndDeletedFalse(Long memberId, LocalDate date, LocalDate date1);

}
