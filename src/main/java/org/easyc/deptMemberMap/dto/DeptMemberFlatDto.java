package org.easyc.deptMemberMap.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DeptMemberFlatDto {
    private Long deptId;
    private Long memberId;
    private String memberNm;
    private String jobPositionNm;
    private Integer jobPositionLevel;

    public static DeptMemberMapResponseDto fromFlatDto(DeptMemberFlatDto flatDto) {
        return DeptMemberMapResponseDto.builder()
                .deptId(flatDto.getDeptId())
                .memberId(flatDto.getMemberId())
                .memberNm(flatDto.getMemberNm())
                .jobPositionNm(flatDto.getJobPositionNm())
                .jobPositionLevel(flatDto.getJobPositionLevel())
                .build();
    }
}
