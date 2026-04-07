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
  Select,
  Spin,
  Table,
  Tag,
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
import { useEffect, useMemo, useState } from "react";
import {
  useAddCustomScriptMutation,
  useDeleteCustomScriptMutation,
  useGetCustomScriptDetailQuery,
  useSearchCustomScriptsQuery,
  useUpdateCustomScriptMutation,
} from "@/lib/store/apis/crawlerApi";
import type { SearchRequest } from "@/types/api";
import type { CrawlerCustomScriptRow } from "@/types/crawler";

const { Text } = Typography;

const LANGUAGE_OPTIONS = [
  { value: "python", label: "python" },
  { value: "javascript", label: "javascript" },
  { value: "groovy", label: "groovy" },
];

export default function CrawlerScriptListPage() {
  const { message, modal } = App.useApp();
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const searchBody = useMemo((): SearchRequest => {
    return {
      page,
      pageSize,
      keyword: keyword.trim() || undefined,
      searches: keyword.trim()
        ? [{ name: "name", option: "LIKE" }]
        : undefined,
      sorts: [{ property: "createdAt", direction: "desc" }],
    };
  }, [keyword, page, pageSize]);

  const { data, isLoading, isFetching, refetch, isError, error } =
    useSearchCustomScriptsQuery(searchBody);

  const { data: detailRow, isFetching: detailLoading } =
    useGetCustomScriptDetailQuery(
      { id: editingId! },
      { skip: !modalOpen || editingId == null }
    );

  useEffect(() => {
    if (!modalOpen || editingId == null) return;
    if (!detailRow) return;
    form.setFieldsValue({
      name: detailRow.name ?? "",
      language: (detailRow.language ?? "python").toLowerCase(),
      description: detailRow.description ?? "",
      script: detailRow.script ?? "",
    });
  }, [modalOpen, editingId, detailRow, form]);

  const [addScript, { isLoading: adding }] = useAddCustomScriptMutation();
  const [updateScript, { isLoading: updating }] =
    useUpdateCustomScriptMutation();
  const [deleteScript] = useDeleteCustomScriptMutation();

  const rows = data?.items ?? [];
  const total = Number(data?.total ?? 0);
  const tableBusy = isLoading || isFetching;

  const openCreate = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      name: "",
      language: "python",
      description: "",
      script: "",
    });
    setModalOpen(true);
  };

  const openEdit = (r: CrawlerCustomScriptRow) => {
    if (!r.id) return;
    setEditingId(r.id);
    form.resetFields();
    setModalOpen(true);
  };

  const save = async () => {
    const v = await form.validateFields();
    const body = {
      name: v.name.trim(),
      language: String(v.language).toLowerCase(),
      script: v.script ?? "",
      description: v.description?.trim() || undefined,
    };
    try {
      if (editingId != null) {
        await updateScript({ id: editingId, body }).unwrap();
        message.success("Đã cập nhật script");
      } else {
        await addScript(body).unwrap();
        message.success("Đã tạo script");
      }
      setModalOpen(false);
      setEditingId(null);
      await refetch();
    } catch (e) {
      message.error(e instanceof Error ? e.message : "Lưu thất bại");
    }
  };

  const onDelete = (r: CrawlerCustomScriptRow) => {
    if (!r.id) return;
    modal.confirm({
      title: "Xóa script?",
      content: r.name,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteScript({ id: r.id! }).unwrap();
          message.success("Đã xóa");
          await refetch();
        } catch (e) {
          message.error(e instanceof Error ? e.message : "Xóa thất bại");
        }
      },
    });
  };

  const columns: ColumnsType<CrawlerCustomScriptRow> = [
    { title: "Tên", dataIndex: "name", width: 200, ellipsis: true },
    {
      title: "Ngôn ngữ",
      dataIndex: "language",
      width: 100,
      render: (lang: string) => <Tag>{lang ?? "—"}</Tag>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      ellipsis: true,
      render: (d: string) => d || <Text type="secondary">—</Text>,
    },
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

  const modalConfirmLoading =
    adding || updating || (editingId != null && detailLoading);

  return (
    <>
      <Card
        title="Script tùy chỉnh"
        extra={
          <Text type="secondary" style={{ fontWeight: 400 }}>
            Gán vào bước pipeline qua <Text code>custom_script_id</Text>
          </Text>
        }
      >
        {isError && (
          <Alert
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            message="Không gọi được API script"
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
            placeholder="Tìm theo tên"
            style={{ width: "100%", maxWidth: 320 }}
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onSearch={(v) => {
              setKeyword(v ?? "");
              setPage(1);
            }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Thêm script
          </Button>
        </Flex>

        <Table<CrawlerCustomScriptRow>
          rowKey="id"
          size="middle"
          bordered
          loading={tableBusy}
          columns={columns}
          dataSource={rows}
          scroll={{ x: 800 }}
          locale={{
            emptyText: (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có script" />
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
        title={editingId != null ? "Sửa script" : "Thêm script"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingId(null);
        }}
        onOk={() => void save()}
        confirmLoading={modalConfirmLoading}
        okText="Lưu"
        cancelText="Hủy"
        width={720}
        destroyOnHidden
        centered
      >
        {editingId != null && detailLoading ? (
          <Flex justify="center" align="center" style={{ padding: "48px 0" }}>
            <Spin tip="Đang tải script…" />
          </Flex>
        ) : (
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            scrollToFirstError
            style={{ marginTop: 8 }}
          >
            <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="language" label="Ngôn ngữ" rules={[{ required: true }]}>
              <Select options={LANGUAGE_OPTIONS} style={{ minWidth: 160 }} />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item
              name="script"
              label="Nội dung script"
              rules={[{ required: true }]}
              extra="Giữ UTF-8; tránh hard-code secret trong repo"
            >
              <Input.TextArea
                rows={14}
                className="font-mono text-sm"
                style={{ fontFamily: "ui-monospace, monospace" }}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
}
