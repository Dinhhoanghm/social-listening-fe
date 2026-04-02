"use client";

import {
  AutoComplete,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Switch,
} from "antd";
import { useEffect } from "react";
import { FIELD_TYPE_OPTIONS, TRANSFORM_RULE_OPTIONS } from "@/lib/constants/crawler";
import type { CrawlerFieldRequestBody, CrawlerFieldRow } from "@/types/crawler";

type Props = {
  open: boolean;
  title: string;
  confirmLoading?: boolean;
  crawlerStepId: number;
  initial?: CrawlerFieldRow | null;
  onCancel: () => void;
  onSubmit: (body: CrawlerFieldRequestBody) => void | Promise<void>;
};

export default function FieldFormModal({
  open,
  title,
  confirmLoading,
  crawlerStepId,
  initial,
  onCancel,
  onSubmit,
}: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    if (initial?.id) {
      form.setFieldsValue({
        fieldName: initial.fieldName ?? "",
        fieldType: (initial.fieldType ?? "text").toLowerCase(),
        extractPath: initial.extractPath ?? "",
        attributeName: initial.attributeName ?? "",
        transformRule: initial.transformRule ?? "",
        isRequired: initial.isRequired ?? false,
      });
    } else {
      form.setFieldsValue({
        fieldName: "",
        fieldType: "text",
        extractPath: "",
        attributeName: "",
        transformRule: "",
        isRequired: false,
      });
    }
  }, [open, initial, form]);

  const handleOk = async () => {
    const v = await form.validateFields();
    const body: CrawlerFieldRequestBody = {
      crawlerStepId,
      fieldName: v.fieldName.trim(),
      fieldType: String(v.fieldType).toLowerCase(),
      extractPath: v.extractPath?.trim() || undefined,
      attributeName: v.attributeName?.trim() || undefined,
      transformRule: v.transformRule?.trim() || undefined,
      isRequired: Boolean(v.isRequired),
    };
    await onSubmit(body);
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={() => void handleOk()}
      confirmLoading={confirmLoading}
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
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={14}>
            <Form.Item
              name="fieldName"
              label="Tên field"
              rules={[{ required: true, message: "Nhập tên field" }]}
            >
              <Input placeholder="title, body, author…" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} sm={10}>
            <Form.Item name="fieldType" label="Kiểu field" rules={[{ required: true }]}>
              <Select
                showSearch
                optionFilterProp="label"
                options={FIELD_TYPE_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="extractPath"
          label="extract_path"
          extra="CSS selector, JSON path, XPath… tùy bước EXTRACT"
        >
          <Input.TextArea rows={2} placeholder="article .content, $.data.title…" />
        </Form.Item>
        <Form.Item
          name="attributeName"
          label="attribute_name"
          extra="Ví dụ: href, data-id"
        >
          <Input placeholder="href" allowClear />
        </Form.Item>
        <Divider plain style={{ margin: "8px 0 16px" }}>
          Biến đổi
        </Divider>
        <Form.Item
          name="transformRule"
          label="transform_rule"
          tooltip="Ví dụ: clean_html, join — backend có thể hỗ trợ chuỗi nhiều bước"
        >
          <AutoComplete
            options={TRANSFORM_RULE_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
            placeholder="clean_html"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item name="isRequired" label="Bắt buộc" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}
