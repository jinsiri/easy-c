package org.easyc.memberBundle.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.memberBundle.dto.MemberBundleResponseDto;
import org.easyc.memberBundle.service.MemberBundleService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/member-bundle")
@RequiredArgsConstructor
public class MemberBundleController {
    private final MemberBundleService memberBundleService;

    @GetMapping
    public MemberBundleResponseDto getMemberBundle() {
        return memberBundleService.getMemberBundle();
    }
}
