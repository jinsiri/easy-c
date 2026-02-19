package org.easyc.jobTitle.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.easyc.jobTitle.dto.JobTitleResponseDto;
import org.easyc.jobTitle.entity.QJobTitle;
import org.easyc.memberJobTitleMap.entity.QMemberJobTitleMap;
import org.springframework.stereotype.Repository;

import java.util.List;

@RequiredArgsConstructor
@Repository
public class JobTitleRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    public List<JobTitleResponseDto> findAllWithMemberCountOrderByLevel() {
        QJobTitle p = QJobTitle.jobTitle;
        QMemberJobTitleMap m = QMemberJobTitleMap.memberJobTitleMap;

        return queryFactory
                .select(Projections.fields(JobTitleResponseDto.class,
                        p.jobTitleId,
                        p.jobTitleNm,
                        p.jobTitleCode,
                        p.jobTitleLevel,
                        m.count().castToNum(Integer.class).as("userCount")
                ))
                .from(p)
                .leftJoin(m).on(p.jobTitleId.eq(m.jobTitleId).and(m.deleted.isFalse()))
                .where(p.deleted.isFalse())
                .groupBy(p.jobTitleId, p.jobTitleNm, p.jobTitleCode, p.jobTitleLevel, p.deleted, p.registerDate)
                .orderBy(p.jobTitleLevel.asc())
                .fetch();
    }
}
