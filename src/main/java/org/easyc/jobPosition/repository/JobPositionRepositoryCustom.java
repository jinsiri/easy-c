package org.easyc.jobPosition.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.easyc.jobPosition.dto.JobPositionResponseDto;
import org.easyc.jobPosition.entity.QJobPosition;
import org.easyc.memberJobPositionMap.entity.QMemberJobPositionMap;
import org.springframework.stereotype.Repository;

import java.util.List;

@RequiredArgsConstructor
@Repository
public class JobPositionRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    public List<JobPositionResponseDto> findAllWithMemberCountOrderByLevel() {
        QJobPosition p = QJobPosition.jobPosition;
        QMemberJobPositionMap m = QMemberJobPositionMap.memberJobPositionMap;

        return queryFactory
                .select(Projections.fields(JobPositionResponseDto.class,
                        p.jobPositionId,
                        p.jobPositionNm,
                        p.jobPositionCode,
                        p.jobPositionLevel,
                        m.count().castToNum(Integer.class).as("userCount")
                ))
                .from(p)
                .leftJoin(m).on(p.jobPositionId.eq(m.jobPositionId).and(m.deleted.isFalse()))
                .where(p.deleted.isFalse())
                .groupBy(p.jobPositionId, p.jobPositionNm, p.jobPositionCode, p.jobPositionLevel, p.deleted, p.registerDate)
                .orderBy(p.jobPositionLevel.asc())
                .fetch();
    }
}
