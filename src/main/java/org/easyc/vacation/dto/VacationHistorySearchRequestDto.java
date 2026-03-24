package org.easyc.vacation.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.vacation.constant.TransactionType;
import org.easyc.vacation.entity.Vacation;
import org.easyc.vacation.entity.VacationHistory;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class VacationHistorySearchRequestDto {
    private Long memberId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    private String transactionType;
    private String vacationCategory;
    private String violationReason;

}
