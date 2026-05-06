package org.easyc.schedule.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.common.entity.BaseEntity;
import org.easyc.schedule.constant.ScheduleType;
import org.easyc.schedule.dto.ScheduleRequestDto;

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
    private Long scheduleId;

    /** 근로자 정보 추가 */
    @Column(name="member_id")
    private Long memberId;

    @Column(name="member_nm")
    private String memberNm;

    @Column(name ="dept_nm")
    private String deptNm;

    @Column(name = "job_grade")
    private String jobGrade;


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

    @Enumerated(EnumType.STRING)
    @Column(name="schedule_type")
    private ScheduleType scheduleType;

    @Builder.Default
    @Column(name = "published")
    private boolean published = false;

    @Column(name = "schedule_desc")
    private String scheduleDesc;


    public void updateEntityFromDto(ScheduleRequestDto dto, String memberNm, String deptNm, String jobGrade) {
        this.memberId = dto.getMemberId();
        this.scheduleName = dto.getScheduleName();
        this.startDate = dto.getStartDate();
        this.startTime = dto.getStartTime();
        this.endDate = dto.getEndDate();
        this.endTime = dto.getEndTime();
        this.scheduleType = dto.getScheduleType();
        this.published = dto.isPublished();
        this.scheduleDesc = dto.getScheduleDesc();

        if(memberNm != null) { this.memberNm = memberNm; }
        if(deptNm != null) { this.deptNm = deptNm; }
        if(jobGrade != null) { this.jobGrade = jobGrade; }
    }

}
