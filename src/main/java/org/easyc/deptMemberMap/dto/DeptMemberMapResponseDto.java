package org.easyc.deptMemberMap.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.deptMemberMap.constant.DeptRole;
import org.easyc.deptMemberMap.entity.DeptMemberMap;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class DeptMemberMapResponseDto extends BaseDto {
    private Long deptMemberMapId;
    private Long deptId;
    private Long memberId;
    private Long jobTitleId;
    private DeptRole deptRole;
    private boolean isPrimary;

    private String memberNm;
    private String deptNm;
    private String jobTitleNm;
    private String jobPositionNm;
    private int jobPositionLevel;

    public static DeptMemberMapResponseDto fromEntity(DeptMemberMap map) {
        return DeptMemberMapResponseDto.builder()
                .deptMemberMapId(map.getDeptMemberMapId())
                .deptId(map.getDeptId())
                .memberId(map.getMemberId())
                .jobTitleId(map.getJobTitleId())
                .deptRole(map.getDeptRole())
                .isPrimary(map.isPrimary())
                .deptNm(map.getDept().getDeptNm())
                .jobTitleNm(map.getJobTitle() != null ? map.getJobTitle().getJobTitleNm() : null)
                .memberNm(map.getMember().getMemberNm() != null ? map.getMember().getMemberNm() : null)
                .build();
    }

    public static List<DeptMemberMapResponseDto> fromEntityList(List<DeptMemberMap> maps) {
        return maps.stream()
                .map(DeptMemberMapResponseDto::fromEntity)
                .toList();
    }
}
