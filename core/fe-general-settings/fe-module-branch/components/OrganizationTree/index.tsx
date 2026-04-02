// @ts-nocheck
import { Button, Flex, Tree } from "antd";

import "./index.local.scss";
import classNames from "classnames";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import { UpOutlined } from "@ant-design/icons";
import { CircleIcon } from "./icon/circle-icon";

const TreeNode = Tree.TreeNode;

const renderTreeData = (
  items,
  depth = 0,
  leafs = [],
  isFatherLastNode = false
) => {
  if (isArray(items)) {
    return items
      .map((item, index, arr) => {
        const listClass = [item?.className];
        const newLeafs = isFatherLastNode
          ? [...leafs, `indent-${depth - 1}-hidden`]
          : leafs;
        return (
          <TreeNode
            className={`${classNames(
              ...listClass.concat(newLeafs)
            )} depth-${depth}`}
            title={item?.title}
            icon={<CircleIcon />}
            key={item?.key}
            style={{ paddingLeft: 28 * depth }}
          >
            {isEmpty(item?.children)
              ? null
              : renderTreeData(
                  item?.children,
                  depth + 1,
                  newLeafs,
                  index === arr?.length - 1
                )}
          </TreeNode>
        );
      })
      .filter((f) => !!f);
  }
  return null;
};

const OrganizationTree = ({
  className = "",
  root,
  items,
  widthTreeItem = 450,
}) => {
  return (
    <div className={`${className} organization-tree`}>
      <Flex
        align="center"
        justify="center"
        className={"organization"}
        style={{
          width: widthTreeItem * (items?.length - 1 || 1) + 10,
        }}
      >
        {root}
        <span className={"organization-tree-indent"}>
          {items.map((_, index) => (
            <span
              key={`tree-indent-unit-${index}`}
              className={"organization-tree-indent-unit"}
            ></span>
          ))}
        </span>
      </Flex>
      <Flex style={{ paddingLeft: "36px" }}>
        {items.map((item, index, arr) => (
          <Tree
            key={`key-child-${index}`}
            className="custom-tree"
            showLine
            showIcon
            defaultExpandAll
            switcherIcon={
              <Button type="primary" size={"small"} icon={<UpOutlined />} />
            }
          >
            <TreeNode
              className={item?.className}
              title={item?.title}
              icon={<CircleIcon />}
              key={item?.key}
            >
              {isEmpty(item?.children)
                ? null
                : renderTreeData(
                    item?.children,
                    1,
                    [],
                    index === arr.length - 1
                  )}
            </TreeNode>
          </Tree>
        ))}
      </Flex>
    </div>
  );
};

export default OrganizationTree;
