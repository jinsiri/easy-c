package org.easyc.vacation.repository;

import org.easyc.vacation.entity.Vacation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface VacationRepository extends JpaRepository<Vacation, Long> {
    Optional<Vacation> findAllByYearAndMemberId(Integer year, Long memberId);
    List<Vacation> findAllByMemberIdIsInAndYear(Collection<Long> memberIds, Integer year);
}
