package org.easyc.member.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MemberLanguageRequestDto {
    private Long memberLanguageId;
    private Long memberId;

    private String languageType;
    private String languageName;
    private LocalDate evaluationDate;
    private String evaluationAgency;
    private String score;
    private String grade;
    private String etc;

    public MemberLanguageRequestDto(String languageType, String languageName, LocalDate evaluationDate, String evaluationAgency, String score, String grade, String etc) {
        this.languageType = languageType;
        this.languageName = languageName;
        this.evaluationDate = evaluationDate;
        this.evaluationAgency = evaluationAgency;
        this.score = score;
        this.grade = grade;
        this.etc = etc;
    }
}