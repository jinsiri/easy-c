package org.easyc.common.controller;

import lombok.RequiredArgsConstructor;
import org.easyc.common.dto.EnumOption;
import org.easyc.common.support.EnumOptionMapper;
import org.easyc.member.constant.EmploymentStatus;
import org.easyc.member.constant.Nationality;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/codes")
@RequiredArgsConstructor
public class EnumCodeController {

    private final EnumOptionMapper enumOptionMapper;

    @GetMapping("/member-status")
    public List<EnumOption> memberStatus(Locale locale) {
        return enumOptionMapper.toOptions(
                EmploymentStatus.class,
                "member.status",
                locale
        );
    }

    @GetMapping("/nationality")
    public List<EnumOption> nationality(Locale locale) {
        return enumOptionMapper.toOptions(
                Nationality.class,
                "nationality",
                locale
        );
    }
}
