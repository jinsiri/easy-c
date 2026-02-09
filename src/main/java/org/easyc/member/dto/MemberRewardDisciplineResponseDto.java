package org.easyc.member.dto;

import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.common.dto.EnumOption;
import org.easyc.common.support.EnumOptionMapper;
import org.easyc.member.entity.MemberRewardDiscipline;

import java.time.LocalDate;
import java.util.List;

@Getter
@SuperBuilder
public class MemberRewardDisciplineResponseDto extends BaseDto {
    private Long memberRewardDisciplineId;
    private Long memberId;
//    private RewardDisciplineType type;
    private EnumOption type;
    private LocalDate actionDate;
    private String title;
    private String reason;
    private String remark;

    public static MemberRewardDisciplineResponseDto fromEntity(MemberRewardDiscipline memberRewardDiscipline) {
        return MemberRewardDisciplineResponseDto.builder()
                .memberRewardDisciplineId(memberRewardDiscipline.getMemberRewardDisciplineId())
                .memberId(memberRewardDiscipline.getMember().getMemberId())
                .type(EnumOptionMapper.toOption(memberRewardDiscipline.getType(), "reward_discipline.type"))
                .actionDate(memberRewardDiscipline.getActionDate())
                .title(memberRewardDiscipline.getTitle())
                .reason(memberRewardDiscipline.getReason())
                .remark(memberRewardDiscipline.getRemark())
                .deleted(memberRewardDiscipline.isDeleted())
                .active(memberRewardDiscipline.isActive())
                .registerDate(memberRewardDiscipline.getRegisterDate())
                .registerIp(memberRewardDiscipline.getRegisterIp())
                .registerUser(memberRewardDiscipline.getRegisterUser())
                .lastUpdateDate(memberRewardDiscipline.getLastUpdateDate())
                .lastUpdateIp(memberRewardDiscipline.getLastUpdateIp())
                .lastUpdateId(memberRewardDiscipline.getLastUpdateId())
                .lastUpdateNm(memberRewardDiscipline.getLastUpdateNm())
                .build();
    }

    public static List<MemberRewardDisciplineResponseDto> fromEntityList(List<MemberRewardDiscipline> memberRewardDisciplines) {
        return memberRewardDisciplines.stream()
                .map(MemberRewardDisciplineResponseDto::fromEntity)
                .toList();
    }

}
