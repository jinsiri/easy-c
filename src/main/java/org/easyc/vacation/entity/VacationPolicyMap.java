package org.easyc.vacation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.easyc.attendance.entity.AttendancePolicy;
import org.easyc.member.entity.Member;

@Entity
@Builder
@Getter
@Setter
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

    // 읽기 전용 - 멤버
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", insertable = false, updatable = false)
    private Member member;

    // 읽기 전용 - 근태정책
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vacation_policy_id", insertable = false, updatable = false)
    private VacationPolicy vacationPolicy;

}
