import React, { memo, useState } from "react";
import moment from "moment";

// Components
import { Card, Tag } from "antd";
import HeaderOperation from "@/fe-component/ATable/HeaderOperation";
import ATable from "@/fe-component/ATable";
import TableActions, {
  useTableActionModals,
} from "@/fe-component/ATable/TableActions";
import {
  useHookFilter,
  useHookTable,
  useTableScroll,
} from "@/fe-cores/common/table";
import CreateModal from "../CreateModal";
import EditModal from "../EditModal";
import DeleteModal from "../DeleteModal";

// Apis
import { useMultiDeleteRoleMutation, useSearchRbacsMutation } from "../../apis";

// Constants
import { Rbac, User } from "../../constants/type";
import config from "./config.json";
import { usePathname } from "next/navigation";
import { useHookPermissions } from "../../hooks/usePermission";
import AMultiDeleteModal from "@/fe-component/ATable/AMultiDeleteModal";

const RBACTable = () => {
  const {
    item,
    isView,
    isEdit,
    isDelete,
    onCancelModal,
    handleView,
    handleEdit,
    handleDelete,
  } = useTableActionModals();
  const [sorts, setSorts] = useState([]);
  const { filters, updateFilter } = useHookFilter();
  const { scrollConfig } = useTableScroll({
    size: "middle",
    isHeaderOperaiton: true,
    scrollX: 1560,
  });

  const path = usePathname();
  const userPermissions = useHookPermissions(path);

  const {
    tableProps,
    refreshTable,
    rowSelection,
    checkedRowKeys,
    setCheckedRowKeys,
  } = useHookTable({
    useSearchMutation: useSearchRbacsMutation,
    bodyApi: { ...filters, sorts }, // Sử dụng filters đã lọc bỏ giá trị rỗng
    updateSearchBody: updateFilter, // Hook xử lý cập nhật filters
    columns: [
      {
        title: "Mã quyền",
        dataIndex: "code",
        width: 160,
      },
      {
        title: "Tên quyền truy cập",
        dataIndex: "name",
        width: 250,
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        width: 250,
      },
      {
        title: "Hoạt động",
        dataIndex: "active",
        key: "active",
        width: 200,
        align: "center",
        render: (_: any, record: Rbac) => {
          return (
            <>
              {record?.isActive ? (
                <Tag color="success">ĐANG HOẠT ĐỘNG</Tag>
              ) : (
                <Tag color="error">DỪNG HOẠT ĐỘNG</Tag>
              )}
            </>
          );
        },
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        align: "center",
        render: (createdAt: number) =>
          createdAt ? moment(createdAt).format("HH:mm DD/MM/YY") : "",
        width: 160,
      },
      {
        title: "Tạo bởi",
        dataIndex: "creator",
        editable: true,
        render: (creator: User) => creator?.username,
        width: 200,
      },
      {
        title: "Lần sửa cuối",
        dataIndex: "updatedAt",
        align: "center",
        render: (updatedAt: number) =>
          updatedAt ? moment(updatedAt).format("HH:mm DD/MM/YY") : "",
        width: 160,
      },
      {
        title: "Người sửa",
        dataIndex: "updater",
        render: (updater: User) => updater?.username,
        width: 200,
      },
      {
        title: "Xử lý",
        dataIndex: "operation",
        align: "center",
        fixed: "right",
        width: 120,
        render: (_: any, record: Rbac) => (
          <TableActions
            record={record}
            permissions={userPermissions}
            actions={[
              {
                key: "view",
                label: "Xem",
                type: "view",
                onClick: handleView,
                pin: true,
              },
              {
                key: "edit",
                label: "Sửa",
                type: "edit",
                onClick: handleEdit,
                pin: true,
              },
              {
                key: "delete",
                label: "Xóa",
                danger: true,
                type: "delete",
                onClick: handleDelete,
                pin: true,
              },
            ]}
            dropdownTrigger={["hover"]}
          />
        ),
      },
    ],
  });

  return (
    <Card
      title={
        <HeaderOperation
          onApply={updateFilter}
          onSorts={setSorts}
          data={config}
          add={userPermissions.create && <CreateModal refresh={refreshTable} />}
          deleteAll={
            checkedRowKeys.length > 0 ? (
              <AMultiDeleteModal
                title="Xóa phân quyền"
                name="phân quyền"
                itemIds={checkedRowKeys}
                setCheckedRowKeys={setCheckedRowKeys}
                refresh={refreshTable}
                useMutationHook={useMultiDeleteRoleMutation}
              />
            ) : null
          }
        />
      }
    >
      <ATable
        {...tableProps}
        rowKey={"id"}
        size="middle"
        rowSelection={rowSelection}
        scroll={scrollConfig}
      />
      {(isEdit || isView) && (
        <EditModal
          data={item}
          open={isEdit || isView}
          onCancelModal={onCancelModal}
          refresh={refreshTable}
          disabled={isView}
        />
      )}
      {isDelete && (
        <DeleteModal
          data={item}
          open={isDelete}
          onCancelModal={onCancelModal}
          refresh={refreshTable}
        />
      )}
    </Card>
  );
};

export default memo(RBACTable);
