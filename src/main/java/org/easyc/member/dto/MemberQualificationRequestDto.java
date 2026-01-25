package org.easyc.member.dto;

import lombok.Getter;
import lombok.Setter;
import org.easyc.member.constant.QualificationType;

import java.time.LocalDate;

@Getter
@Setter
public class MemberQualificationRequestDto {
    private Long memberQualificationId;
    private Long memberId;
    private QualificationType qualificationType;
    // 자격명
    private String qualificationName;
    // 자격번호
    private String qualificationNumber;
    // 자격등급
    private String qualificationGrade;
    // 기관명 (발급기관)
    private String issuingOrganization;
    // 취득일
    private LocalDate acquiredDate;
    // 만료일
    private LocalDate suspendedDate;

    public MemberQualificationRequestDto(QualificationType qualificationType, String qualificationName, String qualificationNumber, String qualificationGrade, String issuingOrganization, LocalDate acquiredDate) {
        this.qualificationType = qualificationType;
        this.qualificationName = qualificationName;
        this.qualificationNumber = qualificationNumber;
        this.qualificationGrade = qualificationGrade;
        this.issuingOrganization = issuingOrganization;
        this.acquiredDate = acquiredDate;
    }
}
