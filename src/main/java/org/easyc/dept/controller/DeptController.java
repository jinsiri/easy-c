package org.easyc.dept.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.dept.dto.DeptRequestDto;
import org.easyc.dept.dto.DeptResponseDto;
import org.easyc.dept.entity.Dept;
import org.easyc.dept.service.DeptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dept")
public class DeptController {
    private final DeptService deptService;

    @GetMapping("/tree")
    public ResponseEntity<List<DeptResponseDto>> getOrgTree() {
        log.info("조직도 트리 조회 요청 시작");

        try {
            List<DeptResponseDto> tree = deptService.getDeptTree();
            log.info("조직도 트리 조회 성공 (루트 노드 수: {})", tree.size());
            return ResponseEntity.ok(tree);
        } catch (Exception e) {
            log.error("조직도 조회 중 오류 발생: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public DeptResponseDto findById(@PathVariable Long id) {
        return deptService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Dept> saveChildDept(@RequestBody DeptRequestDto deptRequestDto) {
        Dept savedDept = deptService.saveChildDept(deptRequestDto);

        return ResponseEntity.ok(savedDept);
    }

    @PutMapping("/{id}")
    public void updateDept(@PathVariable Long id, @RequestBody DeptRequestDto dto) {
        deptService.update(id, dto);
    }

    @DeleteMapping("/{deptId}")
    public ResponseEntity<Void> deleteDept(@PathVariable Long deptId) {
        deptService.softDeleteDept(deptId);

        return ResponseEntity.noContent().build();
    }
}
