package org.easyc.vacation.entity;

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
public class VacationPolicyMap {
    @Id
    @SequenceGenerator(name="vacation_policy_map_seq", sequenceName="vacation_policy_map_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="vacation_policy_map_seq")
    private Long mappingId;

    @Column(name = "vacation_policy_id")
    private Long vacationPolicyId;

    @Column(name = "member_id")
    private Long memberId;

    @Builder.Default
    private boolean deleted = false;

}
