import { Button, Flex, Tag, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title } = Typography;

type Props = {
  title: string;
  isActive?: boolean;
  showStatusTag: boolean;
  onBack: () => void;
};

export default function CrawlerConfigDetailHeader({
  title,
  isActive,
  showStatusTag,
  onBack,
}: Props) {
  return (
    <Flex align="center" justify="space-between" gap={16} wrap>
      <Flex align="center" gap={12} wrap>
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
          Quay lại
        </Button>
        <Title level={4} style={{ margin: 0 }}>
          {title}
        </Title>
        {showStatusTag && (
          <Tag color={isActive ? "success" : "warning"}>
            {isActive ? "Hoạt động" : "Tắt"}
          </Tag>
        )}
      </Flex>
    </Flex>
  );
}
