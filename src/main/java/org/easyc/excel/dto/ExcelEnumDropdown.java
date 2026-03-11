package org.easyc.excel.dto;

import java.lang.annotation.*;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ExcelEnumDropdown {

    Class<? extends Enum<?>> value();

}