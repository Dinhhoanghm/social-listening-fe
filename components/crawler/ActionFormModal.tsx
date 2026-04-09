"use client";

import { Col, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import { useEffect } from "react";
import {
  ACTION_TYPE_OPTIONS,
  BROWSER_LOCATOR_TYPE_OPTIONS,
} from "@/lib/constants/crawler";
import type {
  CrawlerStepActionRequestBody,
  CrawlerStepActionRow,
} from "@/types/crawler";

const NEEDS_LOCATOR = ["click", "click_all", "repeat_click", "input"];

type Props = {
  open: boolean;
  title: string;
  confirmLoading?: boolean;
  crawlerStepId: number;
  initial?: CrawlerStepActionRow | null;
  onCancel: () => void;
  onSubmit: (body: CrawlerStepActionRequestBody) => void | Promise<void>;
};

export default function ActionFormModal({
  open,
  title,
  confirmLoading,
  crawlerStepId,
  initial,
  onCancel,
  onSubmit,
}: Props) {
  const [form] = Form.useForm();
  const watchedType: string | undefined = Form.useWatch("actionType", form);
  const needsLocator = NEEDS_LOCATOR.includes(watchedType ?? "");
  const needsTimes = ["scroll", "repeat_click"].includes(watchedType ?? "");
  const needsValue = watchedType === "input";

  useEffect(() => {
    if (!open) return;
    if (initial?.id) {
      form.setFieldsValue({
        actionOrder:    initial.actionOrder    ?? 0,
        actionType:     initial.actionType     ?? "scroll",
        locatorType:    initial.locatorType    ?? "css",
        locatorValue:   initial.locatorValue   ?? "",
        selectorScript: initial.selectorScript ?? "",
        times:          initial.times          ?? 1,
        delayMs:        initial.delayMs        ?? 500,
        waitMs:         initial.waitMs         ?? 2000,
        value:          initial.value          ?? "",
      });
    } else {
      form.setFieldsValue({
        actionOrder:    0,
        actionType:     "scroll",
        locatorType:    "css",
        locatorValue:   "",
        selectorScript: "",
        times:          1,
        delayMs:        500,
        waitMs:         2000,
        value:          "",
      });
    }
  }, [open, initial, form]);

  const handleOk = async () => {
    const v = await form.validateFields();
    const body: CrawlerStepActionRequestBody = {
      crawlerStepId,
      actionOrder:    v.actionOrder  ?? 0,
      actionType:     v.actionType,
      locatorType:    needsLocator ? v.locatorType  : undefined,
      locatorValue:   needsLocator ? v.locatorValue?.trim() : undefined,
      selectorScript: needsLocator ? (v.selectorScript?.trim() || undefined) : undefined,
      times:          needsTimes   ? (v.times ?? 1) : undefined,
      delayMs:        v.delayMs    ?? 500,
      waitMs:         needsTimes   ? (v.waitMs ?? 2000) : undefined,
      value:          needsValue   ? v.value : undefined,
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
      width={580}
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
            <Form.Item name="actionOrder" label="Thứ tự">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={16}>
            <Form.Item
              name="actionType"
              label="Loại action"
              rules={[{ required: true, message: "Chọn loại action" }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                options={ACTION_TYPE_OPTIONS.map((o) => ({
                  value: o.value,
                  label: `${o.label} — ${o.hint}`,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        {needsLocator && (
          <>
            <Row gutter={[16, 0]}>
              <Col xs={8}>
                <Form.Item
                  name="locatorType"
                  label="Locator type"
                  rules={[{ required: true, message: "Chọn locator type" }]}
                >
                  <Select
                    options={BROWSER_LOCATOR_TYPE_OPTIONS.map((o) => ({
                      value: o.value,
                      label: o.label,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={16}>
                <Form.Item
                  name="locatorValue"
                  label="Selector (tĩnh)"
                  rules={[{ required: false }]}
                  extra="CSS / XPath tìm element — dùng khi không có selector_script"
                >
                  <Input placeholder="div[role='button'], //button[contains(.,'Xem thêm')]" allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="selectorScript"
              label="Selector script (JS động)"
              tooltip="JS chạy trong browser, kết thúc bằng return 'css-or-xpath'. Nếu có, ưu tiên hơn Selector tĩnh."
              extra="Ví dụ: return document.querySelector('button[aria-label]')?.getAttribute('data-id')"
            >
              <Input.TextArea
                rows={3}
                placeholder={"// JS chạy trong browser để lấy selector động\nconst el = document.querySelector('div[role=\"button\"]');\nreturn el ? el.getAttribute('data-testid') : null;"}
                allowClear
              />
            </Form.Item>
          </>
        )}

        {needsValue && (
          <Form.Item name="value" label="Nội dung nhập (value)">
            <Input placeholder="Văn bản sẽ được gõ vào ô input" allowClear />
          </Form.Item>
        )}

        <Row gutter={[16, 0]}>
          {needsTimes && (
            <Col xs={8}>
              <Form.Item
                name="times"
                label="Số lần (times)"
                tooltip={
                  watchedType === "scroll"
                    ? "Số lần scroll"
                    : "Số lần click tối đa"
                }
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          )}
          <Col xs={needsTimes ? 8 : 12}>
            <Form.Item
              name="delayMs"
              label="delay_ms"
              tooltip="Thời gian chờ trước khi click/scroll (ms)"
            >
              <InputNumber min={0} step={100} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          {needsTimes && (
            <Col xs={8}>
              <Form.Item
                name="waitMs"
                label="wait_ms"
                tooltip="Thời gian chờ sau mỗi lần click/scroll (ms)"
              >
                <InputNumber min={0} step={100} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </Modal>
  );
}