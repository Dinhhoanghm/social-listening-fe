import React, { useEffect } from "react";
import { Modal, Descriptions, Typography, Card, Divider, Tag, Row, Col, Spin } from "antd";
import { CrawlerConfig, ItemPath } from "../../constants/type";
import { useLazyGetCrawlerConfigDetailQuery } from "../../apis";

const { Title, Text } = Typography;

interface CrawlerConfigDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: CrawlerConfig | null;
}

const renderItemPath = (path: ItemPath | undefined, label: string) => {
  if (!path) return null;
  
  return (
    <Card size="small" style={{ marginBottom: 8 }}>
      <Row gutter={16}>
        <Col span={8}>
          <Text strong>{label}:</Text>
        </Col>
        <Col span={16}>
          <div>
            <Tag color="blue">{path.locatorType}</Tag>
            <Text code>{path.locatorValue}</Text>
            {path.attribute && (
              <>
                <br />
                <Text type="secondary">Attribute: </Text>
                <Text code>{path.attribute}</Text>
              </>
            )}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

const CrawlerConfigDetailModal: React.FC<CrawlerConfigDetailModalProps> = ({
  open,
  onClose,
  data,
}) => {
  const [getDetail, { data: detailData, isLoading }] = useLazyGetCrawlerConfigDetailQuery();

  useEffect(() => {
    if (open && data?.id) {
      getDetail({ id: data.id });
    }
  }, [open, data?.id, getDetail]);

  if (!data) return null;

  const displayData = detailData || data;

  return (
    <Modal
      title={<Title level={4}>Chi tiết cấu hình cào: {data.name}</Title>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
    >
      <Spin spinning={isLoading}>
        <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
        {/* Basic Information */}
        <Card title="Thông tin cơ bản" size="small" style={{ marginBottom: 16 }}>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Tên cấu hình">
              <Text strong>{displayData.name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="URL nguồn">
              <Text copyable ellipsis={{ tooltip: displayData.url }}>
                {displayData.url}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {displayData.isActive ? (
                <Tag color="success">ĐANG HOẠT ĐỘNG</Tag>
              ) : (
                <Tag color="error">DỪNG HOẠT ĐỘNG</Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* List View Configuration */}
        <Card title="1. Cấu hình màn hình danh sách" size="small" style={{ marginBottom: 16 }}>
          {renderItemPath(displayData.titlePath, "Đường dẫn tiêu đề")}
          {renderItemPath(displayData.imageUrlPath, "Đường dẫn hình ảnh")}
          {renderItemPath(displayData.detailUrlPath, "Đường dẫn chi tiết")}
          {renderItemPath(displayData.lastestChapterPath, "Đường dẫn chapter mới nhất")}
          {renderItemPath(displayData.nextPagePath, "Đường dẫn trang tiếp theo")}
          
          {!displayData.titlePath && !displayData.imageUrlPath && !displayData.detailUrlPath && 
           !displayData.lastestChapterPath && !displayData.nextPagePath && (
            <Text type="secondary" italic>Chưa có cấu hình nào</Text>
          )}
        </Card>

        {/* Detail View Configuration */}
        <Card title="2. Cấu hình màn hình chi tiết" size="small" style={{ marginBottom: 16 }}>
          {renderItemPath(displayData.crawlerDetail?.titlePath, "Đường dẫn tiêu đề")}
          {renderItemPath(displayData.crawlerDetail?.descriptionPath, "Đường dẫn mô tả")}
          {renderItemPath(displayData.crawlerDetail?.imageUrlPath, "Đường dẫn hình ảnh")}
          {renderItemPath(displayData.crawlerDetail?.statusPath, "Đường dẫn trạng thái")}
          {renderItemPath(displayData.crawlerDetail?.viewPath, "Đường dẫn lượt xem")}
          {renderItemPath(displayData.crawlerDetail?.tagsPath, "Đường dẫn thẻ tag")}
          {renderItemPath(displayData.crawlerDetail?.chaptersPath, "Đường dẫn danh sách chapter")}
          {renderItemPath(displayData.crawlerDetail?.chapterNamePath, "Đường dẫn tên chapter")}
          {renderItemPath(displayData.crawlerDetail?.chapterUrlPath, "Đường dẫn URL chapter")}
          {renderItemPath(displayData.crawlerDetail?.chapterNumberPath, "Đường dẫn số chapter")}
          
          {displayData.crawlerDetail?.chapterNumberParser && (
            <Card size="small" style={{ marginBottom: 8 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Text strong>Parser số chapter:</Text>
                </Col>
                <Col span={16}>
                  <Text code>{displayData.crawlerDetail.chapterNumberParser}</Text>
                </Col>
              </Row>
            </Card>
          )}
          
          {renderItemPath(displayData.crawlerDetail?.chapterPagesPath, "Đường dẫn danh sách trang")}
          {renderItemPath(displayData.crawlerDetail?.pageNumberPath, "Đường dẫn số trang")}
          {renderItemPath(displayData.crawlerDetail?.pageNumberParser, "Parser số trang")}
          {renderItemPath(displayData.crawlerDetail?.pageNumberImagePath, "Đường dẫn hình ảnh trang")}
          {renderItemPath(displayData.crawlerDetail?.pageNumberContentPath, "Đường dẫn lấy nội dung")}
          
          {!displayData.crawlerDetail?.titlePath && !displayData.crawlerDetail?.descriptionPath && !displayData.crawlerDetail?.imageUrlPath && 
           !displayData.crawlerDetail?.statusPath && !displayData.crawlerDetail?.viewPath && !displayData.crawlerDetail?.tagsPath && 
           !displayData.crawlerDetail?.chaptersPath && !displayData.crawlerDetail?.chapterNamePath && !displayData.crawlerDetail?.chapterUrlPath && 
           !displayData.crawlerDetail?.chapterNumberPath && !displayData.crawlerDetail?.chapterPagesPath && !displayData.crawlerDetail?.pageNumberPath && 
           !displayData.crawlerDetail?.pageNumberParser && !displayData.crawlerDetail?.pageNumberImagePath && !displayData.crawlerDetail?.pageNumberContentPath && (
            <Text type="secondary" italic>Chưa có cấu hình nào</Text>
          )}
        </Card>
        </div>
      </Spin>
    </Modal>
  );
};

export default CrawlerConfigDetailModal;