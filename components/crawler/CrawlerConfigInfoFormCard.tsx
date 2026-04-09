import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
  Typography,
} from "antd";
import type { FormInstance } from "antd";
import { CRAWLER_TYPE_OPTIONS, PARSE_TYPES } from "@/lib/constants/crawler";
import type { CrawlerSourceRow } from "@/types/crawler";

const { Title } = Typography;

type Props = {
  form: FormInstance;
  sources: CrawlerSourceRow[];
  loading: boolean;
  saving: boolean;
  onSave: () => void | Promise<void>;
};

export default function CrawlerConfigInfoFormCard({
  form,
  sources,
  loading,
  saving,
  onSave,
}: Props) {
  return (
    <Card
      title={
        <Title level={4} style={{ margin: 0 }}>
          Thông tin cấu hình
        </Title>
      }
      loading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        scrollToFirstError
      >
        <Row gutter={[100, 8]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label="Tên cấu hình"
              rules={[{ required: true }]}
            >
              <Input allowClear />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={10}>
            <Form.Item
              name="isActive"
              label="Hoạt động"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

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
            <Form.Item
              name="crawlerType"
              label="Loại crawler"
              rules={[{ required: true }]}
            >
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
            <Form.Item
              name="parseType"
              label="Kiểu parse"
              rules={[{ required: true }]}
            >
              <Select
                options={PARSE_TYPES.map((t) => ({ label: t, value: t }))}
              />
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
        </Row>
        <Row gutter={[16, 8]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="minWordCount"
              label="min_word_count"
              tooltip="Document dưới ngưỡng bị skip (Topic Modelling)"
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="frequencyHours"
              label="Tần suất (giờ)"
              rules={[{ required: true }]}
            >
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
          <Button type="primary" onClick={() => void onSave()} loading={saving}>
            Lưu cấu hình
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
