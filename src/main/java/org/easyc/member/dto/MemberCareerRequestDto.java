package org.easyc.member.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MemberCareerRequestDto {
    private Long memberCareerId;

    private Long memberId;

    // 시작일
    private LocalDate startDate;
    // 종료일
    private LocalDate endDate;

    // 근무처
    private String companyName;

    // 직위
    private String positionTitle;

    // 담당업무
    private String jobDescription;

    // 근무기간
    private String workPeriod; // todo 예: 6개월 등.. 필요없는 경우 삭제

    // 퇴직사유
    private String resignationReason;

    public MemberCareerRequestDto(LocalDate startDate, LocalDate endDate, String companyName, String positionTitle, String jobDescription, String workPeriod, String resignationReason) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.companyName = companyName;
        this.positionTitle = positionTitle;
        this.jobDescription = jobDescription;
        this.workPeriod = workPeriod;
        this.resignationReason = resignationReason;
    }
}
