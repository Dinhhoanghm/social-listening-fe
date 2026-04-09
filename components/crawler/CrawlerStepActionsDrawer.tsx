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
  CrawlerStepActionRow,
  CrawlerStepModel,
} from "@/types/crawler";

const { Text } = Typography;

const ACTION_TYPE_COLORS: Record<string, string> = {
  scroll:       "blue",
  click:        "green",
  click_all:    "cyan",
  repeat_click: "orange",
  input:        "purple",
  wait:         "default",
};

const actionColumns = (
  onEdit: (a: CrawlerStepActionRow) => void,
  onRemove: (a: CrawlerStepActionRow) => void,
): ColumnsType<CrawlerStepActionRow> => [
  {
    title: "TT",
    dataIndex: "actionOrder",
    width: 50,
    align: "center",
  },
  {
    title: "Loại",
    dataIndex: "actionType",
    width: 120,
    render: (t: string) => (
      <Tag color={ACTION_TYPE_COLORS[t] ?? "default"}>{t}</Tag>
    ),
  },
  {
    title: "Locator",
    width: 80,
    render: (_, a) =>
      a.locatorType ? <Tag>{a.locatorType}</Tag> : <Text type="secondary">—</Text>,
  },
  {
    title: "Selector / Value",
    ellipsis: true,
    render: (_, a) => {
      const v = a.locatorValue ?? a.value;
      return v ? (
        <Text code style={{ fontSize: 12 }}>
          {v}
        </Text>
      ) : (
        <Text type="secondary">—</Text>
      );
    },
  },
  {
    title: "times",
    dataIndex: "times",
    width: 60,
    align: "center",
    render: (t?: number) => t ?? "—",
  },
  {
    title: "delay",
    dataIndex: "delayMs",
    width: 70,
    align: "center",
    render: (t?: number) => (t != null ? `${t}ms` : "—"),
  },
  {
    title: "wait",
    dataIndex: "waitMs",
    width: 70,
    align: "center",
    render: (t?: number) => (t != null ? `${t}ms` : "—"),
  },
  {
    title: "Thao tác",
    width: 90,
    align: "center",
    fixed: "right",
    render: (_, a) => (
      <Flex gap={4} justify="center">
        <Tooltip title="Sửa action">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(a)}
          />
        </Tooltip>
        <Tooltip title="Xóa action">
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onRemove(a)}
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
  onAddAction: () => void;
  onEditAction: (a: CrawlerStepActionRow) => void;
  onRemoveAction: (a: CrawlerStepActionRow) => void;
};

export default function CrawlerStepActionsDrawer({
  open,
  step,
  onClose,
  onAddAction,
  onEditAction,
  onRemoveAction,
}: Props) {
  const sorted = [...(step?.actions ?? [])].sort(
    (a, b) => (a.actionOrder ?? 0) - (b.actionOrder ?? 0),
  );

  return (
    <Drawer
      title={
        step
          ? `Actions — ${step.stepName ?? "bước"} (#${step.stepOrder})`
          : "Actions"
      }
      width={760}
      open={open}
      destroyOnHidden
      onClose={onClose}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          disabled={!step?.id}
          onClick={onAddAction}
        >
          Thêm action
        </Button>
      }
      styles={{ body: { paddingBottom: 24 } }}
    >
      {!step?.id && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message="Lưu bước trước khi thêm action."
        />
      )}
      <Table<CrawlerStepActionRow>
        rowKey={(r) => String(r.id ?? r.actionOrder)}
        size="small"
        bordered
        pagination={false}
        scroll={{ x: 680 }}
        dataSource={sorted}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa có action — thêm scroll, click_all, repeat_click…"
            />
          ),
        }}
        columns={actionColumns(onEditAction, onRemoveAction)}
      />
    </Drawer>
  );
}
