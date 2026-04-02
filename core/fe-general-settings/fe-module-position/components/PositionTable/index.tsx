import React, { memo, useState } from "react";
import { Card, Tag, Typography } from "antd";
import moment from "moment";

// Components
import DeleteModal from "../DeleteModal";
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
import { useHookPermissions } from "@/fe-module-rbac/hooks/usePermission";

// Apis
import {
  useSearchPositionMutation,
  useMultiDeletePositionMutation,
} from "../../apis";

// Constants
import { Position } from "../../constants/type";
import config from "./config.json";
import { usePathname } from "next/navigation";
import AMultiDeleteModal from "@/fe-component/ATable/AMultiDeleteModal";

const { Text } = Typography;

function PositionTable() {
  const { item, isEdit, isDelete, onCancelModal, handleEdit, handleDelete } =
    useTableActionModals();

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
    useSearchMutation: useSearchPositionMutation,
    bodyApi: { ...filters, sorts }, // Sử dụng filters đã lọc bỏ giá trị rỗng
    updateSearchBody: updateFilter, // Hook xử lý cập nhật filters
    columns: [
      {
        title: "Mã chức vụ",
        dataIndex: "code",
        width: 140,
      },
      {
        title: "Tên chức vụ",
        dataIndex: "name",
        width: 250,
      },
      {
        title: "Hoạt động",
        dataIndex: "active",
        key: "active",
        width: 180,
        align: "center",
        render: (_, record: Position) => {
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
        render: (_, record) => {
          return (
            <Text>{moment(record?.createdAt).format("HH:mm DD/MM/YY")}</Text>
          );
        },
      },
      {
        title: "Tạo bởi",
        dataIndex: "creator",
        render: (_, record) => record?.creator?.username,
      },
      {
        title: "Lần sửa cuối",
        dataIndex: "updatedAt",
        align: "center",
        render: (_, record) =>
          moment(record?.updatedAt).format("HH:mm DD/MM/YY"),
      },
      {
        title: "Người sửa",
        dataIndex: "updater",
        render: (_, record) => {
          return <Text>{record?.updater?.username}</Text>;
        },
      },
      {
        title: "Xử lý",
        dataIndex: "operation",
        align: "center",
        fixed: "right",
        width: 120,
        render: (_, record) => (
          <TableActions
            record={record}
            permissions={userPermissions}
            actions={[
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
          onApply={(data) => updateFilter(data)}
          onSorts={(sort) => setSorts(sort)}
          data={config}
          add={
            userPermissions.create && <CreateModal onRefresh={refreshTable} />
          }
          deleteAll={
            userPermissions.delete && checkedRowKeys.length > 0 ? (
              <AMultiDeleteModal
                title="Xóa chức vụ"
                name="chức vụ"
                itemIds={checkedRowKeys}
                setCheckedRowKeys={setCheckedRowKeys}
                refresh={refreshTable}
                useMutationHook={useMultiDeletePositionMutation}
              />
            ) : null
          }
        />
      }
    >
      <ATable
        {...tableProps}
        size="middle"
        rowSelection={userPermissions.delete ? rowSelection : undefined}
        rowKey={(record) => record?.id}
        scroll={scrollConfig}
      />
      {isEdit && (
        <EditModal
          open={isEdit}
          onCancelModal={onCancelModal}
          onRefresh={refreshTable}
          data={item}
        />
      )}

      {isDelete && (
        <DeleteModal
          open={isDelete}
          onCancelMoal={onCancelModal}
          data={item}
          onRefresh={refreshTable}
        />
      )}
    </Card>
  );
}

export default memo(PositionTable);
