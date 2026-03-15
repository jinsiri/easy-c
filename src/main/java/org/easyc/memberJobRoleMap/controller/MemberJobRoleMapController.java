package org.easyc.memberJobRoleMap.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.memberJobRoleMap.dto.MemberJobRoleMapRequestDto;
import org.easyc.memberJobRoleMap.service.MemberJobRoleMapService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member-role-map")
public class MemberJobRoleMapController {
    private final MemberJobRoleMapService service;

    @PostMapping("/bulk-update")
    public void changeJobRoleBulk(@RequestBody MemberJobRoleMapRequestDto dto) {
        service.changeJobRoleBulk(dto);
    }
}
