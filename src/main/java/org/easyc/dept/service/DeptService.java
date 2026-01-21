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

@Service
@RequiredArgsConstructor
@Transactional
public class DeptService {
    private final DeptRepository deptRepository;
    private final MemberRepository memberRepository;
    private final DeptMemberMapRepository deptMemberMapRepository;

    public List<DeptResponseDto> getDeptTree () {
        List<Dept> depts = deptRepository.findAll();

//        List<Dept> allDepts = deptRepository.findAllByOrderByTreeSortCodeAsc();
//        List<DeptMemberMap> allDeptMemberMap = deptMemberMapRepository.findAll();
//        Map<String, DeptResponseDto> nodes = new HashMap<>();

        return DeptResponseDto.fromEntityList(depts);
    }

    public Dept addChildDept(DeptRequestDto deptRequestDto) {
        // 1. 부모 데이터 조회
        Long parentId = deptRequestDto.getTreeParentId();
        Dept parent = deptRepository.findById(parentId)
                .orElseThrow(() -> new IllegalArgumentException("부모 부서 ID가 유효하지 않습니다: " + parentId));

        String parentCode = parent.getTreeSortCode();
        int childTargetLength = parentCode.length() + 3;

        // 2. 부모 바로 아래 레벨의 마지막 자식 코드 조회
        String maxChildCode = deptRepository.findMaxSortCodeByParent(parentCode, childTargetLength)
                .orElse(null);

        String newSortCode;
        if (maxChildCode == null) {
            newSortCode = parentCode + "001";
        } else {
            newSortCode = incrementSortCode(maxChildCode);
        }

        // 3. Entity 생성 및 저장
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

        // 4. 먼저 저장 (DB에 새로운 자식이 들어가야 COUNT가 맞음)
        Dept savedDept = deptRepository.save(newDept);

        // 5. 부모의 자식 수 동기화
        parent.addChild();

        return savedDept;
    }

    private String incrementSortCode(String maxCode) {
        String prefix = maxCode.substring(0, maxCode.length() - 3);
        int lastThree = Integer.parseInt(maxCode.substring(maxCode.length() - 3));

        if (lastThree >= 999) {
            throw new IllegalStateException("한 레벨에 999개 이상의 부서를 생성할 수 없습니다.");
        }

        return prefix + String.format("%03d", lastThree + 1);
    }

    private int calculateOrder(String sortCode) {
        return Integer.parseInt(sortCode.substring(sortCode.length() - 3));
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
