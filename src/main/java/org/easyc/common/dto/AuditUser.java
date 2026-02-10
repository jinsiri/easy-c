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
public class AuditUser {

    @Column(name = "login_id")
    private String loginId;

    @Column(name = "member_nm")
    private String memberNm;

    @Column(name = "member_role")
    private String memberRole;
}
