package org.easyc.board.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.easyc.board.constant.BoardCategory;
import org.easyc.board.dto.BoardPostSearchCondition;
import org.easyc.board.entity.BoardPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;

import static org.easyc.board.entity.QBoardPost.boardPost;

@Repository
@RequiredArgsConstructor
public class BoardPostRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public Page<BoardPost> search(BoardCategory category, BoardPostSearchCondition cond, Pageable pageable) {
        List<BoardPost> content = queryFactory
                .selectFrom(boardPost)
                .where(
                        boardPost.category.eq(category),
                        boardPost.deleted.isFalse(),
                        titleContains(cond.getTitle()),
                        contentContains(cond.getContent()),
                        authorContains(cond.getAuthor())
                )
                .orderBy(boardPost.postId.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(boardPost.count())
                .from(boardPost)
                .where(
                        boardPost.category.eq(category),
                        boardPost.deleted.isFalse(),
                        titleContains(cond.getTitle()),
                        contentContains(cond.getContent()),
                        authorContains(cond.getAuthor())
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    private BooleanExpression titleContains(String title) {
        return StringUtils.hasText(title) ? boardPost.title.containsIgnoreCase(title) : null;
    }

    private BooleanExpression contentContains(String content) {
        return StringUtils.hasText(content) ? boardPost.content.containsIgnoreCase(content) : null;
    }

    private BooleanExpression authorContains(String author) {
        return StringUtils.hasText(author) ? boardPost.registerUser.memberNm.containsIgnoreCase(author) : null;
    }
}
