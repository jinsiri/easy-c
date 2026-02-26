package org.easyc.memberJobPositionMap.entity;

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
    name="member_job_position_map",
    indexes = {
        @Index(name = "idx_member_pos_map_member", columnList = "memberId, deleted"),
        @Index(name = "idx_member_pos_map_pos", columnList = "jobPositionId, deleted")
    }


)
public class MemberJobPositionMap extends BaseEntity {
    @Id
    @SequenceGenerator(name="member_job_position_map_seq", sequenceName="member_job_position_map_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="member_job_position_map_seq")
    private Long memberJobPositionMapId;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private Long jobPositionId;

    @Builder.Default
    private boolean deleted = false;
}
