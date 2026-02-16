package org.easyc.jobPosition.repository;

import org.springframework.transaction.annotation.Transactional;
import org.easyc.jobPosition.entity.JobPosition;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class JobPositionRepositoryTest {

    @Autowired
    private JobPositionRepository jobPositionRepository;

    @Test
    @DisplayName("정상 데이터 중 가장 높은 레벨을 가져오고, 삭제된 데이터는 무시한다")
    void findMaxLevel_Success() {
        // given
        jobPositionRepository.save(JobPosition.builder().jobPositionNm("1번").jobPositionLevel(1).deleted(false).build());
        jobPositionRepository.save(JobPosition.builder().jobPositionNm("2번").jobPositionLevel(5).deleted(false).build());
        jobPositionRepository.save(JobPosition.builder().jobPositionNm("삭제된거").jobPositionLevel(10).deleted(true).build());

        // when
        Integer maxLevel = jobPositionRepository.findMaxLevel().orElse(0);

        // then
        assertEquals(5, maxLevel); // 삭제된 10이 아니라 5가 나와야 성공
    }

    @Test
    @DisplayName("데이터가 아무것도 없을 때 0을 반환하기 위해 빈 값을 보낸다")
    void findMaxLevel_Empty() {
        // when
        Optional<Integer> maxLevel = jobPositionRepository.findMaxLevel();

        // then
        assertTrue(maxLevel.isEmpty());
    }
}
