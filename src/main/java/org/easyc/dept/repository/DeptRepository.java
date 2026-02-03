package org.easyc.dept.repository;

import jakarta.transaction.Transactional;
import org.easyc.dept.entity.Dept;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeptRepository extends JpaRepository<Dept, Long> {
    List<Dept> findAllByOrderByTreeSortCodeAsc();

    @Query("SELECT MAX(d.treeSortCode) FROM Dept d WHERE d.treeSortCode LIKE :parentCode% AND LENGTH(d.treeSortCode) = :targetLength")
    Optional<String> findMaxSortCodeByParent(@Param("parentCode") String parentCode, @Param("targetLength") int targetLength);

    @Modifying
    @Transactional
    @Query("UPDATE Dept d SET d.deleted = true WHERE d.treeSortCode LIKE :sortCode%")
    void softDeleteByTreeSortCode(@Param("sortCode") String sortCode);
}
