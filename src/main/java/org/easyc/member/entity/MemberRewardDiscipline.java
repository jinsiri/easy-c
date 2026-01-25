package org.easyc.member.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.easyc.common.entity.BaseEntity;
import org.easyc.member.constant.RewardDisciplineType;
import org.easyc.member.dto.MemberRewardDisciplineRequestDto;

import java.time.LocalDate;

@Entity
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
public class MemberRewardDiscipline extends BaseEntity { //회원정보_포상 징계
    @Id
    @SequenceGenerator(name="member_reward_discipline_seq", sequenceName="member_reward_discipline_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="member_reward_discipline_seq")
    private Long memberRewardDisciplineId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // 구분 (포상 / 징계)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RewardDisciplineType type; // todo 상세유형 나누고 싶은 경우 포상/징계 분리하여 추가

    // 일자
    @Column(nullable = false)
    private LocalDate actionDate;

    // 내용 (예: 우수사원 선정, 무단결근)
    @Column(nullable = false, length = 200)
    private String title;

    // 사유 (상세 설명)
    @Column(length = 1000)
    private String reason;

    // 기타 비고
    @Column(length = 500)
    private String remark;

    private MemberRewardDiscipline(Member member, MemberRewardDisciplineRequestDto dto) {
        this.member = member;
        this.type = dto.getType();
        this.actionDate = dto.getActionDate();
        this.title = dto.getTitle();
        this.reason = dto.getReason();
        this.remark = dto.getRemark();
    }

    public static MemberRewardDiscipline of(Member member, MemberRewardDisciplineRequestDto dto) {
        return new MemberRewardDiscipline(member, dto);
    }
}
