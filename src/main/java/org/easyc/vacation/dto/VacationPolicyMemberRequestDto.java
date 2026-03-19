package org.easyc.vacation.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class VacationPolicyMemberRequestDto {
    private Long policyId;
    private List<Long> memberIdList;
}
