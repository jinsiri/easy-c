package org.easyc.common.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BaseTreeDto extends BaseDto {
    private int treeLevel;
    private int treeSiblingOrder;
    private Long treeParentId;
    private int treeChildCount;
    private String treeSortCode;
}
