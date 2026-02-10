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
    private boolean deleted;
    private boolean active;
    private LocalDateTime registerDate;
    private String registerIp;
    private AuditUser registerUser;
    private LocalDateTime lastUpdateDate;
    private String lastUpdateIp;
    private AuditUser lastUpdateUser;
//    private String lastUpdateId;
//    private String lastUpdateNm;
}