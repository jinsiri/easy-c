package org.easyc.jobGrade.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.easyc.jobGrade.dto.JobGradeResponseDto;
import org.easyc.jobGrade.entity.QJobGrade;
import org.easyc.memberJobGradeMap.entity.QMemberJobGradeMap;
import org.springframework.stereotype.Repository;

import java.util.List;

@RequiredArgsConstructor
@Repository
public class JobGradeRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    public List<JobGradeResponseDto> findAllWithMemberCountOrderByLevel() {
        QJobGrade p = QJobGrade.jobGrade;
        QMemberJobGradeMap m = QMemberJobGradeMap.memberJobGradeMap;

        return queryFactory
                .select(Projections.fields(JobGradeResponseDto.class,
                        p.jobGradeId,
                        p.jobGradeNm,
                        p.jobGradeCode,
                        p.jobGradeLevel,
                        m.count().castToNum(Integer.class).as("userCount")
                ))
                .from(p)
                .leftJoin(m).on(p.jobGradeId.eq(m.jobGradeId).and(m.deleted.isFalse()))
                .where(p.deleted.isFalse())
                .groupBy(p.jobGradeId, p.jobGradeNm, p.jobGradeCode, p.jobGradeLevel, p.deleted, p.registerDate)
                .orderBy(p.jobGradeLevel.asc())
                .fetch();
    }
}
