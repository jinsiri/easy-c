package org.easyc.deptMemberMap.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.entity.BaseEntity;
import org.easyc.deptMemberMap.constant.DeptRole;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
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
}
