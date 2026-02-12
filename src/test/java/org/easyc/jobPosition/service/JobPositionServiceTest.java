package org.easyc.jobPosition.service;

import org.easyc.jobPosition.dto.JobPositionRequestDto;
import org.easyc.jobPosition.entity.JobPosition;
import org.easyc.jobPosition.repository.JobPositionRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class JobPositionServiceTest {
    @InjectMocks
    private JobPositionService jobPositionService;

    @Mock
    private JobPositionRepository jobPositionRepository;

    @Test
    @DisplayName("직위 추가 시 기존 최대 레벨 이후부터 순차적으로 레벨이 부여된다")
    void addJobPositions_Success() {
        // given: 기존에 2레벨까지 데이터가 있다고 가정
        given(jobPositionRepository.findMaxLevel()).willReturn(Optional.of(2));

        List<JobPositionRequestDto> requestDtos = List.of(
                JobPositionRequestDto.builder()
                        .jobPositionId(1L)
                        .jobPositionNm("사장")
                        .jobPositionCode("P001")
                        .build(),
                JobPositionRequestDto.builder()
                        .jobPositionId(2L)
                        .jobPositionNm("부사장")
                        .jobPositionCode("P002")
                        .build()
        );

        // when
        jobPositionService.saveList(requestDtos);

        // then: 2레벨 다음인 3, 4레벨로 엔티티가 생성되어 저장되었는지 확인
        ArgumentCaptor<List<JobPosition>> captor = ArgumentCaptor.forClass(List.class);
        verify(jobPositionRepository).saveAll(captor.capture());

        List<JobPosition> savedList = captor.getValue();
        assertEquals(2, savedList.size());
        assertEquals(3, savedList.get(0).getJobPositionLevel()); // 2 + 1
        assertEquals(4, savedList.get(1).getJobPositionLevel()); // 2 + 2
    }
}
