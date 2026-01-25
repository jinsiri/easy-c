package org.easyc.member.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.easyc.common.entity.BaseEntity;
import org.easyc.member.constant.QualificationType;
import org.easyc.member.dto.MemberQualificationRequestDto;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@SuperBuilder
public class MemberQualification extends BaseEntity { // 회원정보_자격

    @Id
    @SequenceGenerator(name="member_qualification_seq", sequenceName="member_qualification_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="member_qualification_seq")
    private Long memberQualificationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // 구분 (자격증 / 면허 / 인증 등)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private QualificationType qualificationType;

    // 자격명
    @Column(nullable = false, length = 100)
    private String qualificationName;

    // 자격번호
    @Column(length = 50)
    private String qualificationNumber;

    // 자격등급
    @Column(length = 50)
    private String qualificationGrade;

    // 기관명 (발급기관)
    @Column(length = 100)
    private String issuingOrganization;

    // 취득일
    private LocalDate acquiredDate;

    // 정지일 / 만료일
    private LocalDate suspendedDate;


    private MemberQualification(Member member, MemberQualificationRequestDto dto) {
        this.member = member;
        this.qualificationType = dto.getQualificationType();
        this.qualificationName = dto.getQualificationName();
        this.qualificationNumber = dto.getQualificationNumber();
        this.qualificationGrade = dto.getQualificationGrade();
        this.issuingOrganization = dto.getIssuingOrganization();
        this.acquiredDate = dto.getAcquiredDate();
        this.suspendedDate = dto.getSuspendedDate();
    }

    public static MemberQualification of(Member member, MemberQualificationRequestDto dto) {
        return new MemberQualification(member, dto);
    }
}
