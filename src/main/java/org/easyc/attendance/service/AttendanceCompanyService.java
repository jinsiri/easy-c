package org.easyc.attendance.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.*;
import org.easyc.attendance.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class AttendanceCompanyService {

    private final AttendanceRepositoryCustom attendanceRepositoryCustom;

public List<AttendanceDayResponseDto> getAttendanceCompanySearch(AttendanceCompanySearchRequestDto request, Pageable pageable) {
    Page<AttendanceDayResponseDto> searchList = attendanceRepositoryCustom.search(request, pageable);
    return searchList.getContent();
}

public AttendanceCompanySearchResponseDto getAttendanceCompanySearchStatic(AttendanceCompanySearchRequestDto request, Pageable pageable){
    return attendanceRepositoryCustom.searchStatic(request, pageable);
}


}
