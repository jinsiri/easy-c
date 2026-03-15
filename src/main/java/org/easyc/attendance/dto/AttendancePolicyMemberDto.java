package org.easyc.attendance.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.querydsl.core.annotations.QueryProjection;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.easyc.attendance.constant.AttendanceType;
import org.easyc.attendance.constant.SettlementPeriod;
import org.easyc.attendance.constant.WorktimeRule;
import org.easyc.attendance.entity.AttendancePolicy;
import org.easyc.attendance.entity.QAttendancePolicy;
import org.easyc.common.dto.AuditUser;
import org.easyc.common.dto.BaseDto;
import org.easyc.member.constant.AccountStatus;
import org.easyc.member.constant.EmploymentStatus;
import org.easyc.member.constant.EmploymentType;
import org.easyc.member.constant.MemberRole;
import org.easyc.member.dto.MemberLightResponseDto;
import org.easyc.member.entity.MemberPersonal;
import org.easyc.member.entity.MemberProfile;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@SuperBuilder
public class AttendancePolicyMemberDto extends MemberLightResponseDto {
    private Long attendancePolicyId;
    private String attendancePolicyName;

    @QueryProjection
    public AttendancePolicyMemberDto(
            Long memberId, String memberNm, String loginId, MemberRole memberRole, AccountStatus accountStatus,
            String employeeId, String email, EmploymentType employmentType, EmploymentStatus employmentStatus,
            String phoneNumber,
            String deptNm, String jobTitle, String jobPosition,
            boolean deleted, boolean active,
            LocalDateTime registerDate, String registerIp, AuditUser registerUser,
            LocalDateTime lastUpdateDate, String lastUpdateIp, AuditUser lastUpdateUser,
            Long attendancePolicyId,
            String attendancePolicyName
    ) {
        super(memberId,memberNm,loginId,memberRole,accountStatus,
                employeeId, email, employmentType, employmentStatus,
                phoneNumber, deptNm, jobTitle, jobPosition,
                deleted, active, registerDate, registerIp, registerUser, lastUpdateDate, lastUpdateIp, lastUpdateUser);
        this.attendancePolicyId = attendancePolicyId;
        this.attendancePolicyName = attendancePolicyName;
    }
}
