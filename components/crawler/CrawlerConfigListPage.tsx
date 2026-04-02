"use client";

import {
  Alert,
  App,
  Button,
  Card,
  Empty,
  Flex,
  Input,
  Popover,
  Segmented,
  Select,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { CRAWLER_TYPE_OPTIONS } from "@/lib/constants/crawler";
import { getSourceLabelFromParameters } from "@/lib/parameters";
import {
  useAddCrawlerConfigMutation,
  useDeleteCrawlerConfigMutation,
  useMultiDeleteCrawlerConfigsMutation,
  useSearchCrawlerConfigsQuery,
} from "@/lib/store/apis/crawlerApi";
import type { SearchRequest } from "@/types/api";
import type { CrawlerConfigRequestBody, CrawlerConfigRow } from "@/types/crawler";
import ConfigFormModal from "./ConfigFormModal";

const { Text } = Typography;

function formatFrequencyHours(minutes?: number): string {
  if (minutes == null || Number.isNaN(minutes)) return "-";
  const h = minutes / 60;
  if (Number.isInteger(h)) return String(h);
  return h.toFixed(1);
}

function crawlerTypeColor(t?: string): string {
  const x = t?.toLowerCase();
  switch (x) {
    case "http":
      return "blue";
    case "api":
      return "green";
    case "document":
      return "lime";
    case "android":
      return "orange";
    case "ios":
      return "purple";
    default:
      return "default";
  }
}

function crawlerTypeLabel(t?: string): string {
  if (!t) return "—";
  const opt = CRAWLER_TYPE_OPTIONS.find(
    (o) => o.value.toLowerCase() === t.toLowerCase()
  );
  return opt ? opt.label : t.toUpperCase();
}

type StatusFilter = "all" | "active" | "inactive";

export default function CrawlerConfigListPage() {
  const { message, modal } = App.useApp();
  const router = useRouter();
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [crawlerType, setCrawlerType] = useState<string | undefined>(undefined);
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [createOpen, setCreateOpen] = useState(false);

  const searchBody = useMemo((): SearchRequest => {
    const filters: NonNullable<SearchRequest["filters"]> = [];
    if (status === "active") {
      filters.push({ name: "isActive", value: true, operation: "eq" });
    } else if (status === "inactive") {
      filters.push({ name: "isActive", value: false, operation: "eq" });
    }
    if (crawlerType) {
      filters.push(
        { name: "crawlerType", value: crawlerType, operation: "eq" }
      );
    }
    return {
      page,
      pageSize,
      keyword: keyword.trim() || undefined,
      searches: keyword.trim()
        ? [{ name: "name", option: "LIKE" }]
        : undefined,
      filters,
      sorts: [
        {
          property: "createdAt",
          direction: sortDesc ? "desc" : "asc",
        },
      ],
    };
  }, [crawlerType, keyword, page, pageSize, sortDesc, status]);

  const { data, isLoading, isFetching, refetch, isError, error } =
    useSearchCrawlerConfigsQuery(searchBody);

  const rows = data?.items ?? [];
  const total = Number(data?.total ?? 0);
  const tableBusy = isLoading || isFetching;

  const [addConfig, { isLoading: createLoading }] =
    useAddCrawlerConfigMutation();
  const [deleteConfig] = useDeleteCrawlerConfigMutation();
  const [multiDelete] = useMultiDeleteCrawlerConfigsMutation();

  const onDelete = (record: CrawlerConfigRow) => {
    if (!record.id) return;
    modal.confirm({
      title: "Xóa cấu hình?",
      content: record.name,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        await deleteConfig({ id: record.id! }).unwrap();
        message.success("Đã xóa");
        setSelectedRowKeys((keys) => keys.filter((k) => k !== record.id));
        await refetch();
      },
    });
  };

  const onMultiDelete = () => {
    const ids = selectedRowKeys.map((k) => Number(k)).filter(Boolean);
    if (!ids.length) return;
    modal.confirm({
      title: `Xóa ${ids.length} mục?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        await multiDelete(ids).unwrap();
        message.success("Đã xóa");
        setSelectedRowKeys([]);
        await refetch();
      },
    });
  };

  const handleCreate = async (body: CrawlerConfigRequestBody) => {
    try {
      await addConfig(body).unwrap();
      message.success("Đã tạo");
      setCreateOpen(false);
      setPage(1);
      await refetch();
    } catch (e) {
      message.error(e instanceof Error ? e.message : "Tạo thất bại");
    }
  };

  const columns: ColumnsType<CrawlerConfigRow> = [
    {
      title: "Tên cấu hình",
      dataIndex: "name",
      width: 200,
      ellipsis: true,
    },
    {
      title: "URL nguồn",
      dataIndex: "seedUrls",
      width: 280,
      render: (urls: string[]) => {
        const u = urls?.[0];
        if (!u) return "—";
        return (
          <a href={u} target="_blank" rel="noreferrer">
            {u}
          </a>
        );
      },
    },
    {
      title: "Loại Crawler",
      dataIndex: "crawlerType",
      width: 120,
      align: "center",
      render: (t: string) => (
        <Tag color={crawlerTypeColor(t)}>{crawlerTypeLabel(t)}</Tag>
      ),
    },
    {
      title: "Nguồn (metadata)",
      key: "source",
      width: 160,
      ellipsis: true,
      render: (_, r) => {
        const src = getSourceLabelFromParameters(r.parameters);
        return src ? <Text>{src}</Text> : <Text type="secondary">—</Text>;
      },
    },
    {
      title: "Trạng thái",
      key: "active",
      width: 140,
      align: "center",
      render: (_, r) =>
        r.isActive ? (
          <Tag color="success">Hoạt động</Tag>
        ) : (
          <Tag color="default">Tắt</Tag>
        ),
    },
    {
      title: "Tần suất (giờ)",
      dataIndex: "frequencyMinutes",
      width: 120,
      align: "center",
      render: (m: number) => <Text>{formatFrequencyHours(m)}</Text>,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 96,
      align: "center",
      fixed: "right",
      render: (_, r) => (
        <Flex gap={4} justify="center">
          <Tooltip title="Chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              aria-label="Chi tiết"
              onClick={() => router.push(`/crawler/config/${r.id}`)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              aria-label="Xóa"
              onClick={() => onDelete(r)}
            />
          </Tooltip>
        </Flex>
      ),
    },
  ];

  const filterPanel = (
    <Flex vertical gap="small" style={{ width: 260 }}>
      <Text type="secondary">Loại crawler</Text>
      <Select
        allowClear
        placeholder="Tất cả"
        style={{ width: "100%" }}
        options={CRAWLER_TYPE_OPTIONS.map((o) => ({
          label: o.label,
          value: o.value,
        }))}
        value={crawlerType}
        onChange={(v) => {
          setCrawlerType(v);
          setPage(1);
        }}
      />
    </Flex>
  );

  return (
    <AdminLayout breadcrumbItems={[{ title: "Danh sách cấu hình" }]}>
      <Card
        title="Cấu hình crawler"
        styles={{ body: { paddingTop: 16 } }}
      >
        {isError && (
          <Alert
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            message="Không gọi được API crawler"
            description={
              <>
                Next proxy qua <Text code>/api/backend/…</Text> tới{" "}
                <Text code>BACKEND_ORIGIN</Text> (chỉ server). Hãy chạy Spring và
                khớp cổng trong <Text code>.env</Text>. Lỗi:{" "}
                {error && typeof error === "object" && "status" in error
                  ? String((error as { status?: unknown }).status)
                  : "ECONNREFUSED / mạng"}
              </>
            }
          />
        )}
        <Flex vertical gap={16}>
          <Flex justify="space-between" align="center" gap={16} wrap="wrap">
            <Flex gap={12} wrap="wrap" align="center" style={{ flex: 1, minWidth: 0 }}>
              <Input.Search
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Tìm theo tên"
                style={{ width: "100%", maxWidth: 280 }}
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onSearch={(v) => {
                  setKeyword(v ?? "");
                  setPage(1);
                }}
              />
              <Segmented<StatusFilter>
                options={[
                  { label: "Tất cả", value: "all" },
                  { label: "Hoạt động", value: "active" },
                  { label: "Tắt", value: "inactive" },
                ]}
                value={status}
                onChange={(v) => {
                  setStatus(v);
                  setPage(1);
                }}
              />
            </Flex>
            <Flex gap={8} wrap="wrap" align="center">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateOpen(true)}
              >
                Thêm mới
              </Button>
              <Tooltip title="Sắp xếp theo ngày tạo">
                <Button
                  icon={sortDesc ? <SortDescendingOutlined /> : <SortAscendingOutlined />}
                  onClick={() => {
                    setSortDesc((s) => !s);
                    setPage(1);
                  }}
                >
                  Ngày tạo {sortDesc ? "↓" : "↑"}
                </Button>
              </Tooltip>
              <Popover content={filterPanel} title="Lọc nâng cao" trigger="click">
                <Button icon={<FilterOutlined />}>Lọc loại</Button>
              </Popover>
              {selectedRowKeys.length > 0 && (
                <Button danger onClick={onMultiDelete}>
                  Xóa đã chọn ({selectedRowKeys.length})
                </Button>
              )}
            </Flex>
          </Flex>

          <Table<CrawlerConfigRow>
            rowKey="id"
            size="middle"
            bordered
            loading={tableBusy}
            columns={columns}
            dataSource={rows}
            scroll={{ x: 1200 }}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Chưa có cấu hình"
                />
              ),
            }}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50],
              showTotal: (t, range) => `${range[0]}-${range[1]} của ${t} mục`,
              onChange: (p, ps) => {
                setPage(p);
                setPageSize(ps);
              },
            }}
          />
        </Flex>
      </Card>

      <ConfigFormModal
        open={createOpen}
        title="Thêm cấu hình cào dữ liệu"
        confirmLoading={createLoading}
        onCancel={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </AdminLayout>
  );
}
