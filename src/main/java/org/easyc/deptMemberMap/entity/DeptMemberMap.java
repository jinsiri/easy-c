package org.easyc.deptMemberMap.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.easyc.common.entity.BaseEntity;
import org.easyc.dept.entity.Dept;
import org.easyc.deptMemberMap.constant.DeptRole;
import org.easyc.jobTitle.entity.JobTitle;
import org.easyc.member.entity.Member;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@SQLRestriction("deleted = false")
public class DeptMemberMap extends BaseEntity {
    @Id
    @SequenceGenerator(name="dept_member_map_seq", sequenceName="dept_member_map_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="dept_member_map_seq")
    private Long deptMemberMapId;

    @Column(name="dept_id", nullable = false)
    private Long deptId;

    @Column(name="member_id", nullable = false)
    private Long memberId;

    @Column(name="job_title_id")
    private Long jobTitleId;

    @Enumerated(EnumType.STRING)
    private DeptRole deptRole;

    // 주요 부서 여부
    @Column(name="is_primary")
    private boolean isPrimary = false;

    // 읽기 전용 - 부서
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dept_id", insertable = false, updatable = false)
    private Dept dept;

    // 읽기 전용 - 멤버
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", insertable = false, updatable = false)
    private Member member;

    // 읽기 전용 - 직책
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_title_id", insertable = false, updatable = false)
    private JobTitle jobTitle;



    public void delete() {
        super.delete();
    }

    public void updateInfo(Long deptId, Long jobTitleId, DeptRole deptRole, boolean isPrimary) {
        this.deptId = deptId;
        this.jobTitleId = jobTitleId;
        this.deptRole = deptRole;
        this.isPrimary = isPrimary;
    }

    public void updateDeptRole(DeptRole deptRole) {
        this.deptRole = deptRole;
    }
}
