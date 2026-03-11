package org.easyc.jobRole.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.easyc.jobRole.dto.JobRoleResponseDto;
import org.easyc.jobRole.entity.QJobRole;
import org.easyc.memberJobRoleMap.entity.QMemberJobRoleMap;
import org.springframework.stereotype.Repository;

import java.util.List;

@RequiredArgsConstructor
@Repository
public class JobRoleRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    public List<JobRoleResponseDto> findAllWithMemberCountOrderByOrder() {
        QJobRole r = QJobRole.jobRole;
        QMemberJobRoleMap m = QMemberJobRoleMap.memberJobRoleMap;

        return queryFactory
                .select(Projections.fields(JobRoleResponseDto.class,
                        r.jobRoleId,
                        r.jobRoleNm,
                        r.jobRoleCategory,
                        r.jobRoleType,
                        r.jobRoleOrder,
                        m.count().castToNum(Integer.class).as("userCount")
                ))
                .from(r)
                .leftJoin(m).on(r.jobRoleId.eq(m.jobRoleId).and(m.deleted.isFalse()))
                .where(r.deleted.isFalse())
                .groupBy(r.jobRoleId, r.jobRoleNm, r.jobRoleCategory, r.jobRoleType, r.jobRoleOrder, r.deleted, r.registerDate)
                .orderBy(r.jobRoleOrder.asc())
                .fetch();
    }
}
