package org.easyc.member.repository;

import org.easyc.member.entity.MemberProfile;
import org.easyc.member.entity.MemberProfileImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface MemberProfileImageRepository extends JpaRepository<MemberProfileImage, Long> {
    Optional<MemberProfileImage> findByMemberId(Long memberId);
}
