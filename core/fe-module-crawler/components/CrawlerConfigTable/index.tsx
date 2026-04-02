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
  useSearchCrawlerConfigMutation,
  useMultiDeleteCrawlerConfigMutation,
} from "../../apis";

// Constants
import { CrawlerConfig } from "../../constants/type";
import config from "./config.json";
import { usePathname, useRouter } from "next/navigation";
import AMultiDeleteModal from "@/fe-component/ATable/AMultiDeleteModal";

const { Text } = Typography;

function CrawlerConfigTable() {
  const { item, isEdit, isDelete, onCancelModal, handleEdit, handleDelete } =
    useTableActionModals();
  const router = useRouter();

  const [sorts, setSorts] = useState([]);

  const handleView = (record: CrawlerConfig) => {
    router.push(`/crawler/config/${record.id}`);
  };

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
    useSearchMutation: useSearchCrawlerConfigMutation,
    bodyApi: { ...filters, sorts },
    updateSearchBody: updateFilter,
    columns: [
      {
        title: "Tên cấu hình",
        dataIndex: "name",
        width: 200,
      },
      {
        title: "URL nguồn",
        dataIndex: "url",
        width: 300,
        render: (text) => (
          <Text ellipsis={{ tooltip: text }} style={{ maxWidth: 280 }}>
            {text}
          </Text>
        ),
      },
      {
        title: "Loại Crawler",
        dataIndex: "crawlerType",
        width: 120,
        align: "center",
        render: (crawlerType) => (
          <Tag color={crawlerType === "WEB" ? "blue" : "green"}>
            {crawlerType || "WEB"}
          </Tag>
        ),
      },
      {
        title: "Loại truyện",
        dataIndex: "storyType",
        width: 120,
        align: "center",
        render: (storyType) => (
          <Tag color={storyType === "comic" ? "orange" : "purple"}>
            {storyType === "comic" ? "Truyện tranh" : storyType === "novel" ? "Truyện chữ" : "Truyện tranh"}
          </Tag>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "active",
        key: "active",
        width: 150,
        align: "center",
        render: (_, record: CrawlerConfig) => {
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
        title: "Tần suất (giờ)",
        dataIndex: "frequencyHour",
        width: 120,
        align: "center",
        render: (text) => (
          <Text>{text || '-'}</Text>
        ),
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
                key: "view",
                label: "Xem chi tiết",
                type: "view",
                onClick: handleView,
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
                title="Xóa cấu hình cào"
                name="cấu hình cào"
                itemIds={checkedRowKeys}
                setCheckedRowKeys={setCheckedRowKeys}
                refresh={refreshTable}
                useMutationHook={useMultiDeleteCrawlerConfigMutation}
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

export default memo(CrawlerConfigTable);