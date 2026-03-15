package org.easyc.board.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.board.constant.BoardCategory;
import org.easyc.board.dto.BoardPostRequestDto;
import org.easyc.board.dto.BoardPostResponseDto;
import org.easyc.board.service.BoardPostService;
import org.easyc.common.dto.AuditUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/board/posts")
@RequiredArgsConstructor
public class BoardPostController {

    private final BoardPostService boardPostService;

    @GetMapping
    public List<BoardPostResponseDto> findAll() {
        return boardPostService.findAll();
    }

    @GetMapping("/notice")
    public List<BoardPostResponseDto> findAllNotice() {
        return boardPostService.findAllByCategory(BoardCategory.NOTICE);
    }

    @GetMapping("/general")
    public List<BoardPostResponseDto> findAllGeneral() {
        return boardPostService.findAllByCategory(BoardCategory.GENERAL);
    }

    @GetMapping("/{postId}")
    public BoardPostResponseDto findById(@PathVariable Long postId) {
        return boardPostService.findById(postId);
    }

    @PostMapping
    public BoardPostResponseDto create(
            @RequestBody BoardPostRequestDto dto
    ) {
        return boardPostService.create(dto);
    }

    @PutMapping("/{postId}")
    public BoardPostResponseDto update(
            @PathVariable Long postId,
            @RequestBody BoardPostRequestDto dto
    ) {
        return boardPostService.update(postId, dto);
    }

    @DeleteMapping("/{postId}")
    public void delete(
            @PathVariable Long postId,
            @AuthenticationPrincipal AuditUser user
    ) {
        boardPostService.delete(postId, user);
    }

    @DeleteMapping
    public void deleteAll(
            @RequestBody List<Long> postIds,
            @AuthenticationPrincipal AuditUser user
    ) {
        boardPostService.deleteAll(postIds, user);
    }
}
