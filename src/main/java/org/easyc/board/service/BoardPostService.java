package org.easyc.board.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.easyc.board.constant.BoardCategory;
import org.easyc.board.dto.BoardPostRequestDto;
import org.easyc.board.dto.BoardPostResponseDto;
import org.easyc.board.dto.BoardPostSearchCondition;
import org.easyc.board.entity.BoardPost;
import org.easyc.board.repository.BoardPostRepository;
import org.easyc.board.repository.BoardPostRepositoryCustom;
import org.easyc.common.dto.AuditUser;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardPostService {

    private final BoardPostRepository boardPostRepository;
    private final BoardPostRepositoryCustom boardPostRepositoryCustom;

    public List<BoardPostResponseDto> findAll() {
        return boardPostRepository.findAllByDeletedFalseOrderByPostIdDesc()
                .stream()
                .map(BoardPostResponseDto::fromEntity)
                .toList();
    }

    public List<BoardPostResponseDto> findAllByCategory(BoardCategory category) {
        return boardPostRepository.findAllByCategoryAndDeletedFalseOrderByPostIdDesc(category)
                .stream().map(BoardPostResponseDto::fromEntity)
                .toList();
    }

    public Page<BoardPostResponseDto> findAllByCategory(BoardCategory category, BoardPostSearchCondition cond, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        return boardPostRepositoryCustom.search(category, cond, pageable)
                .map(BoardPostResponseDto::fromEntity);
    }

    @Transactional
    public BoardPostResponseDto findById(Long postId) {
        BoardPost post = boardPostRepository.findById(postId)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.BOARD_POST_NOT_FOUND));

        // 삭제된 게시글
        if (post.isDeleted()) {
            throw new CustomException(CustomExceptionCode.BOARD_POST_DELETED);
        }

        // 조회 수 증가
        post.increaseViewCount();

        return BoardPostResponseDto.fromEntity(post);
    }

    @Transactional
    public BoardPostResponseDto create(BoardPostRequestDto dto) {
        BoardPost post = boardPostRepository.save(dto.toEntity());
        return BoardPostResponseDto.fromEntity(post);
    }

    @Transactional
    public BoardPostResponseDto update(Long postId, BoardPostRequestDto dto) {
        BoardPost post = boardPostRepository.findById(postId)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.BOARD_POST_NOT_FOUND));
        post.update(dto.getCategory(), dto.getTitle(), dto.getContent());
        return BoardPostResponseDto.fromEntity(post);
    }

    @Transactional
    public void delete(Long postId, AuditUser user) {
        BoardPost post = boardPostRepository.findById(postId)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.BOARD_POST_NOT_FOUND));
        checkDeletePermission(post, user);
        post.delete();
    }

    @Transactional
    public void deleteAll(List<Long> postIds, AuditUser user) {
        List<BoardPost> posts = boardPostRepository.findAllById(postIds);
        posts.forEach(post -> checkDeletePermission(post, user));
        posts.forEach(BoardPost::delete);
    }

    // 관리자나 작성자만 삭제 가능
    private void checkDeletePermission(BoardPost post, AuditUser user) {
        boolean isAdmin = "ROLE_ADMIN".equals(user.getMemberRole());
        boolean isOwner = user.getLoginId().equals(post.getRegisterUser().getLoginId());
        if (!isAdmin && !isOwner) {
            throw new CustomException(CustomExceptionCode.BOARD_POST_DELETE_DENIED);
        }
    }
}
