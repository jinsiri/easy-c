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
    protected int treeLevel;

    @Column(name="tree_sibling_order")
    protected int treeSiblingOrder;

    @Column(name="tree_parent_id")
    protected Long treeParentId;

    @Column(name="tree_child_count")
    protected int treeChildCount;

    @Column(name="tree_sort_code")
    protected String treeSortCode;
}
