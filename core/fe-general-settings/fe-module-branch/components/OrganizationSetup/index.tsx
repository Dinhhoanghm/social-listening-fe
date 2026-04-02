"use client";
import React, { memo, useEffect, useState } from "react";
import OrganizationTree from "../OrganizationTree";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import { Button, Card, Flex, Space, Spin } from "antd";
import {
  ContainerTwoTone,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { useLazyGetOrgTreeQuery } from "../../apis";
import CreateModal from "../CreateModal";
import EditModal from "../EditModal";
import DeleteModal from "../DeleteModal";
import BranchCard from "../BranchCard";
import { CreateBranch, EditBranch } from "../../constants/type";
import { CREATE_DATA } from "../../constants/data";
import AEmpty from "@/fe-component/AEmpty";
import { usePathname } from "next/navigation";
import { useHookPermissions } from "@/fe-module-rbac/hooks/usePermission";

const getIconFromDepth = (depth) => {
  return (
    <ContainerTwoTone
      twoToneColor={["white", "white"]}
      style={{ fontSize: "32px" }}
    />
  );
};

const convertBranchesToItems = (items, depth = 1, menu) => {
  if (isArray(items)) {
    return items.map((item) => {
      return {
        title: BranchCard(
          `${item?.name} (${item?.code})`,
          getIconFromDepth(depth),
          depth - 1,
          menu,
          item
        ),
        key: item?.id,
        children: convertBranchesToItems(item?.children, depth + 1, menu),
      };
    });
  }
  return [];
};

const OrganizationSetup = () => {
  const [rowData, setRowData] = useState<CreateBranch | EditBranch>(
    CREATE_DATA
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [getOrgTreeApi, { data, isLoading }] = useLazyGetOrgTreeQuery();

  useEffect(() => {
    getOrgTreeApi(null);
  }, []);

  const onRefresh = () => getOrgTreeApi(null);

  const path = usePathname();
  const userPermissions = useHookPermissions(path);

  const menu = [
    {
      key: "Add",
      label: "Thêm mới",
      icon: <PlusOutlined />,
      visible: (data) =>
        (data?.isActive === undefined || data?.isActive) &&
        userPermissions?.create,
      onClick: ({ data: row }) => {
        setRowData({ parentId: row.id });
        setIsCreateModalOpen(true);
      },
    },
    {
      key: "Update",
      label: "Chỉnh sửa",
      icon: <EditOutlined />,
      visible: () => userPermissions?.edit,
      onClick: ({ data: row }) => {
        setRowData(row);
        setIsEditModalOpen(true);
      },
    },
    {
      key: "Delete",
      label: "Xóa",
      icon: <DeleteOutlined />,
      visible: () => userPermissions?.delete,
      onClick: ({ data: row }) => {
        setRowData(row);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  if (isEmpty(data) && !isLoading) {
    return (
      <Card>
        <AEmpty />
      </Card>
    );
  }

  return (
    <Spin spinning={isLoading}>
      <Card>
        <Flex justify="end" style={{ width: "100%" }}>
          <Space size={8}>
            {userPermissions?.create && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setRowData(null);
                  setIsCreateModalOpen(true);
                }}
              >
                Thêm mới
              </Button>
            )}
          </Space>
        </Flex>
        <OrganizationTree
          root={BranchCard(
            `${data?.org?.name || ""} (${data?.org?.code || ""})`,
            getIconFromDepth(1),
            0,
            [],
            data?.org || {}
          )}
          items={convertBranchesToItems(data?.branches || [], 1, menu)}
        />
      </Card>
      {isCreateModalOpen && (
        <CreateModal
          initialValues={rowData}
          open={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
          }}
          onRefresh={onRefresh}
        />
      )}
      {isEditModalOpen && (
        <EditModal
          initialValues={rowData}
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
          }}
          onRefresh={onRefresh}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          data={rowData}
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onRefresh={onRefresh}
        />
      )}
    </Spin>
  );
};

export default memo(OrganizationSetup);
