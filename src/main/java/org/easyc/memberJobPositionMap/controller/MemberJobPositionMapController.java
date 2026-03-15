package org.easyc.memberJobPositionMap.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.memberJobPositionMap.dto.MemberJobPositionMapRequestDto;
import org.easyc.memberJobPositionMap.service.MemberJobPositionMapService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member-position-map")
public class MemberJobPositionMapController {
    private final MemberJobPositionMapService service;

    @PostMapping("/bulk-update")
    public void changeJobPositionBulk(@RequestBody MemberJobPositionMapRequestDto dto) {
        service.changeJobPositionBulk(dto);
    }
}
