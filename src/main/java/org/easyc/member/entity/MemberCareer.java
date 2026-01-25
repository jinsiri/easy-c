package org.easyc.member.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.easyc.common.entity.BaseEntity;
import org.easyc.member.dto.MemberCareerRequestDto;

import java.time.LocalDate;

@Entity
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
public class MemberCareer extends BaseEntity { //회원정보_경력
    @Id
    @SequenceGenerator(name="member_career_seq", sequenceName="member_career_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="member_career_seq")
    private Long memberCareerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

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


    private MemberCareer(Member member, MemberCareerRequestDto dto) {
        this.member = member;
        this.startDate = dto.getStartDate();
        this.endDate = dto.getEndDate();
        this.companyName = dto.getCompanyName();
        this.positionTitle = dto.getPositionTitle();
        this.jobDescription = dto.getJobDescription();
        this.workPeriod = dto.getWorkPeriod();
        this.resignationReason = dto.getResignationReason();
    }

    public static MemberCareer of(Member member, MemberCareerRequestDto dto) {
        return new MemberCareer(member, dto);
    }

}
