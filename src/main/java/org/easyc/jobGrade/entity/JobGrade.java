package org.easyc.jobGrade.entity;

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
@Table(name="job_grade")
public class JobGrade extends BaseEntity {
    @Id
    @SequenceGenerator(name="job_grade_seq", sequenceName="job_grade_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="job_grade_seq")
    private Long jobGradeId;

    @Column(name="job_grade_nm")
    private String jobGradeNm;

    @Column(name="job_grade_code")
    private String jobGradeCode;

    @Column(name="job_grade_level")
    private int jobGradeLevel;
}
