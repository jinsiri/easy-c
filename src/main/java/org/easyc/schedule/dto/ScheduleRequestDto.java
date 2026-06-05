package org.easyc.schedule.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.easyc.board.dto.BoardCommentResponseDto;
import org.easyc.board.entity.BoardComment;
import org.easyc.schedule.constant.ScheduleType;
import org.easyc.schedule.entity.Schedule;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@SuperBuilder
@NoArgsConstructor
public class ScheduleRequestDto {
    @JsonProperty("scheduleId")
    private Long scheduleId;

    @JsonProperty("memberId")
    private Long memberId;

    @JsonProperty("scheduleName")
    @Enumerated(EnumType.STRING)
    private String scheduleName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;

    @JsonProperty("published")
    @Builder.Default
    private boolean published = false;

    @JsonProperty("scheduleType")
    private ScheduleType scheduleType;

    @JsonProperty("scheduleDesc")
    private String scheduleDesc;

    public Schedule toEntity() {
        return Schedule.builder()
                .scheduleId(this.scheduleId)
                .memberId(this.memberId)
                .scheduleName(this.scheduleName)
                .startDate(this.startDate)
                .startTime(this.startTime)
                .endDate(this.endDate)
                .endTime(this.endTime)
                .published(this.published)
                .scheduleType(this.scheduleType)
                .scheduleDesc(this.scheduleDesc)
                .build();
    }

    public Schedule toEntity(String memberNm, String deptNm, String jobGrade) {
        return Schedule.builder()
                .scheduleId(this.scheduleId)
                .memberId(this.memberId)
                .memberNm(memberNm)
                .deptNm(deptNm)
                .jobGrade(jobGrade)
                .scheduleName(this.scheduleName)
                .startDate(this.startDate)
                .startTime(this.startTime)
                .endDate(this.endDate)
                .endTime(this.endTime)
                .published(this.published)
                .scheduleType(this.scheduleType)
                .scheduleDesc(this.scheduleDesc)
                .build();
    }

}



