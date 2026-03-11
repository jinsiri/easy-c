package org.easyc.excel.converter;

import com.alibaba.excel.converters.Converter;
import com.alibaba.excel.enums.CellDataTypeEnum;
import com.alibaba.excel.metadata.data.WriteCellData;
import com.alibaba.excel.metadata.property.ExcelContentProperty;
import com.alibaba.excel.metadata.GlobalConfiguration;
import org.easyc.excel.dto.EnumInterface;

public class EnumConverter implements Converter<EnumInterface> {

    @Override
    public Class<?> supportJavaTypeKey() {
        return EnumInterface.class;
    }

    @Override
    public CellDataTypeEnum supportExcelTypeKey() {
        return CellDataTypeEnum.STRING;
    }

    @Override
    public WriteCellData<?> convertToExcelData(
            EnumInterface value,
            ExcelContentProperty contentProperty,
            GlobalConfiguration globalConfiguration
    ) {
        return new WriteCellData<>(value.formatViewText());
    }
}