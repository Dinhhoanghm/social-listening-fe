import React, { memo, useState } from "react";
import { Card, Image, Tag, Typography } from "antd";
import moment from "moment";
import { useRouter } from "next/navigation";

// Components
import CrawledComicDeleteModal from "../CrawledComicDeleteModal";
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
import CrawledComicCreateModal from "../CrawledComicCreateModal";
import CrawledComicEditModal from "../CrawledComicEditModal";
import { useHookPermissions } from "@/fe-module-rbac/hooks/usePermission";

// Apis
import {
  useSearchCrawledComicMutation,
  useMultiDeleteCrawledComicMutation,
} from "../../apis";

// Constants
import { CrawledComicMetadata } from "../../constants/type";
import config from "./config.json";
import { usePathname } from "next/navigation";
import AMultiDeleteModal from "@/fe-component/ATable/AMultiDeleteModal";

const { Text } = Typography;

function CrawledComicTable() {
  const router = useRouter();
  const { item, isEdit, isDelete, onCancelModal, handleEdit, handleDelete } =
    useTableActionModals();

  const [sorts, setSorts] = useState([]);

  const { filters, updateFilter } = useHookFilter();
  const { scrollConfig } = useTableScroll({
    size: "middle",
    isHeaderOperaiton: true,
    scrollX: 1600,
  });

  const path = usePathname();
  const userPermissions = useHookPermissions(path);

  const handleViewDetail = (record) => {
    router.push(`/crawler/crawled-comic/${record.id}`);
  };

  const {
    tableProps,
    refreshTable,
    rowSelection,
    checkedRowKeys,
    setCheckedRowKeys,
  } = useHookTable({
    useSearchMutation: useSearchCrawledComicMutation,
    bodyApi: { ...filters, sorts },
    updateSearchBody: updateFilter,
    columns: [
      {
        title: "Hình ảnh",
        dataIndex: "coverUrl",
        width: 80,
        align: "center",
        render: (coverUrl, record) => (
          <Image
            width={50}
            height={70}
            src={coverUrl}
            alt={''}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1xkE8M+b3UBERHhERMZmRGS4Q0RERERkRkZGREZGRMZGRGREREZERkZGREZER"
          />
        ),
      },
      {
        title: "Tiêu đề",
        dataIndex: "title",
        width: 300,
        render: (text) => (
          <Text ellipsis={{ tooltip: text }} style={{ maxWidth: 280 }}>
            {text}
          </Text>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        width: 120,
        align: "center",
        render: (status) => (
          <Tag color={status === "ongoing" ? "blue" : "green"}>
            {status.toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Số chương",
        dataIndex: "chapterCounts",
        key: "chapterCounts",
        width: 150,
        align: "center",
        sorter: (a, b) => (a.chapterCounts || 0) - (b.chapterCounts || 0),
        render: (chapterCounts) => (
          <Tag color="green">
            {chapterCounts || 0} chương
          </Tag>
        ),
      },

      {
        title: "Số chương (đã cào)",
        dataIndex: "crawledChapterCount",
        key: "crawledChapterCount",
        width: 200,
        align: "center",
        sorter: (a, b) => (a.crawledChapterCount || 0) - (b.crawledChapterCount || 0),
        render: (crawledChapterCount) => (
          <Tag color="green">
            {crawledChapterCount || 0} chương
          </Tag>
        ),
      },
      {
        title: "Số trang (đã cào)",
        dataIndex: "pageCounts",
        key: "pageCounts",
        width: 200,
        align: "center",
        sorter: (a, b) => (a.pageCounts || 0) - (b.pageCounts || 0),
        render: (pageCounts) => (
          <Tag color="blue">
            {pageCounts || 0} trang
          </Tag>
        ),
      },
      {
        title: "Số coin",
        dataIndex: "numCoin",
        key: "numCoin",
        width: 200,
        align: "center",
        sorter: (a, b) => (a.numCoin || 0) - (b.numCoin || 0),
        render: (numCoin) => numCoin,
      },
      {
        title: "Tags",
        dataIndex: "tags",
        width: 250,
        render: (tags) => (
          <div style={{ maxWidth: 230 }}>
            {tags?.slice(0, 3).map((tag, index) => (
              <Tag key={index} size="small" style={{ marginBottom: 2 }}>
                {tag}
              </Tag>
            ))}
            {tags?.length > 3 && (
              <Tag size="small">+{tags.length - 3}</Tag>
            )}
          </div>
        ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        align: "center",
        width: 150,
        render: (_, record) => {
          return (
            <Text>{moment(record?.createdAt).format("HH:mm DD/MM/YY")}</Text>
          );
        },
      },
      {
        title: "Lần sửa cuối",
        dataIndex: "updatedAt",
        align: "center",
        width: 150,
        render: (_, record) =>
          moment(record?.updatedAt).format("HH:mm DD/MM/YY"),
      },
      {
        title: "Thời gian migrate",
        dataIndex: "migrateAt",
        width: 100,
        render: (_, record) =>
          moment(record?.migrateAt).format("HH:mm DD/MM/YY"),
      },
      {
        title: "Người sửa",
        dataIndex: "updater",
        width: 120,
        render: (_, record) => {
          return <Text>{record?.updatedBy || "-"}</Text>;
        },
      },
      {
        title: "Lượt xem",
        dataIndex: "viewCount",
        width: 120,
        align: "center",
        render: (viewCount) => (
          <Text>{Number(viewCount).toLocaleString()}</Text>
        ),
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
                label: "Chi tiết",
                type: "view",
                onClick: handleViewDetail,
                pin: true,
              },
              // {
              //   key: "edit",
              //   label: "Sửa",
              //   type: "edit",
              //   onClick: handleEdit,
              //   pin: true,
              // },
              // {
              //   key: "delete",
              //   label: "Xóa",
              //   danger: true,
              //   type: "delete",
              //   onClick: handleDelete,
              //   pin: true,
              // },
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
            userPermissions.create && <CrawledComicCreateModal onRefresh={refreshTable} />
          }
          deleteAll={
            userPermissions.delete && checkedRowKeys.length > 0 ? (
              <AMultiDeleteModal
                title="Xóa truyện đã cào"
                name="truyện đã cào"
                itemIds={checkedRowKeys}
                setCheckedRowKeys={setCheckedRowKeys}
                refresh={refreshTable}
                useMutationHook={useMultiDeleteCrawledComicMutation}
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
        <CrawledComicEditModal
          open={isEdit}
          onCancelModal={onCancelModal}
          onRefresh={refreshTable}
          data={item}
        />
      )}

      {isDelete && (
        <CrawledComicDeleteModal
          open={isDelete}
          onCancelMoal={onCancelModal}
          data={item}
          onRefresh={refreshTable}
        />
      )}
    </Card>
  );
}

export default memo(CrawledComicTable);