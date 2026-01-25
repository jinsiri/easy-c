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
public class MappingAttendancePolicy {
    @Id
    @SequenceGenerator(name="mapping_attendance_policy_seq", sequenceName="mapping_attendance_policy_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="mapping_attendance_policy_seq")
    private Long mappingId;

    @Column(name = "attendance_policy_id")
    private Long attendancePolicyId;

    @Column(name = "member_id")
    private Long memberId;

}
