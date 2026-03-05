package org.easyc.common.audit.activity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
}