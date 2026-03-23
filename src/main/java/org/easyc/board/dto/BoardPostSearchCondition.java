package org.easyc.board.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardPostSearchCondition {

    private String title;
    private String content;
    private String author; // registerUser.memberNm
}
