package org.easyc.board.dto;

import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.easyc.board.entity.BoardPost;
import org.easyc.common.dto.BaseDto;
import org.easyc.common.dto.EnumOption;
import org.easyc.common.support.EnumOptionMapper;

@Getter
@SuperBuilder
public class BoardPostResponseDto extends BaseDto {

    private Long id;
    private EnumOption category;
    private String title;
    private String content;
    private Long viewCount;

    public static BoardPostResponseDto fromEntity(BoardPost post) {
        return BoardPostResponseDto.builder()
                .id(post.getPostId())
                .category(EnumOptionMapper.toOption(post.getCategory(), "board.category"))
                .title(post.getTitle())
                .content(post.getContent())
                .viewCount(post.getViewCount())
                // base
                .deleted(post.isDeleted())
                .active(post.isActive())
                .registerDate(post.getRegisterDate())
                .registerIp(post.getRegisterIp())
                .registerUser(post.getRegisterUser())
                .lastUpdateDate(post.getLastUpdateDate())
                .lastUpdateIp(post.getLastUpdateIp())
                .lastUpdateUser(post.getLastUpdateUser())
                .build();
    }
}
