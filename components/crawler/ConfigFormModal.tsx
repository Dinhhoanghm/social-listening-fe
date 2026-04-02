"use client";

import { Form, Input, InputNumber, Modal, Select, Switch } from "antd";
import { useEffect, useMemo } from "react";
import {
  CRAWLER_TYPE_OPTIONS,
  PARSE_TYPES,
} from "@/lib/constants/crawler";
import { useSearchCrawlerSourcesQuery } from "@/lib/store/apis/crawlerApi";
import { mergeParametersJson } from "@/lib/parameters";
import type { CrawlerConfigRequestBody } from "@/types/crawler";

type Props = {
  open: boolean;
  title: string;
  confirmLoading?: boolean;
  onCancel: () => void;
  onSubmit: (values: CrawlerConfigRequestBody) => void | Promise<void>;
};

export default function ConfigFormModal({
  open,
  title,
  confirmLoading,
  onCancel,
  onSubmit,
}: Props) {
  const [form] = Form.useForm();
  const sourceSearchBody = useMemo(() => ({ page: 1, pageSize: 500 }), []);
  const { data: sourcesPage } = useSearchCrawlerSourcesQuery(sourceSearchBody, {
    skip: !open,
  });
  const sources = sourcesPage?.items ?? [];

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        name: "",
        sourceId: undefined,
        seedUrlsText: "",
        crawlerType: "http",
        parseType: "HTML",
        sourceLabel: "",
        minWordCount: 100,
        isActive: true,
        frequencyHours: 1,
        maxDepth: 3,
        maxRetry: 3,
        parametersExtra: "",
      });
    }
  }, [open, form]);

  const handleOk = async () => {
    const v = await form.validateFields();
    const seedUrls = String(v.seedUrlsText || "")
      .split(/[\n,]+/)
      .map((s: string) => s.trim())
      .filter(Boolean);
    const payload: Record<string, unknown> = {};
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
        /* ignore invalid JSON; structured fields still saved */
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
    await onSubmit(body);
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      okText="Tạo"
      cancelText="Hủy"
      width={640}
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
        <Form.Item
          name="name"
          label="Tên cấu hình"
          rules={[{ required: true, message: "Nhập tên" }]}
        >
          <Input placeholder="Ví dụ: VnExpress — trang chủ" />
        </Form.Item>
        <Form.Item name="sourceId" label="Nguồn dữ liệu (crawler_source)">
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="Chọn từ danh sách nguồn"
            options={sources.map((src) => ({
              value: src.id,
              label: `${src.name ?? src.id}${src.platform ? ` — ${src.platform}` : ""}`,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="seedUrlsText"
          label="URL nguồn (mỗi dòng một URL)"
          rules={[{ required: true, message: "Nhập ít nhất một URL" }]}
        >
          <Input.TextArea rows={3} placeholder="https://..." />
        </Form.Item>
        <Form.Item name="crawlerType" label="Loại crawler" rules={[{ required: true }]}>
          <Select
            options={CRAWLER_TYPE_OPTIONS.map((o) => ({
              value: o.value,
              label: `${o.label} — ${o.hint}`,
            }))}
          />
        </Form.Item>
        <Form.Item name="parseType" label="Kiểu parse" rules={[{ required: true }]}>
          <Select options={PARSE_TYPES.map((t) => ({ label: t, value: t }))} />
        </Form.Item>
        <Form.Item name="sourceLabel" label="Tên nguồn (metadata JSON)">
          <Input placeholder="Bổ sung parameters.source nếu cần" />
        </Form.Item>
        <Form.Item
          name="minWordCount"
          label="Số từ tối thiểu (min_word_count)"
          tooltip="Document dưới ngưỡng sẽ bị skip ở ContentExtractor"
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
          <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
        </Form.Item>
        <Form.Item
          name="frequencyHours"
          label="Tần suất (giờ)"
          rules={[{ required: true }]}
        >
          <InputNumber min={0.05} step={0.5} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="maxDepth" label="maxDepth">
          <InputNumber min={1} max={50} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="maxRetry" label="maxRetry">
          <InputNumber min={0} max={20} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="parametersExtra"
          label="Tham số JSON bổ sung (tuỳ chọn)"
          tooltip="Gộp vào parameters; ví dụ headers, lang, rule lọc…"
        >
          <Input.TextArea
            rows={4}
            placeholder='{"lang":"vi"}'
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
