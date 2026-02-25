package org.easyc.memberJobGradeMap.repository;

import org.easyc.memberJobGradeMap.entity.MemberJobGradeMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberJobGradeMapRepository extends JpaRepository<MemberJobGradeMap, Long> {
}
