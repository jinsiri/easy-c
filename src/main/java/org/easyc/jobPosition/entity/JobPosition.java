package org.easyc.jobPosition.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.entity.BaseEntity;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Table(name="job_position")
@SQLRestriction("deleted = false")
public class JobPosition extends BaseEntity {
    @Id
    @SequenceGenerator(name="job_position_seq", sequenceName="job_position_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="job_position_seq")
    private Long jobPositionId;

    @Column(name="job_position_nm")
    private String jobPositionNm;

    @Column(name="job_position_code")
    private String jobPositionCode;

    @Column(name="job_position_level")
    private int jobPositionLevel;

    public void updateInfo(String nm, String code) {
        if (nm != null && !nm.isBlank()) this.jobPositionNm = nm;
        if (code != null && !code.isBlank()) this.jobPositionCode = code;
    }

    public void delete() {
        super.delete();
    }

    public void changeLevel(Integer newLevel) {
        if (newLevel == null || newLevel < 1) {
            throw new IllegalArgumentException("유효하지 않은 레벨입니다.");
        }
        this.jobPositionLevel = newLevel;
    }
}
