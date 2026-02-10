package org.easyc.memberJobPositionMap.repository;

import org.easyc.memberJobPositionMap.entity.MemberJobPositionMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberJobPositionMapRepository extends JpaRepository<MemberJobPositionMap, Long> {
}
