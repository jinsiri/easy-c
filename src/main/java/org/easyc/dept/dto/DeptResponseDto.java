package org.easyc.dept.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseTreeDto;
import org.easyc.dept.entity.Dept;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class DeptResponseDto extends BaseTreeDto {
    private Long deptId;
    private String deptNm;
    private String deptShortNm;
    private String deptCode;
    private String deptEmail;

    // For tree icon
    private String dataType;

    public static DeptResponseDto fromEntity(Dept dept) {
        return DeptResponseDto.builder()
                .deptId(dept.getDeptId())
                .deptNm(dept.getDeptNm())
                .deptShortNm(dept.getDeptShortNm())
                .deptCode(dept.getDeptCode())
                .deptEmail(dept.getDeptEmail())
                .treeLevel(dept.getTreeLevel())
                .treeSiblingOrder(dept.getTreeSiblingOrder())
                .treeParentId(dept.getTreeParentId())
                .treeChildCount(dept.getTreeChildCount())
                .treeSortCode(dept.getTreeSortCode())
                .deleted(dept.isDeleted())
                .active(dept.isActive())
                .registerDate(dept.getRegisterDate())
                .registerIp(dept.getRegisterIp())
                .registerId(dept.getRegisterId())
                .registerNm(dept.getRegisterNm())
                .lastUpdateDate(dept.getLastUpdateDate())
                .lastUpdateIp(dept.getLastUpdateIp())
                .lastUpdateId(dept.getLastUpdateId())
                .build();
    }

    public static List<DeptResponseDto> fromEntityList(List<Dept> depts) {
        return depts.stream().map(DeptResponseDto::fromEntity).collect(Collectors.toList());
    }
}
