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

    @JsonProperty("scheduleDesc")
    private String scheduleDesc;

    public Schedule toEntity() {
        return Schedule.builder()
                .memberId(this.memberId)
                .scheduleName(this.scheduleName)
                .startDate(this.startDate)
                .startTime(this.startTime)
                .endDate(this.endDate)
                .endTime(this.endTime)
                .published(this.published)
                .scheduleDesc(this.scheduleDesc)
                .build();
    }

}



