package org.easyc.board.dto;

import lombok.Getter;
import org.easyc.board.constant.BoardCategory;
import org.easyc.board.entity.BoardPost;

@Getter
public class BoardPostRequestDto {

    private BoardCategory category;
    private String title;
    private String content;

    public BoardPost toEntity() {
        return BoardPost.builder()
                .category(category)
                .title(title)
                .content(content)
                .build();
    }
}
