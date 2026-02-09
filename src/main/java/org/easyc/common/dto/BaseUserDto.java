package org.easyc.common.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BaseUserDto {

    @Column(name = "user_id")
    private String userId;

    @Column(name = "user_nm")
    private String userNm;

    @Column(name = "role")
    private String role;
}
