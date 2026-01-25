package org.easyc.deptMemberMap.repository;

import org.easyc.deptMemberMap.entity.DeptMemberMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeptMemberMapRepository extends JpaRepository<DeptMemberMap, Long> {
}
