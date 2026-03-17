package org.easyc.common.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.List;
import org.springframework.data.domain.Page;

@Getter
@Setter
public class PageResponseDto<T> {
    private List<T> content;
    private Long totalElements;
    private Integer totalPages;
    private Integer number;
    private Integer size;


    public PageResponseDto(Page<T> page) {
        this.content = page.getContent();
        this.totalElements = page.getTotalElements();
        this.totalPages = page.getTotalPages();
        this.number = page.getNumber();
        this.size = page.getSize();
    }
}