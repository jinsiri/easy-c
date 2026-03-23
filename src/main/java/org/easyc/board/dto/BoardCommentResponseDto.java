package org.easyc.board.dto;

import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.easyc.board.entity.BoardComment;
import org.easyc.common.dto.BaseDto;

@Getter
@SuperBuilder
public class BoardCommentResponseDto extends BaseDto {

    private Long id;
    private Long postId;
    private String content;

    public static BoardCommentResponseDto fromEntity(BoardComment comment) {
        return BoardCommentResponseDto.builder()
                .id(comment.getCommentId())
                .postId(comment.getPostId())
                .content(comment.getContent())
                // base
                .deleted(comment.isDeleted())
                .active(comment.isActive())
                .registerDate(comment.getRegisterDate())
                .registerIp(comment.getRegisterIp())
                .registerUser(comment.getRegisterUser())
                .lastUpdateDate(comment.getLastUpdateDate())
                .lastUpdateIp(comment.getLastUpdateIp())
                .lastUpdateUser(comment.getLastUpdateUser())
                .build();
    }
}
