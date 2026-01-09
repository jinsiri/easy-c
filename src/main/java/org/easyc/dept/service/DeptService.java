package org.easyc.dept.service;

import lombok.RequiredArgsConstructor;
import org.easyc.dept.repository.DeptRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeptService {
    private final DeptRepository deptRepository;
}
