package org.easyc.jobTitle.repository;

import org.easyc.jobTitle.entity.JobTitle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobTitleRepository extends JpaRepository<JobTitle, Long> {
    boolean existsByJobTitleNm(String nm);
    boolean existsByJobTitleCode(String code);

    @Query("SELECT MAX(p.jobTitleLevel) FROM JobTitle p")
    Optional<Integer> findMaxLevel();
}
