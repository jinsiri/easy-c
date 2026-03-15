package org.easyc.board.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.easyc.board.constant.BoardCategory;
import org.easyc.common.entity.BaseEntity;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@SuperBuilder
public class BoardPost extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;

    /** 카테고리 — 추후 board 카테고리 테이블과 매핑 예정 */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private BoardCategory category;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Builder.Default
    @Column(nullable = false)
    private Long viewCount = 0L;

    public void update(BoardCategory category, String title, String content) {
        this.category = category;
        this.title = title;
        this.content = content;
    }

    public void increaseViewCount() {
        this.viewCount++;
    }
}
