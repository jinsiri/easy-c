package org.easyc.memberJobRoleMap.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.entity.BaseEntity;
import org.easyc.jobRole.entity.JobRole;
import org.easyc.member.entity.Member;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Table(
    name="member_job_role_map",
    indexes = {
            @Index(name = "idx_member_role_map_member", columnList = "member_id, deleted"),
            @Index(name = "idx_member_role_map_role", columnList = "job_role_id, deleted")
    }
)
public class MemberJobRoleMap extends BaseEntity {
    @Id
    @SequenceGenerator(name="member_job_role_map_seq", sequenceName="member_job_role_map_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="member_job_role_map_seq")
    private Long memberJobRoleMapId;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "job_role_id", nullable = false)
    private Long jobRoleId;

    @Builder.Default
    private boolean deleted = false;

    // 읽기 전용 - 멤버
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", insertable = false, updatable = false)
    private Member member;

    // 읽기 전용 - 직위
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_role_id", insertable = false, updatable = false)
    private JobRole jobRole;
}
