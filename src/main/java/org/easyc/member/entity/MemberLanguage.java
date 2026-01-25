package org.easyc.member.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.easyc.common.entity.BaseEntity;
import org.easyc.member.dto.MemberLanguageRequestDto;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberLanguage extends BaseEntity { //회원정보_어학

    @Id
    @SequenceGenerator(name="member_language_seq", sequenceName="member_language_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="member_language_seq")
    private Long memberLanguageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    private String languageType;   // 구분
    private String languageName;   // 어학명
    private LocalDate evaluationDate; // 평가일
    private String evaluationAgency; // 평가기관
    private String score; // 점수 (숫자/문자 혼합 대비)
    private String grade; // 등급
    private String etc; // 기타


    private MemberLanguage(
            Member member,
            String languageType,
            String languageName,
            LocalDate evaluationDate,
            String evaluationAgency,
            String score,
            String grade,
            String etc
    ) {
        this.member = member;
        this.languageType = languageType;
        this.languageName = languageName;
        this.evaluationDate = evaluationDate;
        this.evaluationAgency = evaluationAgency;
        this.score = score;
        this.grade = grade;
        this.etc = etc;
    }

    public static MemberLanguage of(Member member, MemberLanguageRequestDto dto) {
        return new MemberLanguage(
                member,
                dto.getLanguageType(),
                dto.getLanguageName(),
                dto.getEvaluationDate(),
                dto.getEvaluationAgency(),
                dto.getScore(),
                dto.getGrade(),
                dto.getEtc()
        );
    }
}

