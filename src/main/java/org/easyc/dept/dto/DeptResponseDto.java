package org.easyc.dept.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseTreeDto;
import org.easyc.dept.entity.Dept;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class DeptResponseDto extends BaseTreeDto {
    // 트리 공통 필드
    private String treeId;
    private String label;
    private String dataType;

    // 비즈니스 데이터필드
    private Long deptId;
    private String deptNm;
    private String deptShortNm;
    private String deptCode;
    private String deptEmail;

    private List<DeptResponseDto> children = new ArrayList<>();

    public static DeptResponseDto fromEntity(Dept dept) {
        return DeptResponseDto.builder()
                .treeId("DEPT_" + dept.getDeptId())
                .label(dept.getDeptNm())
                .dataType("dept")
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
