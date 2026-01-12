package org.easyc.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@MappedSuperclass
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseTreeEntity extends BaseEntity {
    @Column(name="tree_level")
    private int treeLevel;

    @Column(name="tree_sibling_order")
    private int treeSiblingOrder;

    @Column(name="tree_parent_id")
    private Long treeParentId;

    @Column(name="tree_child_count")
    private int treeChildCount;

    @Column(name="tree_sort_code")
    private String treeSortCode;
}
