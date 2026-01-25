package org.easyc.member.dto;

import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.member.entity.MemberLanguage;

import java.time.LocalDate;
import java.util.List;

@Getter
@SuperBuilder
public class MemberLanguageResponseDto extends BaseDto {
    private Long memberLanguageId;
    private Long memberId;

    private String languageType;   // 구분
    private String languageName;   // 어학명
    private LocalDate evaluationDate; // 평가일
    private String evaluationAgency; // 평가기관
    private String score; // 점수 (숫자/문자 혼합 대비)
    private String grade; // 등급
    private String etc; // 기타

    public static MemberLanguageResponseDto fromEntity(MemberLanguage memberLanguage) {
        return MemberLanguageResponseDto.builder()
                .memberLanguageId(memberLanguage.getMemberLanguageId())
                .memberId(memberLanguage.getMember().getMemberId())
                .languageType(memberLanguage.getLanguageType())
                .languageName(memberLanguage.getLanguageName())
                .evaluationDate(memberLanguage.getEvaluationDate())
                .evaluationAgency(memberLanguage.getEvaluationAgency())
                .score(memberLanguage.getScore())
                .grade(memberLanguage.getGrade())
                .etc(memberLanguage.getEtc())
                .deleted(memberLanguage.isDeleted())
                .active(memberLanguage.isActive())
                .registerDate(memberLanguage.getRegisterDate())
                .registerIp(memberLanguage.getRegisterIp())
                .registerId(memberLanguage.getRegisterId())
                .registerNm(memberLanguage.getRegisterNm())
                .lastUpdateDate(memberLanguage.getLastUpdateDate())
                .lastUpdateIp(memberLanguage.getLastUpdateIp())
                .lastUpdateId(memberLanguage.getLastUpdateId())
                .lastUpdateNm(memberLanguage.getLastUpdateNm())
                .build();
    }

    public static List<MemberLanguageResponseDto> fromEntityList(List<MemberLanguage> memberLanguageList) {
        return memberLanguageList.stream()
                .map(MemberLanguageResponseDto::fromEntity)
                .toList();
    }
}