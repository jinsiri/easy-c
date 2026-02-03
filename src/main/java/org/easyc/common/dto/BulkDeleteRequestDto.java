package org.easyc.common.dto;

import lombok.Getter;

import java.util.Set;

/**
 * query string 길이 제한 대비 삭제용 DTO
 */
@Getter
public class BulkDeleteRequestDto {
    private Set<Long> ids;
}
