package org.easyc.memberJobPositionMap.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.entity.BaseEntity;
import org.easyc.jobPosition.entity.JobPosition;
import org.easyc.member.entity.Member;

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
        @Index(name = "idx_member_pos_map_member", columnList = "member_id, deleted"),
        @Index(name = "idx_member_pos_map_pos", columnList = "job_position_id, deleted")
    }
)
public class MemberJobPositionMap extends BaseEntity {
    @Id
    @SequenceGenerator(name="member_job_position_map_seq", sequenceName="member_job_position_map_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="member_job_position_map_seq")
    private Long memberJobPositionMapId;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "job_position_id", nullable = false)
    private Long jobPositionId;

    @Builder.Default
    private boolean deleted = false;

    // 읽기 전용 - 멤버
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", insertable = false, updatable = false)
    private Member member;

    // 읽기 전용 - 직위
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_position_id", insertable = false, updatable = false)
    private JobPosition jobPosition;
}
