package org.easyc.dept.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.entity.BaseTreeEntity;
import org.easyc.dept.dto.DeptRequestDto;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@DynamicUpdate
@SQLRestriction("deleted = false")
public class Dept extends BaseTreeEntity {
    @Id
    @SequenceGenerator(name="dept_seq", sequenceName="dept_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="dept_seq")
    private Long deptId;

    @Column(name="dept_nm", length = 100, nullable = false)
    private String deptNm;

    @Column(name="dept_short_nm", length = 50)
    private String deptShortNm;

    @Column(name="dept_code", length = 20)
    private String deptCode;

    @Column(name="dept_email", length = 150)
    private String deptEmail;

    public void addChild() {
        this.treeChildCount++;
    }

    public void updateInfo(DeptRequestDto dto) {
        if (dto.getDeptNm() != null && !dto.getDeptNm().isBlank()) this.deptNm = dto.getDeptNm();
        if (dto.getDeptShortNm() != null && !dto.getDeptShortNm().isBlank()) this.deptShortNm = dto.getDeptShortNm();
        if (dto.getDeptCode() != null && !dto.getDeptCode().isBlank()) this.deptCode = dto.getDeptCode();
        if (dto.getDeptEmail() != null && !dto.getDeptEmail().isBlank()) this.deptEmail = dto.getDeptEmail();
    }

    public void removeChild() {
        if (this.treeChildCount > 0) this.treeChildCount--;
    }
}
