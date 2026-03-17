package org.easyc.common.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class PageRequestDto<T> {
    private T request;
    private Integer number = 0;
    private Integer size = 50;
}
