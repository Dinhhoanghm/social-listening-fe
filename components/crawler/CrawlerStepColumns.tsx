import { Button, Flex, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { STEP_TYPE_OPTIONS } from "@/lib/constants/crawler";
import type { CrawlerStepModel } from "@/types/crawler";

export type CrawlerStepColumnHandlers = {
  onOpenLocators: (step: CrawlerStepModel) => void;
  onOpenFields: (step: CrawlerStepModel) => void;
  onOpenActions: (step: CrawlerStepModel) => void;
  onEditStep: (step: CrawlerStepModel) => void;
  onRemoveStep: (step: CrawlerStepModel) => void;
};

export default function CreateCrawlerStepColumns(
  h: CrawlerStepColumnHandlers,
): ColumnsType<CrawlerStepModel> {
  return [
    { title: "TT", dataIndex: "stepOrder", width: 60 },
    { title: "Tên", dataIndex: "stepName", width: 160, ellipsis: true },
    {
      title: "Loại",
      dataIndex: "stepType",
      width: 120,
      render: (t: string) => {
        const opt = STEP_TYPE_OPTIONS.find((o) => o.value === t);
        return <Tag title={opt?.hint}>{opt?.label ?? t}</Tag>;
      },
    },
    { title: "Method", dataIndex: "requestMethod", width: 80 },
    {
      title: "Locators",
      width: 110,
      align: "center",
      render: (_, s) => (
        <Button type="link" onClick={() => h.onOpenLocators(s)}>
          {s.locators?.length ?? 0} locator
        </Button>
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
        <Button type="link" onClick={() => h.onOpenFields(s)}>
          {s.crawlerFields?.length ?? 0} field
        </Button>
      ),
    },
    {
      title: "Actions",
      width: 110,
      align: "center",
      render: (_, s) => (
        <Button type="link" onClick={() => h.onOpenActions(s)}>
          {s.actions?.length ?? 0} action
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
              onClick={() => h.onEditStep(s)}
            />
          </Tooltip>
          <Tooltip title="Xóa bước">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              aria-label="Xóa bước"
              onClick={() => h.onRemoveStep(s)}
            />
          </Tooltip>
        </Flex>
      ),
    },
  ];
}
