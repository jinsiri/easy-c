package org.easyc.vacation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.easyc.common.entity.BaseEntity;
import org.easyc.vacation.constant.TransactionType;
import org.easyc.vacation.constant.VacationCategory;

import java.time.LocalDate;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VacationHistory extends BaseEntity {
    @Id
    @SequenceGenerator(name="vacation_history_seq", sequenceName="vacation_history_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="vacation_history_seq")
    private Long vacationId;

    /** 근로자 정보 추가 */
    @Column(name="member_id")
    private Long memberId;

    @Enumerated(EnumType.STRING)
    @Column(name="vacation_category")
    private VacationCategory vacationCategory;

    @Enumerated(EnumType.STRING)
    @Column(name="transaction_type")
    private TransactionType transactionType;

    @Column(name="day")
    private Double day;

    @Column(name = "accrual_date")
    private LocalDate accrualDate;

    @Column(name = "expire_date")
    private LocalDate expireDate;

    @Column(name = "violation_reason")
    private String violationReason;

}
