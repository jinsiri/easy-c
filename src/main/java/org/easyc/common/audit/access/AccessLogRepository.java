package org.easyc.common.audit.access;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 접근 로그 레포지토리
 *
 * 현재는 기본 JpaRepository 기능(저장, 페이징 조회)만 사용한다.
 * 추후 IP별 조회, 특정 사용자 접근 이력 조회 등 조건 검색이 필요하면 메서드를 추가한다.
 */
public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {
}
