package org.easyc.schedule.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.entity.BaseEntity;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Schedule extends BaseEntity {
    @Id
    @SequenceGenerator(name="schedule_seq", sequenceName="schedule_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="schedule_seq")
    private Long schedule_id;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "schedule_name")
    private String scheduleName;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Builder.Default
    @Column(name = "published")
    private boolean published = false;

    @Column(name = "schedule_desc")
    private String scheduleDesc;

}
