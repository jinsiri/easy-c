package org.easyc.common.constant;

public enum SettlementPeriod {
    WEEK,
    WEEK_2,
    MONTH,
    MONTH_2,
    MONTH_3;

    public Integer getWeekNumber() {
        switch (this) {
            case WEEK:  return 1;
            case WEEK_2: return 2;
            case MONTH: return 4;
            case MONTH_2: return  8;
            default: return 12;
        }
    }

    public Integer getBaseMinute() {
        Integer baseMinutes = 40 * 60;  // 주 단위 40시간

        switch (this) {
            case WEEK:  return baseMinutes;
            case WEEK_2: return baseMinutes * 2;
            case MONTH: return baseMinutes * 4;
            case MONTH_2: return baseMinutes * 8;
            default: return baseMinutes * 12;
        }
    }

    public Integer getMaxMinute() {
        Integer baseMinutes = 52 * 60;  // 주 단위 40시간

        switch (this) {
            case WEEK:  return baseMinutes;
            case WEEK_2: return baseMinutes * 2;
            case MONTH: return baseMinutes * 4;
            case MONTH_2: return baseMinutes * 8;
            default: return baseMinutes * 12;
        }
    }
}

