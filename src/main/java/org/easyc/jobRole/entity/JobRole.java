package org.easyc.jobRole.entity;

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
@Table(name="job_role")
public class JobRole extends BaseEntity {
    @Id
    @SequenceGenerator(name="job_role_seq", sequenceName="job_role_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="job_role_seq")
    private Long jobRoleId;
    
    @Column(name="job_role_category")
    private String jobRoleCategory;

    @Column(name="job_role_type")
    private String jobRoleType;

    @Column(name="job_role_nm")
    private int jobRoleNm;
}
