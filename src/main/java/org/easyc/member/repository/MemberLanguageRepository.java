package org.easyc.member.repository;

import org.easyc.member.entity.MemberLanguage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberLanguageRepository extends JpaRepository<MemberLanguage, Long> {
    List<MemberLanguage> findAllByMember_memberId(Long memberId);
}