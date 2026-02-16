package org.easyc.attendance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AttendancePolicyMap {
    @Id
    @SequenceGenerator(name="attendance_policy_map_seq", sequenceName="attendance_policy_map_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="attendance_policy_map_seq")
    private Long mappingId;

    @Column(name = "attendance_policy_id")
    private Long attendancePolicyId;

    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "login_id")
    private String loginId;

    @Builder.Default
    private boolean deleted = false;

}
