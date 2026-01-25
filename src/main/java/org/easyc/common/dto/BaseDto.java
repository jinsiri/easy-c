package org.easyc.common.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class BaseDto {
    private boolean deleted = false;
    private boolean active = true;
    private LocalDateTime registerDate;
    private String registerIp;
    private String registerId;
    private String registerNm;
    private LocalDateTime lastUpdateDate;
    private String lastUpdateIp;
    private String lastUpdateId;
    private String lastUpdateNm;
}