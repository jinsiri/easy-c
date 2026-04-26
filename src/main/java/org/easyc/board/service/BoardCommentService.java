package org.easyc.board.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.easyc.board.dto.BoardCommentRequestDto;
import org.easyc.board.dto.BoardCommentResponseDto;
import org.easyc.board.entity.BoardComment;
import org.easyc.board.repository.BoardCommentRepository;
import org.easyc.board.repository.BoardPostRepository;
import org.easyc.common.dto.AuditUser;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Service;

import org.jsoup.Jsoup;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardCommentService {

    private final BoardCommentRepository boardCommentRepository;
    private final BoardPostRepository boardPostRepository;

    public List<BoardCommentResponseDto> findAllByPostId(Long postId) {
        return boardCommentRepository.findAllByPostIdAndDeletedFalseOrderByCommentIdAsc(postId)
                .stream().map(BoardCommentResponseDto::fromEntity).toList();
    }

    @Transactional
    public BoardCommentResponseDto create(Long postId, BoardCommentRequestDto dto) {
        // 게시글 존재 여부 확인
        boardPostRepository.findById(postId)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.BOARD_POST_NOT_FOUND));

        BoardComment comment = BoardComment.builder()
                .postId(postId)
                .content(dto.getContent())
                .build();

        return BoardCommentResponseDto.fromEntity(boardCommentRepository.save(comment));
    }

    @Transactional
    public void delete(Long postId, Long commentId, AuditUser user) {
        BoardComment comment = boardCommentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.BOARD_COMMENT_NOT_FOUND));

        boolean isAdmin = "ROLE_ADMIN".equals(user.getMemberRole());
        boolean isOwner = user.getLoginId().equals(comment.getRegisterUser().getLoginId());
        if (!isAdmin && !isOwner) {
            throw new CustomException(CustomExceptionCode.BOARD_COMMENT_DELETE_DENIED);
        }

        comment.delete();
    }
}
