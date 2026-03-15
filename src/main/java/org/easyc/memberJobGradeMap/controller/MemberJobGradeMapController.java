package org.easyc.memberJobGradeMap.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.memberJobGradeMap.dto.MemberJobGradeMapRequestDto;
import org.easyc.memberJobGradeMap.service.MemberJobGradeMapService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member-grade-map")
public class MemberJobGradeMapController {
    private final MemberJobGradeMapService service;

    @PostMapping("/bulk-update")
    public void changeJobGradeBulk(@RequestBody MemberJobGradeMapRequestDto dto) {
        service.changeJobGradeBulk(dto);
    }
}
