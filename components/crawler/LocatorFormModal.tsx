"use client";

import { Col, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import { useEffect } from "react";
import { LOCATOR_TYPE_OPTIONS } from "@/lib/constants/crawler";
import type {
  CrawlerStepLocatorRequestBody,
  CrawlerStepLocatorRow,
} from "@/types/crawler";

const TARGET_STEP_OPTIONS = [
  { value: "next", label: "next — bước tiếp theo trong pipeline" },
  { value: "current", label: "current — lặp lại bước hiện tại" },
];

type Props = {
  open: boolean;
  title: string;
  confirmLoading?: boolean;
  crawlerStepId: number;
  initial?: CrawlerStepLocatorRow | null;
  onCancel: () => void;
  onSubmit: (body: CrawlerStepLocatorRequestBody) => void | Promise<void>;
};

export default function LocatorFormModal({
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
        locatorOrder: initial.locatorOrder ?? 0,
        locatorType: initial.locatorType ?? "css",
        locatorValue: initial.locatorValue ?? "",
        targetStep: initial.targetStep ?? "next",
        filterRegex: initial.filterRegex ?? "",
      });
    } else {
      form.setFieldsValue({
        locatorOrder: 0,
        locatorType: "css",
        locatorValue: "",
        targetStep: "next",
        filterRegex: "",
      });
    }
  }, [open, initial, form]);

  const handleOk = async () => {
    const v = await form.validateFields();
    const body: CrawlerStepLocatorRequestBody = {
      crawlerStepId,
      locatorOrder: v.locatorOrder ?? 0,
      locatorType: v.locatorType,
      locatorValue: v.locatorValue.trim(),
      targetStep: v.targetStep || "next",
      filterRegex: v.filterRegex?.trim() || undefined,
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
          <Col xs={8}>
            <Form.Item name="locatorOrder" label="Thứ tự">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={16}>
            <Form.Item
              name="locatorType"
              label="Loại locator"
              rules={[{ required: true, message: "Chọn loại locator" }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                options={LOCATOR_TYPE_OPTIONS.map((o) => ({
                  value: o.value,
                  label: `${o.label} — ${o.hint}`,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="locatorValue"
          label="Giá trị locator"
          rules={[{ required: true, message: "Nhập giá trị selector" }]}
          extra="CSS selector, XPath, JSONPath, Regex… tuỳ theo loại đã chọn"
        >
          <Input.TextArea
            rows={3}
            placeholder=".article-content, //item/link, $.data[*].url…"
          />
        </Form.Item>

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="targetStep"
              label="Đích URL (target_step)"
              tooltip="URL tìm được sẽ được gửi đến bước nào trong pipeline"
            >
              <Select
                options={TARGET_STEP_OPTIONS}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <div style={{ padding: "4px 12px 8px", color: "#888", fontSize: 12 }}>
                      Hoặc nhập số thứ tự bước cụ thể
                    </div>
                  </>
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="filterRegex"
              label="filter_regex (tuỳ chọn)"
              tooltip="Regex để lọc URL trước khi enqueue"
            >
              <Input placeholder="vnexpress\.net/.+-\d+\.html" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
