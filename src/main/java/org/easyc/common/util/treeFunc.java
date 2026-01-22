package org.easyc.common.util;

public class treeFunc {
    public static String incrementSortCode(String maxCode, String dataTypeKrNm) {
        String prefix = maxCode.substring(0, maxCode.length() - 3);
        int lastThree = Integer.parseInt(maxCode.substring(maxCode.length() - 3));

        if (lastThree >= 999) {
            throw new IllegalStateException("한 레벨에 999개 이상의 " + dataTypeKrNm + "을(를) 생성할 수 없습니다.");
        }

        return prefix + String.format("%03d", lastThree + 1);
    }

    public static int calculateOrder(String sortCode) {
        return Integer.parseInt(sortCode.substring(sortCode.length() - 3));
    }

}
