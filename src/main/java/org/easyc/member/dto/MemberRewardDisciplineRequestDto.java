package org.easyc.member.dto;

import lombok.Getter;
import lombok.Setter;
import org.easyc.member.constant.RewardDisciplineType;

import java.time.LocalDate;

@Getter
@Setter
public class MemberRewardDisciplineRequestDto {
    private Long memberRewardDisciplineId;
    private Long memberId;
    private RewardDisciplineType type;
    private LocalDate actionDate;
    private String title;
    private String reason;
    private String remark;

    public MemberRewardDisciplineRequestDto(RewardDisciplineType type, LocalDate actionDate, String title, String reason) {
        this.type = type;
        this.actionDate = actionDate;
        this.title = title;
        this.reason = reason;
    }
}
