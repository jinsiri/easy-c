package org.easyc.memberJobTitleMap.repository;

import org.easyc.memberJobTitleMap.entity.MemberJobTitleMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberJobTitleMapRepository extends JpaRepository<MemberJobTitleMap, Long> {
}
