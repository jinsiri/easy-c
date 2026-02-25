package org.easyc.jobTitle.entity;

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
@Table(name="job_title")
@SQLRestriction("deleted = false")
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

    public void updateInfo(String nm, String code) {
        if (nm != null && !nm.isBlank()) this.jobTitleNm = nm;
        if (code != null && !code.isBlank()) this.jobTitleCode = code;
    }

    public void delete() {
        super.delete();
    }

    public void changeLevel(Integer newLevel) {
        if (newLevel == null || newLevel < 1) {
            throw new IllegalArgumentException("유효하지 않은 레벨입니다.");
        }
        this.jobTitleLevel = newLevel;
    }
}
