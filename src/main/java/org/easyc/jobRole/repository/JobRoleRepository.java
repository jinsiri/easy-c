package org.easyc.jobRole.repository;

import org.easyc.jobRole.entity.JobRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobRoleRepository extends JpaRepository<JobRole, Long> {
    boolean existsByJobRoleNm(String nm);

    @Query("SELECT MAX(p.jobRoleOrder) FROM JobRole p")
    Optional<Integer> findMaxLevel();
}
