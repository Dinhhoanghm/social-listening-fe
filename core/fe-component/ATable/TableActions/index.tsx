import React, { memo, useCallback, useMemo, useState } from "react";
import { Space, Button, Tooltip, Dropdown, MenuProps } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
} from "@ant-design/icons";

// Định nghĩa kiểu dữ liệu cho một action
export interface TableAction<RecordType = any> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  type: "view" | "edit" | "delete" | string;
  danger?: boolean;
  pin?: boolean;
  onClick: (record: RecordType) => void;
}

// Định nghĩa props cho component
export interface TableActionsProps<RecordType = any> {
  record: RecordType;
  permissions?: Record<string, boolean>;
  actions: TableAction<RecordType>[];
  dropdownTrigger?: ("click" | "hover")[];
}

const TableActions = <RecordType extends object = any>({
  record,
  permissions = {},
  actions = [],
  dropdownTrigger = ["hover"],
}: TableActionsProps<RecordType>) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  // Lọc các action dựa trên quyền
  const availableActions = actions.filter((action) => {
    // Nếu action không có check quyền hoặc quyền được phép
    return !action.type || permissions[action.type];
  });

  // Nếu không có action nào, return null
  if (availableActions.length === 0) {
    return null;
  }

  // Chia actions thành 2 nhóm: pinned và unpinned
  const pinnedActions = availableActions.filter((action) => action.pin);
  const unpinnedActions = availableActions.filter((action) => !action.pin);

  // Tạo menu items cho dropdown
  const menuItems: MenuProps["items"] = unpinnedActions.map((action) => ({
    key: action.key,
    icon: action.icon,
    label: action.label,
    danger: action.danger,
    onClick: () => action.onClick(record),
  }));

  const ICON = (type: string) => {
    if (type === "view") {
      return <EyeOutlined style={{ color: "#1890FF", fontSize: 16 }} />;
    }

    if (type === "edit") {
      return <EditOutlined style={{ color: "#FAAD14", fontSize: 16 }} />;
    }

    if (type === "delete") {
      return <DeleteOutlined style={{ color: "#FF4D4F", fontSize: 16 }} />;
    }

    return "";
  };

  return (
    <Space size="small">
      {/* Hiển thị các action đã pin */}
      {pinnedActions.map((action) => {
        const _icon = action.icon || ICON(action.type);
        return (
          <Tooltip key={action.key} title={action.label}>
            <Button
              type="text"
              icon={_icon}
              danger={action.danger}
              onClick={() => action.onClick(record)}
            />
          </Tooltip>
        );
      })}

      {/* Hiển thị dropdown nếu có action unpinned */}
      {unpinnedActions.length > 0 && (
        <Dropdown
          menu={{ items: menuItems }}
          trigger={dropdownTrigger}
          open={dropdownOpen}
          onOpenChange={setDropdownOpen}
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      )}
    </Space>
  );
};

export default memo(TableActions) as typeof TableActions;

// Định nghĩa kiểu Modal
export type ModalType = "edit" | "delete" | "view" | null;

interface ModalState<T = any> {
  visible: boolean;
  type: ModalType;
  data: T | null;
  title?: string;
}

/**
 * Hook để quản lý modal trong table actions
 */
export function useTableActionModals<RecordType = any>() {
  // State để lưu trạng thái modal
  const [modalState, setModalState] = useState<ModalState<RecordType>>({
    visible: false,
    type: null,
    data: null,
    title: "",
  });

  // Hàm mở modal
  const onOpenModal = useCallback(
    (type: ModalType, record: RecordType, title?: string) => {
      setModalState({
        visible: true,
        type,
        data: record,
        title:
          title ||
          `${
            type === "edit" ? "Chỉnh sửa" : type === "delete" ? "Xóa" : "Xem"
          } dữ liệu`,
      });
    },
    []
  );

  // Hàm đóng modal
  const onCancelModal = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  // Tạo các handlers cho các action phổ biến
  const handleView = useCallback(
    (record: RecordType) => {
      onOpenModal("view", record, "Xem chi tiết");
    },
    [onOpenModal]
  );

  const handleEdit = useCallback(
    (record: RecordType) => {
      onOpenModal("edit", record, "Chỉnh sửa");
    },
    [onOpenModal]
  );

  const handleDelete = useCallback(
    (record: RecordType) => {
      onOpenModal("delete", record, "Xác nhận xóa");
    },
    [onOpenModal]
  );

  // Kiểm tra xem modal có đang hiển thị không và loại modal
  const isModalVisible = modalState.visible;
  const isEdit = modalState.type === "edit" && modalState.visible;
  const isDelete = modalState.type === "delete" && modalState.visible;
  const isView = modalState.type === "view" && modalState.visible;

  return {
    // Trạng thái
    modalState,
    // Helpers
    isModalVisible,
    item: modalState?.data,
    isEdit,
    isDelete,
    isView,
    // Actions
    onOpenModal,
    onCancelModal,
    handleView,
    handleEdit,
    handleDelete,
  };
}
