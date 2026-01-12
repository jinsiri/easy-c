package org.easyc.dept.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.entity.BaseTreeEntity;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
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
}
