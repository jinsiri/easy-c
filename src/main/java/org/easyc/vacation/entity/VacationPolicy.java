package org.easyc.vacation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.easyc.common.entity.BaseEntity;
import org.easyc.vacation.constant.VacationPolicyType;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VacationPolicy extends BaseEntity {
    @Id
    @SequenceGenerator(name="vacation_policy_seq", sequenceName="vacation_policy_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="vacation_policy_seq")
    private Long vacationPolicyId;

    @Column(name = "vacation_policy_name")
    private String vacationPolicyName;

    @Column(name = "vacation_policy_desc")
    private String vacationPolicyDesc;

    @Enumerated(EnumType.STRING)
    @Column(name="vacation_policy_type")
    private VacationPolicyType vacationPolicyType;

    @Column(name = "vacation_policy_unit")
    private String vacationPolicyUnit;

    @Column(name="annual_leave_expired", columnDefinition = "boolean default true")
    @Builder.Default
    private boolean annualLeaveExpiredremoted = true;

    @Column(name="month_leave_expired", columnDefinition = "boolean default true")
    @Builder.Default
    private boolean monthLeaveExpired = true;

    @Column(name="next_year_leave_used", columnDefinition = "boolean default true")
    @Builder.Default
    private boolean nextYearLeaveUsed = true;

}
