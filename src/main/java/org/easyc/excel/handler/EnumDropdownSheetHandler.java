package org.easyc.excel.handler;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.write.handler.SheetWriteHandler;
import com.alibaba.excel.write.metadata.holder.WriteSheetHolder;
import com.alibaba.excel.write.metadata.holder.WriteWorkbookHolder;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.easyc.excel.dto.EnumInterface;
import org.easyc.excel.dto.ExcelEnumDropdown;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class EnumDropdownSheetHandler implements SheetWriteHandler {
    private final Class<?> dtoClass;

    public EnumDropdownSheetHandler(Class<?> dtoClass) {
        this.dtoClass = dtoClass;
    }

    @Override
    public void afterSheetCreate(
            WriteWorkbookHolder workbookHolder,
            WriteSheetHolder sheetHolder
    ) {

        Workbook workbook = workbookHolder.getWorkbook();
        Sheet sheet = sheetHolder.getSheet();

        Sheet hidden = workbook.createSheet("hidden");

        workbook.setSheetHidden(workbook.getSheetIndex(hidden), true);

        int hiddenRow = 0;

        for (Field field : dtoClass.getDeclaredFields()) {

            ExcelEnumDropdown dropdown =
                    field.getAnnotation(ExcelEnumDropdown.class);

            ExcelProperty excelProperty =
                    field.getAnnotation(ExcelProperty.class);

            if (dropdown == null || excelProperty == null) {
                continue;
            }

            int columnIndex = excelProperty.index();

            Class<? extends Enum<?>> enumClass = dropdown.value();

            List<String> values = new ArrayList<>();

            for (Enum<?> e : enumClass.getEnumConstants()) {

                if (e instanceof EnumInterface excelEnum) {
                    values.add(excelEnum.formatViewText());
                } else {
                    values.add(e.name());
                }
            }

            Row row = hidden.createRow(hiddenRow);

            for (int i = 0; i < values.size(); i++) {
                row.createCell(i).setCellValue(values.get(i));
            }

            String rangeName = enumClass.getSimpleName();

            Name namedRange = workbook.createName();

            namedRange.setNameName(rangeName);

            namedRange.setRefersToFormula(
                    "hidden!" +
                            "$A$" + (hiddenRow + 1) +
                            ":$" + getColumn(values.size() - 1) +
                            "$" + (hiddenRow + 1)
            );

            DataValidationHelper helper =
                    sheet.getDataValidationHelper();

            DataValidationConstraint constraint =
                    helper.createFormulaListConstraint(rangeName);

            CellRangeAddressList addressList =
                    new CellRangeAddressList(
                            1,
                            5000,
                            columnIndex,
                            columnIndex
                    );

            DataValidation validation =
                    helper.createValidation(constraint, addressList);

            sheet.addValidationData(validation);

            hiddenRow++;
        }
    }

    private String getColumn(int index) {

        StringBuilder sb = new StringBuilder();

        while (index >= 0) {
            sb.insert(0, (char) ('A' + index % 26));
            index = index / 26 - 1;
        }

        return sb.toString();
    }
}
