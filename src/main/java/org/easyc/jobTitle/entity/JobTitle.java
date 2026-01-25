package org.easyc.jobTitle.entity;

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
@Table(name="job_title")
public class JobTitle extends BaseEntity {
    @Id
    @SequenceGenerator(name="job_title_seq", sequenceName="job_title_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="job_title_seq")
    private Long jobTitleId;

    @Column(name="job_title_nm")
    private String jobTitleNm;

    @Column(name="job_title_code")
    private String jobTitleCode;

    @Column(name="job_title_level")
    private int jobTitleLevel;
}
