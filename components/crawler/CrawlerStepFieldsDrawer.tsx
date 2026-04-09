import { Alert, Button, Drawer, Empty, Flex, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import type { CrawlerFieldRow, CrawlerStepModel } from "@/types/crawler";

const fieldColumns = (
  onEdit: (f: CrawlerFieldRow) => void,
  onRemove: (f: CrawlerFieldRow) => void,
): ColumnsType<CrawlerFieldRow> => [
  {
    title: "Tên",
    dataIndex: "fieldName",
    width: 120,
    ellipsis: true,
  },
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
            onClick={() => onEdit(f)}
          />
        </Tooltip>
        <Tooltip title="Xóa field">
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onRemove(f)}
          />
        </Tooltip>
      </Flex>
    ),
  },
];

type Props = {
  open: boolean;
  step: CrawlerStepModel | null;
  onClose: () => void;
  onAddField: () => void;
  onEditField: (f: CrawlerFieldRow) => void;
  onRemoveField: (f: CrawlerFieldRow) => void;
};

export default function CrawlerStepFieldsDrawer({
  open,
  step,
  onClose,
  onAddField,
  onEditField,
  onRemoveField,
}: Props) {
  return (
    <Drawer
      title={
        step
          ? `Danh sách field — ${step.stepName ?? "bước"} (#${step.stepOrder})`
          : "Field"
      }
      width={720}
      open={open}
      destroyOnHidden
      onClose={onClose}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          disabled={!step?.id}
          onClick={onAddField}
        >
          Thêm trường
        </Button>
      }
      styles={{ body: { paddingBottom: 24 } }}
    >
      {!step?.id && (
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
        dataSource={step?.crawlerFields ?? []}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa có field cho bước này"
            />
          ),
        }}
        columns={fieldColumns(onEditField, onRemoveField)}
      />
    </Drawer>
  );
}
