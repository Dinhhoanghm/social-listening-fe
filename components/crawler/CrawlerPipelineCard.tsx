import { Button, Card, Empty, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import type { CrawlerStepModel } from "@/types/crawler";

type Props = {
  steps: CrawlerStepModel[];
  loading: boolean;
  columns: ColumnsType<CrawlerStepModel>;
  onAddStep: () => void;
};

export default function CrawlerPipelineCard({
  steps,
  loading,
  columns,
  onAddStep,
}: Props) {
  return (
    <Card
      title="Pipeline — các bước"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddStep}>
          Thêm bước
        </Button>
      }
    >
      <Table<CrawlerStepModel>
        rowKey={(r) => String(r.id ?? `new-${r.stepOrder}`)}
        size="middle"
        bordered
        loading={loading}
        columns={columns}
        dataSource={steps}
        scroll={{ x: 1000 }}
        pagination={false}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa có bước — thêm bước FETCH hoặc NAVIGATE"
            />
          ),
        }}
      />
    </Card>
  );
}
