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

    @Column(name = "schedule_start_date")
    private LocalDate scheduleStartDate;

    @Column(name = "schedule_start_time")
    private LocalTime scheduleStartTime;

    @Column(name = "schedule_end_date")
    private LocalDate scheduleEndDate;

    @Column(name = "schedule_end_time")
    private LocalTime scheduleEndTime;

    @Builder.Default
    @Column(name = "published")
    private boolean published = false;

    @Column(name = "schedule_desc")
    private String scheduleDesc;

}
