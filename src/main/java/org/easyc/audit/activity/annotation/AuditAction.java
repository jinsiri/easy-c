package org.easyc.audit.activity.annotation;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AuditAction {
    String code();                  // 예: ASSET_UPDATE
    String name();                  // 예: "자산 수정"
    String targetType() default ""; // 예: ASSET, MEMBER
}
