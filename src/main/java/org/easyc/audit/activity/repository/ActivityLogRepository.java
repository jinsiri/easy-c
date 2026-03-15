package org.easyc.audit.activity.repository;

import org.easyc.audit.activity.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
}