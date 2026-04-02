"use client";

import {
  Alert,
  App,
  Button,
  Card,
  Empty,
  Flex,
  Form,
  Input,
  Modal,
  Table,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  useAddCrawlerSourceMutation,
  useDeleteCrawlerSourceMutation,
  useSearchCrawlerSourcesQuery,
  useUpdateCrawlerSourceMutation,
} from "@/lib/store/apis/crawlerApi";
import type { SearchRequest } from "@/types/api";
import type { CrawlerSourceRequestBody, CrawlerSourceRow } from "@/types/crawler";

const { Text } = Typography;

export default function CrawlerSourceListPage() {
  const { message, modal } = App.useApp();
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CrawlerSourceRow | null>(null);
  const [form] = Form.useForm();

  const searchBody = useMemo((): SearchRequest => {
    return {
      page,
      pageSize,
      keyword: keyword.trim() || undefined,
      searches: keyword.trim()
        ? [
            { name: "name", option: "LIKE" },
            { name: "platform", option: "LIKE" },
          ]
        : undefined,
      sorts: [{ property: "createdAt", direction: "desc" }],
    };
  }, [keyword, page, pageSize]);

  const { data, isLoading, isFetching, refetch, isError, error } =
    useSearchCrawlerSourcesQuery(searchBody);

  const [addSource, { isLoading: adding }] = useAddCrawlerSourceMutation();
  const [updateSource, { isLoading: updating }] =
    useUpdateCrawlerSourceMutation();
  const [deleteSource] = useDeleteCrawlerSourceMutation();

  const rows = data?.items ?? [];
  const total = Number(data?.total ?? 0);
  const tableBusy = isLoading || isFetching;

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      name: "",
      platform: "",
      baseUrl: "",
      sourceType: "",
      metadataText: "",
    });
    setModalOpen(true);
  };

  const openEdit = (r: CrawlerSourceRow) => {
    setEditing(r);
    const meta =
      r.metadata != null
        ? typeof r.metadata === "string"
          ? r.metadata
          : JSON.stringify(r.metadata, null, 2)
        : "";
    form.setFieldsValue({
      name: r.name ?? "",
      platform: r.platform ?? "",
      baseUrl: r.baseUrl ?? "",
      sourceType: r.sourceType ?? "",
      metadataText: meta,
    });
    setModalOpen(true);
  };

  const save = async () => {
    const v = await form.validateFields();
    let metadata: string | undefined;
    if (v.metadataText?.trim()) {
      try {
        JSON.parse(v.metadataText);
        metadata = v.metadataText.trim();
      } catch {
        message.error("metadata phải là JSON hợp lệ");
        return;
      }
    }
    const body: CrawlerSourceRequestBody = {
      name: v.name.trim(),
      platform: v.platform?.trim() || undefined,
      baseUrl: v.baseUrl?.trim() || undefined,
      sourceType: v.sourceType?.trim() || undefined,
      metadata,
    };
    try {
      if (editing?.id) {
        await updateSource({ id: editing.id, body }).unwrap();
        message.success("Đã cập nhật nguồn");
      } else {
        await addSource(body).unwrap();
        message.success("Đã tạo nguồn");
      }
      setModalOpen(false);
      setEditing(null);
      await refetch();
    } catch (e) {
      message.error(e instanceof Error ? e.message : "Lưu thất bại");
    }
  };

  const onDelete = (r: CrawlerSourceRow) => {
    if (!r.id) return;
    modal.confirm({
      title: "Xóa nguồn dữ liệu?",
      content: r.name,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteSource({ id: r.id! }).unwrap();
          message.success("Đã xóa");
          await refetch();
        } catch (e) {
          message.error(e instanceof Error ? e.message : "Xóa thất bại");
        }
      },
    });
  };

  const columns: ColumnsType<CrawlerSourceRow> = [
    { title: "Tên", dataIndex: "name", width: 200, ellipsis: true },
    { title: "Platform", dataIndex: "platform", width: 120, ellipsis: true },
    {
      title: "Base URL",
      dataIndex: "baseUrl",
      ellipsis: true,
      render: (u: string) =>
        u ? (
          <a href={u} target="_blank" rel="noreferrer">
            {u}
          </a>
        ) : (
          "—"
        ),
    },
    { title: "Loại nguồn", dataIndex: "sourceType", width: 120, ellipsis: true },
    {
      title: "Thao tác",
      width: 108,
      fixed: "right",
      render: (_, r) => (
        <Flex gap="small" justify="flex-end">
          <Button
            type="text"
            icon={<EditOutlined />}
            aria-label="Sửa"
            onClick={() => openEdit(r)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            aria-label="Xóa"
            onClick={() => onDelete(r)}
          />
        </Flex>
      ),
    },
  ];

  return (
    <AdminLayout
      breadcrumbItems={[
        { title: <Link href="/crawler/config">Cấu hình crawler</Link> },
        { title: "Nguồn dữ liệu" },
      ]}
    >
      <Card
        title="Nguồn dữ liệu"
        extra={
          <Text type="secondary" style={{ fontWeight: 400 }}>
            Liên kết với <Text code>crawler_config.source_id</Text>
          </Text>
        }
      >
        {isError && (
          <Alert
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            message="Không gọi được API nguồn dữ liệu"
            description={
              error && typeof error === "object" && "status" in error
                ? String((error as { status?: unknown }).status)
                : "ECONNREFUSED / mạng — kiểm tra BACKEND_ORIGIN"
            }
          />
        )}
        <Flex
          justify="space-between"
          align="center"
          gap={16}
          wrap="wrap"
          style={{ marginBottom: 16 }}
        >
          <Input.Search
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Tìm theo tên / platform"
            style={{ width: "100%", maxWidth: 320 }}
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onSearch={(v) => {
              setKeyword(v ?? "");
              setPage(1);
            }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Thêm nguồn
          </Button>
        </Flex>

        <Table<CrawlerSourceRow>
          rowKey="id"
          size="middle"
          bordered
          loading={tableBusy}
          columns={columns}
          dataSource={rows}
          scroll={{ x: 900 }}
          locale={{
            emptyText: (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có nguồn" />
            ),
          }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (t, range) => `${range[0]}-${range[1]} / ${t}`,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
        />
      </Card>

      <Modal
        title={editing?.id ? "Sửa nguồn" : "Thêm nguồn"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onOk={() => void save()}
        confirmLoading={adding || updating}
        okText="Lưu"
        cancelText="Hủy"
        width={560}
        destroyOnHidden
        centered
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          scrollToFirstError
          style={{ marginTop: 8 }}
        >
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input placeholder="VnExpress, Tuổi Trẻ…" />
          </Form.Item>
          <Form.Item name="platform" label="Platform">
            <Input placeholder="web, android, api…" />
          </Form.Item>
          <Form.Item name="baseUrl" label="Base URL">
            <Input placeholder="https://vnexpress.net" />
          </Form.Item>
          <Form.Item name="sourceType" label="Loại nguồn (source_type)">
            <Input placeholder="news, forum, social…" />
          </Form.Item>
          <Form.Item
            name="metadataText"
            label="metadata (JSON)"
            extra="Để trống nếu không cần"
          >
            <Input.TextArea rows={5} placeholder='{"note":"…"}' />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
}
