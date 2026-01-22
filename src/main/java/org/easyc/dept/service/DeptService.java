package org.easyc.dept.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.easyc.dept.dto.DeptRequestDto;
import org.easyc.dept.dto.DeptResponseDto;
import org.easyc.dept.entity.Dept;
import org.easyc.dept.repository.DeptRepository;
import org.easyc.deptMemberMap.repository.DeptMemberMapRepository;
import org.easyc.member.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.easyc.common.util.treeFunc.calculateOrder;
import static org.easyc.common.util.treeFunc.incrementSortCode;

@Service
@RequiredArgsConstructor
@Transactional
public class DeptService {
    private final DeptRepository deptRepository;
    private final MemberRepository memberRepository;
    private final DeptMemberMapRepository deptMemberMapRepository;

    public List<DeptResponseDto> getDeptTree () {
        List<Dept> depts = deptRepository.findAllByOrderByTreeSortCodeAsc();

//        List<Dept> allDepts = deptRepository.findAllByOrderByTreeSortCodeAsc();
//        List<DeptMemberMap> allDeptMemberMap = deptMemberMapRepository.findAll();
//        Map<String, DeptResponseDto> nodes = new HashMap<>();

        return DeptResponseDto.fromEntityList(depts);
    }

    public Dept addChildDept(DeptRequestDto deptRequestDto) {
        Long parentId = deptRequestDto.getTreeParentId();
        Dept parent = deptRepository.findById(parentId)
                .orElseThrow(() -> new IllegalArgumentException("부모 부서 ID가 유효하지 않습니다: " + parentId));

        String parentCode = parent.getTreeSortCode();
        int childTargetLength = parentCode.length() + 3;

        String maxChildCode = deptRepository.findMaxSortCodeByParent(parentCode, childTargetLength)
                .orElse(null);

        String newSortCode;
        if (maxChildCode == null) {
            newSortCode = parentCode + "001";
        } else {
            newSortCode = incrementSortCode(maxChildCode,"부서");
        }

        Dept newDept = Dept.builder()
                .deptNm(deptRequestDto.getDeptNm())
                .deptShortNm(deptRequestDto.getDeptShortNm())
                .deptCode(deptRequestDto.getDeptCode())
                .deptEmail(deptRequestDto.getDeptEmail())
                .treeLevel(parent.getTreeLevel() + 1)
                .treeSiblingOrder(calculateOrder(newSortCode))
                .treeParentId(parentId)
                .treeChildCount(0)
                .treeSortCode(newSortCode)
                .deleted(false)
                .active(true)
                .registerIp(deptRequestDto.getRegisterIp())
                .registerId(deptRequestDto.getRegisterId())
                .registerNm(deptRequestDto.getRegisterNm())
                .build();

        Dept savedDept = deptRepository.save(newDept);
        parent.addChild();

        return savedDept;
    }

    public void softDeleteDept(Long deptId) {
        // 1. 삭제 대상 조회
        Dept target = deptRepository.findById(deptId)
                .orElseThrow(() -> new IllegalArgumentException("대상 부서가 없습니다."));

        // 2. 부모의 자식 수 감소
        if (target.getTreeParentId() != null) {
            deptRepository.findById(target.getTreeParentId())
                    .ifPresent(Dept::removeChild);
        }

        // 3. 본인 포함 하위 모든 노드 deleted = true 처리
        deptRepository.softDeleteByTreeSortCode(target.getTreeSortCode());
    }
}
