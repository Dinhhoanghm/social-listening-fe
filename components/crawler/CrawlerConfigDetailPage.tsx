"use client";

import {
  Alert,
  App,
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Result,
  Row,
  Select,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  CRAWLER_TYPE_OPTIONS,
  LOCATOR_TYPES,
  PARSE_TYPES,
  REQUEST_METHODS,
  STEP_TYPE_OPTIONS,
} from "@/lib/constants/crawler";
import FieldFormModal from "./FieldFormModal";
import {
  useAddCrawlerFieldMutation,
  useAddCrawlerStepMutation,
  useDeleteCrawlerFieldMutation,
  useDeleteCrawlerStepMutation,
  useGetCrawlerConfigDetailQuery,
  useSearchCrawlerSourcesQuery,
  useSearchCustomScriptsQuery,
  useUpdateCrawlerConfigMutation,
  useUpdateCrawlerFieldMutation,
  useUpdateCrawlerStepMutation,
} from "@/lib/store/apis/crawlerApi";
import {
  mergeParametersJson,
  parseParametersJson,
} from "@/lib/parameters";
import type {
  CrawlerConfigRequestBody,
  CrawlerCustomScriptRow,
  CrawlerFieldRequestBody,
  CrawlerFieldRow,
  CrawlerParametersPayload,
  CrawlerStepModel,
  CrawlerStepRequestBody,
} from "@/types/crawler";

const { Title, Text } = Typography;

export default function CrawlerConfigDetailPage() {
  const { message, modal } = App.useApp();
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const [form] = Form.useForm();
  const [stepForm] = Form.useForm();
  const [stepModalOpen, setStepModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<CrawlerStepModel | null>(null);
  const [fieldsDrawerStep, setFieldsDrawerStep] =
    useState<CrawlerStepModel | null>(null);
  const [fieldModalOpen, setFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<CrawlerFieldRow | null>(null);

  const skip = !Number.isFinite(id) || id <= 0;

  const {
    data: detail,
    isLoading,
    isFetching,
    isError,
  } = useGetCrawlerConfigDetailQuery({ id }, { skip });

  const [updateConfig, { isLoading: saving }] =
    useUpdateCrawlerConfigMutation();
  const [addStep] = useAddCrawlerStepMutation();
  const [updateStep] = useUpdateCrawlerStepMutation();
  const [deleteStep] = useDeleteCrawlerStepMutation();
  const [addField, { isLoading: addingField }] = useAddCrawlerFieldMutation();
  const [updateField, { isLoading: updatingField }] =
    useUpdateCrawlerFieldMutation();
  const [deleteField] = useDeleteCrawlerFieldMutation();

  const sourceSearchBody = useMemo(() => ({ page: 1, pageSize: 500 }), []);
  const { data: sourcesPage } = useSearchCrawlerSourcesQuery(sourceSearchBody);
  const sources = sourcesPage?.items ?? [];

  const scriptSearchBody = useMemo(
    () => ({ page: 1, pageSize: 200 }),
    []
  );
  const { data: scriptsPage } = useSearchCustomScriptsQuery(scriptSearchBody);
  const scripts: CrawlerCustomScriptRow[] = scriptsPage?.items ?? [];

  useEffect(() => {
    if (isError) {
      message.error("Không tải được chi tiết cấu hình");
    }
  }, [isError, message]);

  useEffect(() => {
    if (!detail) return;
    const paramsObj = parseParametersJson(detail.parameters) ?? {};
    const rest: Record<string, unknown> = { ...paramsObj };
    delete rest.source;
    delete rest.min_word_count;
    form.setFieldsValue({
      name: detail.name,
      sourceId: detail.sourceId ?? undefined,
      seedUrlsText: (detail.seedUrls ?? []).join("\n"),
      crawlerType: (detail.crawlerType ?? "http").toLowerCase(),
      parseType: detail.parseType ?? "HTML",
      sourceLabel:
        typeof paramsObj.source === "string" ? paramsObj.source : "",
      minWordCount:
        typeof paramsObj.min_word_count === "number"
          ? paramsObj.min_word_count
          : 100,
      isActive: detail.isActive ?? true,
      frequencyHours: (detail.frequencyMinutes ?? 60) / 60,
      maxDepth: detail.maxDepth ?? 3,
      maxRetry: detail.maxRetry ?? 3,
      parametersExtra: Object.keys(rest).length
        ? JSON.stringify(rest, null, 2)
        : "",
    });
  }, [detail, form]);

  const steps = useMemo(
    () =>
      [...(detail?.crawlerSteps ?? [])].sort(
        (a, b) => (a.stepOrder ?? 0) - (b.stepOrder ?? 0)
      ),
    [detail?.crawlerSteps]
  );

  const saveConfig = async () => {
    const v = await form.validateFields();
    const seedUrls = String(v.seedUrlsText || "")
      .split(/[\n,]+/)
      .map((s: string) => s.trim())
      .filter(Boolean);
    const payload: CrawlerParametersPayload = {};
    if (v.sourceLabel?.trim()) {
      payload.source = v.sourceLabel.trim();
    }
    if (v.minWordCount != null && v.minWordCount >= 0) {
      payload.min_word_count = Number(v.minWordCount);
    }
    let parameters = mergeParametersJson(undefined, payload);
    if (v.parametersExtra?.trim()) {
      try {
        const extra = JSON.parse(v.parametersExtra) as Record<string, unknown>;
        parameters = JSON.stringify({
          ...JSON.parse(parameters),
          ...extra,
        });
      } catch {
        message.warning("JSON tham số bổ sung không hợp lệ");
        return;
      }
    }
    const body: CrawlerConfigRequestBody = {
      sourceId: v.sourceId ?? null,
      name: v.name,
      crawlerType: v.crawlerType,
      parseType: v.parseType,
      seedUrls,
      isActive: v.isActive,
      frequencyMinutes: Math.max(1, Math.round(Number(v.frequencyHours) * 60)),
      maxDepth: v.maxDepth,
      maxRetry: v.maxRetry,
      parameters,
    };
    try {
      await updateConfig({ id, body }).unwrap();
      message.success("Đã lưu cấu hình");
    } catch (e) {
      message.error(e instanceof Error ? e.message : "Lưu thất bại");
    }
  };

  const openAddStep = () => {
    const nextOrder =
      steps.reduce((m, s) => Math.max(m, s.stepOrder ?? 0), 0) + 1;
    setEditingStep({
      stepOrder: nextOrder,
      stepName: `Bước ${nextOrder}`,
      stepType: "fetch",
      requestMethod: "GET",
      delaySeconds: 0,
    });
    stepForm.resetFields();
    stepForm.setFieldsValue({
      stepOrder: nextOrder,
      stepName: `Bước ${nextOrder}`,
      stepType: "fetch",
      requestMethod: "GET",
      delaySeconds: 0,
      extraConfigText: "",
    });
    setStepModalOpen(true);
  };

  const openEditStep = (s: CrawlerStepModel) => {
    setEditingStep(s);
    stepForm.setFieldsValue({
      ...s,
      stepType: (s.stepType ?? "fetch").toLowerCase(),
      extraConfigText:
        typeof s.extraConfig === "string"
          ? s.extraConfig
          : s.extraConfig != null
            ? JSON.stringify(s.extraConfig, null, 2)
            : "",
    });
    setStepModalOpen(true);
  };

  const saveStep = async () => {
    const v = await stepForm.validateFields();
    let extraConfig: string | undefined;
    if (v.extraConfigText?.trim()) {
      try {
        JSON.parse(v.extraConfigText);
        extraConfig = v.extraConfigText.trim();
      } catch {
        message.error("extraConfig phải là JSON hợp lệ");
        return;
      }
    }
    const base: CrawlerStepRequestBody = {
      crawlerConfigId: id,
      stepOrder: v.stepOrder,
      stepName: v.stepName,
      stepType: v.stepType,
      requestMethod: v.requestMethod,
      locatorType: v.locatorType,
      locatorValue: v.locatorValue,
      outputUrlType: v.outputUrlType,
      delaySeconds: v.delaySeconds ?? 0,
      customScriptId: v.customScriptId ?? null,
      extraConfig,
    };
    try {
      if (editingStep?.id) {
        await updateStep({ id: editingStep.id, body: base }).unwrap();
        message.success("Đã cập nhật bước");
      } else {
        await addStep(base).unwrap();
        message.success("Đã thêm bước");
      }
      setStepModalOpen(false);
      setEditingStep(null);
    } catch (e) {
      message.error(e instanceof Error ? e.message : "Lưu bước thất bại");
    }
  };

  const openFieldsDrawer = (s: CrawlerStepModel) => {
    setFieldsDrawerStep(s);
  };

  const openAddField = () => {
    setEditingField(null);
    setFieldModalOpen(true);
  };

  const openEditField = (f: CrawlerFieldRow) => {
    setEditingField(f);
    setFieldModalOpen(true);
  };

  const saveField = async (body: CrawlerFieldRequestBody) => {
    if (!fieldsDrawerStep?.id) {
      message.error("Bước chưa có id — lưu pipeline trước");
      return;
    }
    try {
      if (editingField?.id) {
        await updateField({
          id: editingField.id,
          body,
          crawlerConfigId: id,
        }).unwrap();
        message.success("Đã cập nhật field");
      } else {
        await addField({ body, crawlerConfigId: id }).unwrap();
        message.success("Đã thêm field");
      }
      setFieldModalOpen(false);
      setEditingField(null);
    } catch (e) {
      message.error(e instanceof Error ? e.message : "Lưu field thất bại");
    }
  };

  const removeField = (f: CrawlerFieldRow) => {
    if (!f.id) return;
    modal.confirm({
      title: "Xóa field?",
      content: f.fieldName,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteField({ id: f.id!, crawlerConfigId: id }).unwrap();
          message.success("Đã xóa field");
        } catch (e) {
          message.error(e instanceof Error ? e.message : "Xóa thất bại");
        }
      },
    });
  };

  const removeStep = (s: CrawlerStepModel) => {
    if (!s.id) return;
    modal.confirm({
      title: "Xóa bước?",
      content: s.stepName,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteStep({ id: s.id!, crawlerConfigId: id }).unwrap();
          message.success("Đã xóa");
        } catch (e) {
          message.error(e instanceof Error ? e.message : "Xóa thất bại");
        }
      },
    });
  };

  const stepColumns: ColumnsType<CrawlerStepModel> = [
    { title: "TT", dataIndex: "stepOrder", width: 60 },
    { title: "Tên", dataIndex: "stepName", width: 160, ellipsis: true },
    { title: "Loại", dataIndex: "stepType", width: 110, render: (t) => <Tag>{t}</Tag> },
    { title: "Method", dataIndex: "requestMethod", width: 80 },
    {
      title: "Locator",
      key: "loc",
      ellipsis: true,
      render: (_, s) => (
        <Text type="secondary">
          {(s.locatorType ?? "") + ": " + (s.locatorValue ?? "").slice(0, 80)}
        </Text>
      ),
    },
    {
      title: "Script",
      width: 140,
      ellipsis: true,
      render: (_, s) => s.customScript?.name ?? s.customScriptId ?? "—",
    },
    {
      title: "Fields",
      width: 120,
      align: "center",
      render: (_, s) => (
        <Button type="link" onClick={() => openFieldsDrawer(s)}>
          {(s.crawlerFields?.length ?? 0)} field
        </Button>
      ),
    },
    {
      title: "Thao tác",
      width: 96,
      fixed: "right",
      align: "center",
      render: (_, s) => (
        <Flex gap={4} justify="center">
          <Tooltip title="Sửa bước">
            <Button
              type="text"
              icon={<EditOutlined />}
              aria-label="Sửa bước"
              onClick={() => openEditStep(s)}
            />
          </Tooltip>
          <Tooltip title="Xóa bước">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              aria-label="Xóa bước"
              onClick={() => removeStep(s)}
            />
          </Tooltip>
        </Flex>
      ),
    },
  ];

  const tableBusy = isLoading || isFetching;

  if (!Number.isFinite(id)) {
    return (
      <AdminLayout breadcrumbItems={[{ title: "Lỗi" }]}>
        <Result
          status="error"
          title="ID không hợp lệ"
          subTitle="Quay lại danh sách để chọn cấu hình."
          extra={
            <Button type="primary" onClick={() => router.push("/crawler/config")}>
              Về danh sách
            </Button>
          }
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      breadcrumbItems={[
        { title: <Link href="/crawler/config">Cấu hình crawler</Link> },
        { title: detail?.name ?? `#${id}` },
      ]}
    >
      <Flex vertical gap="large" style={{ width: "100%" }}>
        <Flex align="center" justify="space-between" gap={16} wrap>
          <Flex align="center" gap={12} wrap>
            <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/crawler/config")}>
              Quay lại
            </Button>
            <Title level={4} style={{ margin: 0 }}>
              {detail?.name ?? "Chi tiết cấu hình"}
            </Title>
            {detail && (
              <Tag color={detail.isActive ? "success" : "default"}>
                {detail.isActive ? "Hoạt động" : "Tắt"}
              </Tag>
            )}
          </Flex>
        </Flex>

        <Card title="Thông tin cấu hình" loading={tableBusy && !detail}>
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            scrollToFirstError
          >
            <Form.Item name="name" label="Tên cấu hình" rules={[{ required: true }]}>
              <Input allowClear />
            </Form.Item>
            <Form.Item
              name="seedUrlsText"
              label="URL nguồn"
              extra="Mỗi dòng một URL, hoặc phân tách bằng dấu phẩy"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={4} placeholder="https://…" />
            </Form.Item>
            <Row gutter={[16, 8]}>
              <Col xs={24} md={12}>
                <Form.Item name="crawlerType" label="Loại crawler" rules={[{ required: true }]}>
                  <Select
                    showSearch
                    optionFilterProp="label"
                    options={CRAWLER_TYPE_OPTIONS.map((o) => ({
                      value: o.value,
                      label: `${o.label} — ${o.hint}`,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="parseType" label="Kiểu parse" rules={[{ required: true }]}>
                  <Select options={PARSE_TYPES.map((t) => ({ label: t, value: t }))} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 8]}>
              <Col xs={24} md={12}>
                <Form.Item name="sourceId" label="Nguồn dữ liệu">
                  <Select
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    placeholder="Chọn crawler_source"
                    options={sources.map((src) => ({
                      value: src.id,
                      label: `${src.name ?? src.id}${src.platform ? ` — ${src.platform}` : ""}`,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="sourceLabel"
                  label="Tên nguồn (metadata)"
                  tooltip="Ghi vào parameters.source nếu cần ghi đè"
                >
                  <Input placeholder="VnExpress, News API…" allowClear />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="minWordCount"
                  label="min_word_count"
                  tooltip="Document dưới ngưỡng bị skip (Topic Modelling)"
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="isActive" label="Hoạt động" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="frequencyHours" label="Tần suất (giờ)" rules={[{ required: true }]}>
                  <InputNumber min={0.05} step={0.5} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="maxDepth" label="maxDepth">
                  <InputNumber min={1} max={50} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="maxRetry" label="maxRetry">
                  <InputNumber min={0} max={20} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Divider orientationMargin={0}>Tham số mở rộng</Divider>
            <Form.Item
              name="parametersExtra"
              label="JSON bổ sung (parameters)"
              tooltip="Không lặp source / min_word_count — đã có ô phía trên"
            >
              <Input.TextArea rows={6} placeholder='{"lang":"vi"}' />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={() => void saveConfig()} loading={saving}>
                Lưu cấu hình
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card
          title="Pipeline — các bước"
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={openAddStep}>
              Thêm bước
            </Button>
          }
        >
          <Table<CrawlerStepModel>
            rowKey={(r) => String(r.id ?? `new-${r.stepOrder}`)}
            size="middle"
            bordered
            loading={tableBusy}
            columns={stepColumns}
            dataSource={steps}
            scroll={{ x: 1000 }}
            pagination={false}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Chưa có bước — thêm bước FETCH hoặc NAVIGATE"
                />
              ),
            }}
          />
        </Card>
      </Flex>

      <Modal
        title={editingStep?.id ? "Sửa bước" : "Thêm bước"}
        open={stepModalOpen}
        onCancel={() => {
          setStepModalOpen(false);
          setEditingStep(null);
        }}
        onOk={() => void saveStep()}
        okText="Lưu"
        cancelText="Hủy"
        width={720}
        destroyOnHidden
        centered
      >
        <Form
          form={stepForm}
          layout="vertical"
          requiredMark={false}
          scrollToFirstError
          style={{ marginTop: 8 }}
        >
          <Card
            size="small"
            title="Thông tin chính"
            styles={{ body: { paddingBottom: 8 } }}
            style={{ marginBottom: 12 }}
          >
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={8}>
                <Form.Item name="stepOrder" label="Thứ tự" rules={[{ required: true }]}>
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={16}>
                <Form.Item name="stepName" label="Tên bước" rules={[{ required: true }]}>
                  <Input allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={10}>
                <Form.Item name="stepType" label="Loại bước" rules={[{ required: true }]}>
                  <Select
                    showSearch
                    optionFilterProp="label"
                    options={STEP_TYPE_OPTIONS.map((o) => ({
                      label: o.label.toUpperCase(),
                      value: o.value,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={7}>
                <Form.Item name="requestMethod" label="Phương thức HTTP">
                  <Select options={REQUEST_METHODS.map((t) => ({ label: t, value: t }))} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={7}>
                <Form.Item name="delaySeconds" label="Delay (giây)">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card
            size="small"
            title="Locator"
            extra={<Text type="secondary">Dùng cho navigate/interact/extract</Text>}
            styles={{ body: { paddingBottom: 8 } }}
            style={{ marginBottom: 12 }}
          >
            <Row gutter={[16, 8]}>
              <Col xs={24} md={8}>
                <Form.Item name="locatorType" label="Loại locator">
                  <Select
                    allowClear
                    options={LOCATOR_TYPES.map((t) => ({ label: t, value: t }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={16}>
                <Form.Item name="locatorValue" label="Giá trị locator">
                  <Input.TextArea rows={2} placeholder="CSS / XPath / JSON path…" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card
            size="small"
            title="Nâng cao"
            styles={{ body: { paddingBottom: 8 } }}
          >
            <Form.Item name="outputUrlType" label="Kiểu URL đầu ra">
              <Input allowClear placeholder="relative, absolute…" />
            </Form.Item>
            <Form.Item name="customScriptId" label="Script tùy chỉnh">
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder="Chọn script"
                options={scripts.map((s) => ({
                  value: s.id,
                  label: `${s.name ?? s.id} (${s.language ?? "?"})`,
                }))}
              />
            </Form.Item>
            <Form.Item name="extraConfigText" label="Cấu hình nâng cao (JSON)">
              <Input.TextArea rows={5} placeholder='{"headers":{}}' />
            </Form.Item>
          </Card>
        </Form>
      </Modal>

      <Drawer
        title={
          fieldsDrawerStep
            ? `Danh sách field — ${fieldsDrawerStep.stepName ?? "bước"} (#${fieldsDrawerStep.stepOrder})`
            : "Field"
        }
        width={720}
        open={!!fieldsDrawerStep}
        destroyOnHidden
        onClose={() => {
          setFieldsDrawerStep(null);
          setEditingField(null);
          setFieldModalOpen(false);
        }}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={!fieldsDrawerStep?.id}
            onClick={openAddField}
          >
            Thêm trường
          </Button>
        }
        styles={{ body: { paddingBottom: 24 } }}
      >
        {!fieldsDrawerStep?.id && (
          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
            message="Lưu cấu hình và tạo bước trước khi thêm field."
          />
        )}
        <Table<CrawlerFieldRow>
          rowKey={(r) => String(r.id ?? r.fieldName)}
          size="small"
          bordered
          pagination={false}
          dataSource={fieldsDrawerStep?.crawlerFields ?? []}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có field cho bước này"
              />
            ),
          }}
          columns={[
            { title: "Tên", dataIndex: "fieldName", width: 120, ellipsis: true },
            { title: "Kiểu", dataIndex: "fieldType", width: 90 },
            {
              title: "extract_path",
              dataIndex: "extractPath",
              ellipsis: true,
              render: (t: string) => t || "—",
            },
            {
              title: "transform",
              dataIndex: "transformRule",
              width: 120,
              ellipsis: true,
              render: (t: string) => t || "—",
            },
            {
              title: "Bắt buộc",
              dataIndex: "isRequired",
              width: 72,
              align: "center",
              render: (v: boolean) => (v ? <Tag color="processing">Có</Tag> : "—"),
            },
            {
              title: "Thao tác",
              width: 96,
              align: "center",
              fixed: "right",
              render: (_, f) => (
                <Flex gap={4} justify="center">
                  <Tooltip title="Sửa field">
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => openEditField(f)}
                    />
                  </Tooltip>
                  <Tooltip title="Xóa field">
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeField(f)}
                    />
                  </Tooltip>
                </Flex>
              ),
            },
          ]}
        />
      </Drawer>

      <FieldFormModal
        open={fieldModalOpen && !!fieldsDrawerStep?.id}
        title={editingField?.id ? "Sửa field" : "Thêm trường"}
        confirmLoading={addingField || updatingField}
        crawlerStepId={fieldsDrawerStep?.id ?? 0}
        initial={editingField}
        onCancel={() => {
          setFieldModalOpen(false);
          setEditingField(null);
        }}
        onSubmit={saveField}
      />
    </AdminLayout>
  );
}
