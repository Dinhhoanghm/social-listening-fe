import type { CrawlerCustomScriptRow } from "@/types/crawler";
import type { FormInstance } from "antd";
import {
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import {
  REQUEST_METHODS,
  STEP_TYPE_OPTIONS,
  WEB_TYPE_OPTIONS,
} from "@/lib/constants/crawler";
import { useState } from "react";

const { Text, Title } = Typography;

type Props = {
  stepModalOpen: boolean;
  stepForm: FormInstance;
  watchedStepType?: string;
  watchedBrowser?: string;
  scripts: CrawlerCustomScriptRow[];
  onCancelStepModal: () => void;
  onSaveStep: () => void | Promise<void>;
};

export default function CrawlerStepConfig({
  stepModalOpen,
  stepForm,
  watchedStepType,
  watchedBrowser,
  scripts,
  onCancelStepModal,
  onSaveStep,
}: Props) {
  const [isDynamic, setIsDynamic] = useState(false);

  return (
    <>
      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            Cấu hình bước
          </Title>
        }
        open={stepModalOpen}
        onCancel={onCancelStepModal}
        onOk={() => void onSaveStep()}
        okText="Lưu"
        cancelText="Hủy"
        width={720}
        destroyOnHidden
        centered
        styles={{ body: { paddingTop: 8 } }}
      >
        <Form
          form={stepForm}
          layout="vertical"
          requiredMark={false}
          scrollToFirstError
          style={{ marginTop: 4 }}
        >
          <div
            style={{
              border: "1px solid var(--ant-colorBorderSecondary)",
              borderRadius: 10,
              padding: "12px 14px 4px",
              marginBottom: 12,
              background: "var(--ant-colorFillQuaternary)",
            }}
          >
            <Text
              strong
              style={{ display: "block", marginBottom: 10, fontSize: 18 }}
            >
              Thông tin chính
            </Text>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={6}>
                <Form.Item
                  name="stepOrder"
                  label="Thứ tự"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={6}>
                <Form.Item
                  name="stepName"
                  label="Tên bước"
                  rules={[{ required: true }]}
                >
                  <Input allowClear />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="stepType"
                  label="Loại bước"
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="label"
                    options={STEP_TYPE_OPTIONS.map((o) => ({
                      value: o.value,
                      label: o.label.toUpperCase(),
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={6}>
                <Form.Item name="requestMethod" label="Phương thức HTTP">
                  <Select
                    options={REQUEST_METHODS.map((t) => ({
                      label: t,
                      value: t,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={6}>
                <Form.Item name="delaySeconds" label="Delay (giây)">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              {["fetch"].includes(String(watchedStepType ?? "")) && (
                <>
                  <Col xs={24} sm={12}>
                    <Form.Item name="isDynamic" label="Kiểu Web">
                      <Select
                        onChange={(value) => {
                          setIsDynamic(value);
                        }}
                        allowClear
                        options={WEB_TYPE_OPTIONS.map((o) => ({
                          value: o.value,
                          label: `${o.label} — ${o.hint}`,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>
          </div>

          <div
            style={{
              border: "1px solid var(--ant-colorBorderSecondary)",
              borderRadius: 10,
              padding: "12px 14px 4px",
              background: "var(--ant-colorBgContainer)",
            }}
          >
            <Text
              strong
              style={{ display: "block", marginBottom: 10, fontSize: 18 }}
            >
              Nâng cao
            </Text>
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

            {(["interact"].includes(String(watchedStepType ?? "")) ||
              (String(watchedStepType ?? "") === "fetch" &&
                isDynamic === true)) && (
              <>
                <Divider plain style={{ marginTop: 4, marginBottom: 12 }}>
                  Trình duyệt
                </Divider>
                <Row gutter={[16, 8]}>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="browser"
                      label="Browser engine"
                      initialValue="selenium"
                    >
                      <Select
                        options={[
                          { value: "selenium", label: "Selenium (mặc định)" },
                          {
                            value: "multilogin",
                            label: "Multilogin (chống bot)",
                          },
                          {
                            value: "local_chrome",
                            label: "Local Chrome (Chrome đang mở)",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  {watchedBrowser === "multilogin" && (
                    <>
                      <Col xs={24} sm={8}>
                        <Form.Item
                          name="multiloginFolderId"
                          label="Multilogin Folder ID"
                          rules={[
                            { required: true, message: "Nhập Folder ID" },
                          ]}
                        >
                          <Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Form.Item
                          name="multiloginProfileId"
                          label="Multilogin Profile ID"
                          rules={[
                            { required: true, message: "Nhập Profile ID" },
                          ]}
                        >
                          <Input placeholder="yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy" />
                        </Form.Item>
                      </Col>
                    </>
                  )}
                </Row>
                <Divider plain style={{ marginTop: 4, marginBottom: 12 }}>
                  Login (tuỳ chọn)
                </Divider>
                <Row gutter={[16, 8]}>
                  <Col xs={24}>
                    <Form.Item name="loginUrl" label="Login URL">
                      <Input
                        placeholder="https://example.com/login"
                        allowClear
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="loginEmail" label="Email / Tài khoản">
                      <Input placeholder="user@example.com" allowClear />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="loginPassword" label="Mật khẩu">
                      <Input.Password placeholder="••••••••" />
                    </Form.Item>
                  </Col>
                </Row>
                <Divider plain style={{ marginTop: 4, marginBottom: 12 }}>
                  Script lấy selector (tuỳ chọn)
                </Divider>
                <Row gutter={[16, 8]}>
                  <Col xs={24}>
                    <Form.Item
                      name="scriptGetEmailSelector"
                      label="Script lấy email selector"
                      tooltip="JS chạy trong browser, kết thúc bằng return 'css-selector'"
                    >
                      <Input.TextArea
                        rows={3}
                        placeholder={"const el = await new Promise(resolve => {\n  const t = setInterval(() => { const e = document.querySelector('input[name=\"email\"]'); if (e) { clearInterval(t); resolve(e); } }, 500);\n  setTimeout(() => { clearInterval(t); resolve(null); }, 10000);\n});\nreturn el ? 'input[name=\"email\"]' : null;"}
                        allowClear
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      name="scriptGetPasswordSelector"
                      label="Script lấy password selector"
                      tooltip="JS chạy trong browser, kết thúc bằng return 'css-selector'"
                    >
                      <Input.TextArea
                        rows={3}
                        placeholder={"const el = await new Promise(resolve => {\n  const t = setInterval(() => { const e = document.querySelector('input[name=\"pass\"]'); if (e) { clearInterval(t); resolve(e); } }, 500);\n  setTimeout(() => { clearInterval(t); resolve(null); }, 10000);\n});\nreturn el ? 'input[name=\"pass\"]' : null;"}
                        allowClear
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      name="scriptGetSubmitSelector"
                      label="Script lấy submit selector"
                      tooltip="JS chạy trong browser, kết thúc bằng return 'css-selector'"
                    >
                      <Input.TextArea
                        rows={3}
                        placeholder={"const el = await new Promise(resolve => {\n  const t = setInterval(() => { const e = document.querySelector('button[name=\"login\"]'); if (e) { clearInterval(t); resolve(e); } }, 500);\n  setTimeout(() => { clearInterval(t); resolve(null); }, 10000);\n});\nreturn el ? 'button[name=\"login\"]' : null;"}
                        allowClear
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            <Divider plain style={{ marginTop: 4, marginBottom: 12 }}>
              Cấu hình khác (JSON)
            </Divider>
            <Form.Item name="extraConfigText" label={null}>
              <Input.TextArea
                rows={4}
                placeholder='{"scroll_times": 10, "scroll_wait_ms": 2000}'
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
}
