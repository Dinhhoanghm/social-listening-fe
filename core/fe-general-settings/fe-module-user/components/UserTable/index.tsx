import { Card, Tag } from "antd";
import React, { memo, useState } from "react";
import moment from "moment";
import { usePathname } from "next/navigation";

// Components
import HeaderOperation from "@/fe-component/ATable/HeaderOperation";
import DeleteModal from "../DeleteModal";
import EditModal from "../EditModal";
import ATable from "@/fe-component/ATable";
import TableActions, {
  useTableActionModals,
} from "@/fe-component/ATable/TableActions";
import CreateModal from "@/fe-module-user/components/CreateModal";
import ResetPasswordModal from "../ResetPasswordModal";
import AMultiDeleteModal from "@/fe-component/ATable/AMultiDeleteModal";

// Apis
import { useMultiDeleteUserMutation, useSearchUserMutation } from "../../apis";

// Hook
import { useHookPermissions } from "@/fe-module-rbac/hooks/usePermission";
import { useHookFilter, useHookTable, useTableScroll } from "@/fe-cores/common";

//Constants
import { User } from "../../constants/type";
import config from "./config.json";

function UserTable() {
  const { item, isEdit, isDelete, onCancelModal, handleEdit, handleDelete } =
    useTableActionModals();

  const [isDisabled, setIsDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});

  const { filters, updateFilter } = useHookFilter();
  const [sorts, setSorts] = useState([]);
  const { scrollConfig } = useTableScroll({
    size: "middle",
    isHeaderOperaiton: true,
    scrollX: 1560,
  });

  const path = usePathname();
  const userPermissions = useHookPermissions(path);

  // Hook table
  const {
    tableProps,
    refreshTable,
    rowSelection,
    checkedRowKeys,
    setCheckedRowKeys,
  } = useHookTable({
    useSearchMutation: useSearchUserMutation,
    bodyApi: { ...filters, sorts }, // Sử dụng filters đã lọc bỏ giá trị rỗng
    updateSearchBody: updateFilter,
    columns: [
      // {
      //   title: "Mã nhân viên",
      //   dataIndex: "code",
      //   key: "code",
      //   width: 120,
      // },
      {
        title: "Tài khoản",
        dataIndex: "username",
        key: "username",
        width: 200,
      },
      {
        title: "Họ và tên",
        dataIndex: "fullName",
        key: "fullName",
        width: 200,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 250,
      },
      {
        title: "Số điện thoại",
        width: 150,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
      },
      {
        title: "Ngày tạo",
        width: 150,
        dataIndex: "createAt",
        key: "createAt",
        align: "center",
        render: (_, record: User) => {
          return (
            (record?.createdAt &&
              moment(record?.createdAt).format("HH:mm DD/MM/YY")) ||
            ""
          );
        },
      },
      {
        title: "Tạo bởi",
        width: 200,
        dataIndex: "creator",
        key: "creator",
        render: (_, record: User) => {
          return record?.creator?.username || "";
        },
      },
      {
        title: "Lần sửa cuối",
        width: 150,
        dataIndex: "updatedAt",
        key: "updatedAt",
        align: "center",
        render: (_, record: User) => {
          return (
            (record?.updatedAt &&
              moment(record?.updatedAt).format("HH:mm DD/MM/YY")) ||
            ""
          );
        },
      },
      {
        title: "Người sửa",
        width: 200,
        dataIndex: "updater",
        key: "updater",
        render: (_, record: User) => {
          return record?.updater?.username || "";
        },
      },
      {
        title: "Xử lý",
        dataIndex: "operation",
        fixed: "right",
        width: 170,
        align: "center",
        render: (_, record) => {
          return (
            <TableActions
              record={record}
              permissions={{ ...userPermissions, more: userPermissions.edit }}
              actions={[
                {
                  key: "view",
                  label: "Xem",
                  type: "view",
                  onClick: () => {
                    setIsDisabled(true);
                    handleEdit(record);
                  },
                  pin: true,
                },
                {
                  key: "edit",
                  label: "Sửa",
                  type: "edit",
                  onClick: () => {
                    setIsDisabled(false);
                    handleEdit(record);
                  },
                  pin: true,
                },
                {
                  key: "delete",
                  label: "Xóa",
                  danger: true,
                  type: "delete",
                  onClick: handleDelete,
                  pin: true,
                }
              ]}
              dropdownTrigger={["hover"]}
            />
          );
        },
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
          add={userPermissions.create && <CreateModal refresh={refreshTable} />}
        />
      }
    >
      <ATable
        rowKey={(record) => record.id}
        {...tableProps}
        size="middle"
        scroll={scrollConfig}
      />

      {isDelete && (
        <DeleteModal
          data={item}
          open={isDelete}
          onCancelModal={onCancelModal}
          refresh={refreshTable}
        />
      )}
      {isEdit && (
        <EditModal
          title={isDisabled ? "Xem chi tiết nhân viên" : "Chỉnh sửa nhân viên"}
          data={item}
          open={isEdit}
          onCancelModal={onCancelModal}
          refresh={refreshTable}
          isDisabled={isDisabled}
        />
      )}
      <ResetPasswordModal
        open={open}
        onCancelModal={() => {
          setOpen(false);
        }}
        data={data}
        refresh={refreshTable}
      />
    </Card>
  );
}

export default memo(UserTable);
