package org.easyc.memberJobGradeMap.entity;

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
    name="member_job_grade_map",
    indexes = {
        @Index(name = "idx_member_job_grade_map_pos_del", columnList = "jobGradeId, deleted")
    }
)
public class MemberJobGradeMap extends BaseEntity {
    @Id
    @SequenceGenerator(name="member_job_grade_map_seq", sequenceName="member_job_grade_map_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="member_job_grade_map_seq")
    private Long memberJobGradeMapId;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private Long jobGradeId;

    @Builder.Default
    private boolean deleted = false;
}
