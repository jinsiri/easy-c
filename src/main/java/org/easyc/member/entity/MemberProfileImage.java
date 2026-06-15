package org.easyc.member.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
public class MemberProfileImage {
    @Id
    @SequenceGenerator(name="member_profile_image_seq", sequenceName="member_profile_image_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="member_profile_image_seq")
    private Long memberProfileImageId;

    private Long memberId;

    private String memberProfileImageNm;

    private String memberProfileImagePath;
}
