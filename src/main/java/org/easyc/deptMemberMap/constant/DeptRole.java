package org.easyc.deptMemberMap.constant;

import lombok.Getter;

@Getter
public enum DeptRole {
    MANAGER("부서장"),
    SUB_MANAGER("부부서장"),
    MEMBER("부서원");

    private final String description;

    DeptRole(String description) {
        this.description = description;
    }
}
