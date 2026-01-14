package org.easyc.common.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BaseDto {
    private boolean delete = false;
    private boolean active = true;
    private LocalDateTime registerDate;
    private String registerIp;
    private String registerId;
    private String registerNm;
    private LocalDateTime lastUpdateDate;
    private String lastUpdateIp;
    private String lastUpdateId;
}
