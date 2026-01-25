package org.easyc.jobGrade.repository;

import org.easyc.jobGrade.entity.JobGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobGradeRepository extends JpaRepository<JobGrade, Long> {
}
