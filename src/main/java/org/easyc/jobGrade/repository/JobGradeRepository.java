package org.easyc.jobGrade.repository;

import org.easyc.jobGrade.entity.JobGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobGradeRepository extends JpaRepository<JobGrade, Long> {
    boolean existsByJobGradeNm(String nm);
    boolean existsByJobGradeCode(String code);

    @Query("SELECT MAX(p.jobGradeLevel) FROM JobGrade p")
    Optional<Integer> findMaxLevel();
}
