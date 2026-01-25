package org.easyc.dept.service;

import lombok.RequiredArgsConstructor;
import org.easyc.dept.dto.DeptResponseDto;
import org.easyc.dept.entity.Dept;
import org.easyc.dept.repository.DeptRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeptService {
    private final DeptRepository deptRepository;

    public List<DeptResponseDto> getDeptTree () {
        List<Dept> depts = deptRepository.findAll();

        return DeptResponseDto.fromEntityList(depts);
    }
}
