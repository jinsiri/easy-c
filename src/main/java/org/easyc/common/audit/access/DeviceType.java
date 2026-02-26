package org.easyc.common.audit.access;

/**
 * 접근 기기 유형
 *
 * User-Agent 기반으로 간단하게 분류한다.
 * AccessLogInterceptor.resolveDeviceType()에서 name()으로 저장되고,
 * 한국어 라벨은 messages_ko.properties(device.type.*)에서 관리한다.
 */
public enum DeviceType {
    MOBILE, DESKTOP, UNKNOWN
}
