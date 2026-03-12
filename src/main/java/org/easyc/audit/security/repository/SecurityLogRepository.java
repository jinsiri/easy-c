package org.easyc.audit.security.repository;

import org.easyc.audit.security.entity.SecurityLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SecurityLogRepository extends JpaRepository<SecurityLog, Long> {

    List<SecurityLog> findByEventTypeInOrderByRegisterDateDesc(List<String> eventTypes, Pageable pageable);

    List<SecurityLog> findByLoginIdAndEventTypeInOrderByRegisterDateDesc(String loginId, List<String> eventTypes, Pageable pageable);
}
