import React, { memo, useState } from "react";
import { Card, Tag, Typography, Image } from "antd";
import moment from "moment";

// Components
import ComicDataDeleteModal from "../ComicDataDeleteModal";
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
import ComicDataCreateModal from "../ComicDataCreateModal";
import ComicDataEditModal from "../ComicDataEditModal";
import { useHookPermissions } from "@/fe-module-rbac/hooks/usePermission";

// Apis
import {
  useSearchComicDataMutation,
  useMultiDeleteComicDataMutation,
} from "../../apis";

// Constants
import { ComicData } from "../../constants/type";
import config from "./config.json";
import { usePathname, useRouter } from "next/navigation";
import AMultiDeleteModal from "@/fe-component/ATable/AMultiDeleteModal";

const { Text } = Typography;

function ComicDataTable() {
  const { item, isEdit, isDelete, onCancelModal, handleEdit, handleDelete } =
    useTableActionModals();
  const router = useRouter();

  const [sorts, setSorts] = useState([]);

  const { filters, updateFilter } = useHookFilter();
  const { scrollConfig } = useTableScroll({
    size: "middle",
    isHeaderOperaiton: true,
    scrollX: 1800,
  });

  const path = usePathname();
  const userPermissions = useHookPermissions(path);

  const handleView = (record: ComicData) => {
    router.push(`/crawler/comic-data/${record.id}`);
  };

  const {
    tableProps,
    refreshTable,
    rowSelection,
    checkedRowKeys,
    setCheckedRowKeys,
  } = useHookTable({
    useSearchMutation: useSearchComicDataMutation,
    bodyApi: { ...filters, sorts },
    updateSearchBody: updateFilter,
    columns: [
      {
        title: "Hình ảnh",
        dataIndex: "imgUrl",
        width: 50,
        align: "center",
        render: (imgUrl, record) => (
          <Image
            width={50}
            height={70}
            src={imgUrl}
            alt={''}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1xkE8M+b3UBERHhERMZmRGS4Q0RERERkRkZGREZGRMZGRGREREZERkZGREZER"
          />
        ),
      },
      {
        title: "Tiêu đề",
        dataIndex: "title",
        width: 150,
        render: (text) => (
          <Text ellipsis={{ tooltip: text }} style={{ maxWidth: 230 }}>
            {text}
          </Text>
        ),
      },
      {
        title: "URL nguồn",
        dataIndex: "detailUrl",
        width: 150,
        render: (text) => (
          <Text ellipsis={{ tooltip: text }} style={{ maxWidth: 280 }}>
            {text}
          </Text>
        ),
      },
      {
        title: "Thời gian cào chi tiết",
        dataIndex: "timeProcessAt",
        width: 100,
        render: (_, record) =>
          moment(record?.timeProcessAt).format("HH:mm DD/MM/YY"),
      },
      {
        title: "Lần sửa cuối",
        dataIndex: "updatedAt",
        align: "center",
        width: 100,
        render: (_, record) =>
          moment(record?.updatedAt).format("HH:mm DD/MM/YY"),
      },
      // {
      //   title: "Xử lý",
      //   dataIndex: "operation",
      //   align: "center",
      //   fixed: "right",
      //   width: 50,
      //   render: (_, record) => (
      //     <TableActions
      //       record={record}
      //       permissions={userPermissions}
      //       actions={[
      //         {
      //           key: "view",
      //           label: "Xem chi tiết",
      //           type: "view",
      //           onClick: handleView,
      //           pin: true,
      //         },
      //         {
      //           key: "delete",
      //           label: "Xóa",
      //           danger: true,
      //           type: "delete",
      //           onClick: handleDelete,
      //           pin: true,
      //         },
      //       ]}
      //       dropdownTrigger={["hover"]}
      //     />
      //   ),
      // },
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
            userPermissions.create && <ComicDataCreateModal onRefresh={refreshTable} />
          }
          deleteAll={
            userPermissions.delete && checkedRowKeys.length > 0 ? (
              <AMultiDeleteModal
                title="Xóa dữ liệu truyện"
                name="dữ liệu truyện"
                itemIds={checkedRowKeys}
                setCheckedRowKeys={setCheckedRowKeys}
                refresh={refreshTable}
                useMutationHook={useMultiDeleteComicDataMutation}
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
        <ComicDataEditModal
          open={isEdit}
          onCancelModal={onCancelModal}
          onRefresh={refreshTable}
          data={item}
        />
      )}

      {isDelete && (
        <ComicDataDeleteModal
          open={isDelete}
          onCancelMoal={onCancelModal}
          data={item}
          onRefresh={refreshTable}
        />
      )}
    </Card>
  );
}

export default memo(ComicDataTable);