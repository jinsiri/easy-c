package org.easyc.board.repository;

import org.easyc.board.constant.BoardCategory;
import org.easyc.board.entity.BoardPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardPostRepository extends JpaRepository<BoardPost, Long> {

    List<BoardPost> findAllByDeletedFalseOrderByPostIdDesc();

    List<BoardPost> findAllByCategoryAndDeletedFalseOrderByPostIdDesc(BoardCategory category);

    Page<BoardPost> findAllByCategoryAndDeletedFalse(BoardCategory category, Pageable pageable);
}