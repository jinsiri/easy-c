package org.easyc.member.repository;

import org.easyc.member.entity.MemberPersonal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberPersonalRepository extends JpaRepository<MemberPersonal, Long> {
}
