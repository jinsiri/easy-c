package org.easyc.jobPosition.repository;

import org.easyc.jobPosition.entity.JobPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobPositionRepository extends JpaRepository<JobPosition, Long> {
    @Query("SELECT MAX(p.jobPositionLevel) FROM JobPosition p")
    Optional<Integer> findMaxLevel();
}
