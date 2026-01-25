package org.easyc.member.entity;

import jakarta.persistence.*;
import lombok.*;
import org.easyc.common.entity.BaseEntity;
import org.easyc.member.constant.AccountStatus;
import org.easyc.member.constant.MemberRole;

@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
public class Member extends BaseEntity {

    @Id
    @SequenceGenerator(name="member_seq", sequenceName="member_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="member_seq")
    private Long memberId;

    private String loginId;
    private String password;
    private String memberNm;
    private String memberNmEn; // 영문 이름
//    private String mainPhoneNumber; // 대표전화, 필요한지?

    @Enumerated(EnumType.STRING)
    private MemberRole memberRole;

    //계정 상태
    @Enumerated(EnumType.STRING)
    private AccountStatus accountStatus;
}
