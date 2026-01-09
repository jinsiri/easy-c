package org.easyc.dept.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Dept {
    @Id
    @SequenceGenerator(name="dept_seq", sequenceName="dept_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="dept_seq")
    private Long deptId;

}
