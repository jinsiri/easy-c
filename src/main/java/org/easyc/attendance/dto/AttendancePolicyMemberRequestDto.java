package org.easyc.attendance.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.AuditUser;
import org.easyc.member.constant.AccountStatus;
import org.easyc.member.constant.EmploymentStatus;
import org.easyc.member.constant.EmploymentType;
import org.easyc.member.constant.MemberRole;
import org.easyc.member.dto.MemberLightResponseDto;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class AttendancePolicyMemberRequestDto {
    private Long policyId;
    private List<Long> memberIdList;
}
