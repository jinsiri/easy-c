package org.easyc.dept.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.audit.activity.annotation.AuditAction;
import org.easyc.dept.dto.DeptRequestDto;
import org.easyc.dept.dto.DeptResponseDto;
import org.easyc.dept.entity.Dept;
import org.easyc.dept.service.DeptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dept")
public class DeptController {
    private final DeptService deptService;

    @GetMapping("/tree")
    public List<?> getOrgTree(@RequestParam boolean includeMembers) {
        List<Object> result = new ArrayList<>();

        if (includeMembers) {
            List<Object> data = deptService.getDeptTreeWithMembers();
            result.addAll(data);
        } else {
            List<DeptResponseDto> data = deptService.getDeptTree();
            result.addAll(data);
        }

        return result;
    }

    @GetMapping("/{id}")
    public DeptResponseDto findById(@PathVariable Long id) {
        return deptService.findById(id);
    }

    @AuditAction(code = "DEPT_CREATE", name = "부서 등록", targetType = "DEPT")
    @PostMapping
    public ResponseEntity<Dept> saveChildDept(@RequestBody DeptRequestDto deptRequestDto) {
        Dept savedDept = deptService.saveChildDept(deptRequestDto);

        return ResponseEntity.ok(savedDept);
    }

    @AuditAction(code = "DEPT_UPDATE", name = "부서 수정", targetType = "DEPT")
    @PutMapping("/{id}")
    public void updateDept(@PathVariable Long id, @RequestBody DeptRequestDto dto) {
        deptService.update(id, dto);
    }

    @AuditAction(code = "DEPT_DELETE", name = "부서 삭제", targetType = "DEPT")
    @DeleteMapping("/{deptId}")
    public ResponseEntity<Void> deleteDept(@PathVariable Long deptId) {
        deptService.softDeleteDept(deptId);

        return ResponseEntity.noContent().build();
    }
}
