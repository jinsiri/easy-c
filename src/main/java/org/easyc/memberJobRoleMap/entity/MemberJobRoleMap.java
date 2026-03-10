package org.easyc.memberJobRoleMap.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.entity.BaseEntity;

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
        @Index(name = "idx_member_job_role_map_del", columnList = "jobRoleId, deleted")
    }
)
public class MemberJobRoleMap extends BaseEntity {
    @Id
    @SequenceGenerator(name="member_job_role_map_seq", sequenceName="member_job_role_map_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="member_job_role_map_seq")
    private Long memberJobRoleMapId;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private Long jobRoleId;

    @Builder.Default
    private boolean deleted = false;
}
