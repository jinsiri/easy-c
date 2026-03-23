package org.easyc.board.controller;

import lombok.RequiredArgsConstructor;
import org.easyc.board.dto.BoardCommentRequestDto;
import org.easyc.board.dto.BoardCommentResponseDto;
import org.easyc.board.service.BoardCommentService;
import org.easyc.common.dto.AuditUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board/posts/{postId}/comments")
@RequiredArgsConstructor
public class BoardCommentController {

    private final BoardCommentService boardCommentService;

    @GetMapping
    public List<BoardCommentResponseDto> findAll(@PathVariable Long postId) {
        return boardCommentService.findAllByPostId(postId);
    }

    @PostMapping
    public BoardCommentResponseDto create(
            @PathVariable Long postId,
            @RequestBody BoardCommentRequestDto dto
    ) {
        return boardCommentService.create(postId, dto);
    }

    @DeleteMapping("/{commentId}")
    public void delete(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal AuditUser user
    ) {
        boardCommentService.delete(postId, commentId, user);
    }
}
