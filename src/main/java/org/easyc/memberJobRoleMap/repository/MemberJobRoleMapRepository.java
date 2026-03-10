package org.easyc.memberJobRoleMap.repository;

import org.easyc.memberJobRoleMap.entity.MemberJobRoleMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberJobRoleMapRepository extends JpaRepository<MemberJobRoleMap, Long> {
}
