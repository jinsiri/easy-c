package org.easyc.util;

import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.write.metadata.style.WriteCellStyle;
import com.alibaba.excel.write.metadata.style.WriteFont;
import com.alibaba.excel.write.style.HorizontalCellStyleStrategy;
import com.alibaba.excel.write.style.column.LongestMatchColumnWidthStyleStrategy;
import jakarta.servlet.http.HttpServletResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import com.alibaba.excel.EasyExcel;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.easyc.excel.handler.EnumDropdownSheetHandler;

public class ExcelUtil {
    public static class SheetData<T> {

        public Class<T> clazz;
        public List<T> data;

        public SheetData(Class<T> clazz, List<T> data) {
            this.clazz = clazz;
            this.data = data;
        }
    }

    public static <T> void excelDownload(
            HttpServletResponse response,
            String fileName,
            String sheetName,
            Class<T> clazz,
            List<T> data
    ) throws Exception {
        WriteCellStyle headStyle = new WriteCellStyle();
        headStyle.setHorizontalAlignment(HorizontalAlignment.CENTER);
        headStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        headStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());

        WriteFont headFont = new WriteFont();
        headFont.setFontName("Arial");
        headFont.setBold(true);
        headFont.setFontHeightInPoints((short) 11);
        headStyle.setWriteFont(headFont);

        WriteCellStyle contentStyle = new WriteCellStyle();
        contentStyle.setHorizontalAlignment(HorizontalAlignment.CENTER);
        contentStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        WriteFont contentFont = new WriteFont();
        contentFont.setFontName("Arial");
        contentFont.setFontHeightInPoints((short) 10);
        contentStyle.setWriteFont(contentFont);

        HorizontalCellStyleStrategy styleStrategy =
                new HorizontalCellStyleStrategy(headStyle, contentStyle);


        setResponse(response, fileName);

        EasyExcel.write(response.getOutputStream(), clazz)
                .registerWriteHandler(styleStrategy)
                .registerWriteHandler(new LongestMatchColumnWidthStyleStrategy())
                .registerWriteHandler(new EnumDropdownSheetHandler(clazz))
                .sheet(sheetName)
                .doWrite(data);
    }

    public static void downloadMultiSheet(
            HttpServletResponse response,
            String fileName,
            Map<String, SheetData<?>> sheetDataMap
    ) throws Exception {

        setResponse(response, fileName);

        ExcelWriter writer = EasyExcel.write(response.getOutputStream())
                .registerWriteHandler(new LongestMatchColumnWidthStyleStrategy())
                .build();

        int sheetNo = 0;

        for (Map.Entry<String, SheetData<?>> entry : sheetDataMap.entrySet()) {

            String sheetName = entry.getKey();
            SheetData<?> sheetData = entry.getValue();

            var sheet = EasyExcel.writerSheet(sheetNo++, sheetName)
                    .head(sheetData.clazz)
                    .build();

            writer.write(sheetData.data, sheet);
        }

        writer.finish();
    }


    private static void setResponse(
            HttpServletResponse response,
            String fileName
    ) throws Exception {

        String encodedFileName =
                URLEncoder.encode(fileName, StandardCharsets.UTF_8)
                        .replaceAll("\\+", "%20");

        response.setContentType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        response.setCharacterEncoding("utf-8");

        response.setHeader(
                "Content-Disposition",
                "attachment; filename*=UTF-8''" + encodedFileName + ".xlsx"
        );
    }

}
