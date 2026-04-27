package org.easyc.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import org.easyc.dept.entity.Dept;
import org.easyc.member.entity.Member;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Builder
@Getter
@Setter
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

    @Column(name = "apply_start")
    private LocalDate applyStart;

    @Column(name = "apply_end")
    private LocalDate applyEnd;

    @Column(name="actived")
    @Builder.Default
    private boolean actived = false;

    // 읽기 전용 - 멤버
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", insertable = false, updatable = false)
    private Member member;

    // 읽기 전용 - 근태정책
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attendance_policy_id", insertable = false, updatable = false)
    private AttendancePolicy attendancePolicy;

    // 초기 정책 연결 메서드
    public void create(Long memberId) {
        this.attendancePolicyId = 1L;
        this.memberId = memberId;
        this.applyStart = LocalDate.now();
        this.actived = true;
    }

    // 정책 종료 메서드
    public void deactivate() {
        this.applyEnd = LocalDate.now();
        this.actived = false;
    }

}
