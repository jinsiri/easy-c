package org.easyc.audit.security.repository;

import org.easyc.audit.security.entity.SecurityLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SecurityLogRepository extends JpaRepository<SecurityLog, Long> {
}
