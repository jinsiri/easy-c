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
import org.easyc.schedule.entity.Schedule;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@SuperBuilder
@NoArgsConstructor
public class ScheduleRequestDto {
    @JsonProperty("memberId")
    private Long memberId;

    @JsonProperty("scheduleName")
    private String scheduleName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate scheduleStartDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime scheduleStartTime;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate scheduleEndDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime scheduleEndTime;

    @JsonProperty("published")
    @Builder.Default
    private boolean published = false;

    @JsonProperty("scheduleDesc")
    private String scheduleDesc;

    public Schedule toEntity() {
        return Schedule.builder()
                .memberId(this.memberId)
                .scheduleName(this.scheduleName)
                .scheduleStartDate(this.scheduleStartDate)
                .scheduleStartTime(this.scheduleStartTime)
                .scheduleEndDate(this.scheduleEndDate)
                .scheduleEndTime(this.scheduleEndTime)
                .published(this.published)
                .scheduleDesc(this.scheduleDesc)
                .build();
    }

}



