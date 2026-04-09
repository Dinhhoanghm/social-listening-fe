import {
  Alert,
  Button,
  Drawer,
  Empty,
  Flex,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type {
  CrawlerStepLocatorRow,
  CrawlerStepModel,
} from "@/types/crawler";

const { Text } = Typography;

const locatorColumns = (
  onEdit: (loc: CrawlerStepLocatorRow) => void,
  onRemove: (loc: CrawlerStepLocatorRow) => void,
): ColumnsType<CrawlerStepLocatorRow> => [
  {
    title: "TT",
    dataIndex: "locatorOrder",
    width: 50,
    align: "center",
  },
  {
    title: "Loại",
    dataIndex: "locatorType",
    width: 90,
    render: (t: string) => <Tag>{t}</Tag>,
  },
  {
    title: "Giá trị",
    dataIndex: "locatorValue",
    ellipsis: true,
    render: (t: string) => (
      <Text code style={{ fontSize: 12 }}>
        {t}
      </Text>
    ),
  },
  {
    title: "target_step",
    dataIndex: "targetStep",
    width: 90,
    render: (t: string) => t || "next",
  },
  {
    title: "filter_regex",
    dataIndex: "filterRegex",
    width: 120,
    ellipsis: true,
    render: (t: string) => t || "—",
  },
  {
    title: "Thao tác",
    width: 90,
    align: "center",
    fixed: "right",
    render: (_, loc) => (
      <Flex gap={4} justify="center">
        <Tooltip title="Sửa locator">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(loc)}
          />
        </Tooltip>
        <Tooltip title="Xóa locator">
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onRemove(loc)}
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
  onAddLocator: () => void;
  onEditLocator: (loc: CrawlerStepLocatorRow) => void;
  onRemoveLocator: (loc: CrawlerStepLocatorRow) => void;
};

export default function CrawlerStepLocatorsDrawer({
  open,
  step,
  onClose,
  onAddLocator,
  onEditLocator,
  onRemoveLocator,
}: Props) {
  return (
    <Drawer
      title={
        step
          ? `Locators — ${step.stepName ?? "bước"} (#${step.stepOrder})`
          : "Locators"
      }
      width={680}
      open={open}
      destroyOnHidden
      onClose={onClose}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          disabled={!step?.id}
          onClick={onAddLocator}
        >
          Thêm locator
        </Button>
      }
      styles={{ body: { paddingBottom: 24 } }}
    >
      {!step?.id && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message="Lưu bước trước khi thêm locator."
        />
      )}
      <Table<CrawlerStepLocatorRow>
        rowKey={(r) => String(r.id ?? r.locatorOrder)}
        size="small"
        bordered
        pagination={false}
        dataSource={step?.locators ?? []}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa có locator cho bước này"
            />
          ),
        }}
        columns={locatorColumns(onEditLocator, onRemoveLocator)}
      />
    </Drawer>
  );
}
