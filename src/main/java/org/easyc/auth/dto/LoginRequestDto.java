package org.easyc.auth.dto;

import lombok.Getter;

@Getter
//@NoArgsConstructor
public class LoginRequestDto {
    private String loginId;
    private String encryptedPassword;
}
