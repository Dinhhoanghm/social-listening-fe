import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Spin, message, Image, List, Tag, Space } from "antd";
import { ArrowLeftOutlined, EyeOutlined, FileImageOutlined, FileTextOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import moment from "moment";

const { Title, Text } = Typography;

interface CrawledChapterDetailProps {
  comicId: string;
  chapterId: string;
}

interface CrawledChapter {
  id: number;
  comicId: number;
  chapterNumber: number;
  title?: string;
  viewCount: number;
  detailUrl?: string;
  pages?: CrawledChapterPage[];
  createdAt: Date;
  updatedAt: Date;
}

interface CrawledChapterPage {
  id: number;
  chapterId: number;
  pageNumber: number;
  contentType: string;
  imageUrl?: string;
  textContent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function CrawledChapterDetail({ comicId, chapterId }: CrawledChapterDetailProps) {
  const router = useRouter();
  const [chapter, setChapter] = useState<CrawledChapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChapterDetail();
  }, [chapterId]);

  const fetchChapterDetail = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch(`/api/crawled-comics/${comicId}/chapters/${chapterId}`);
      if (response.ok) {
        const data = await response.json();
        setChapter(data);
      } else {
        message.error("Không thể tải thông tin chương");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tải dữ liệu");
      console.error("Error fetching chapter detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push(`/crawler/crawled-comic/${comicId}`);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <Card>
        <Text>Không tìm thấy chương</Text>
      </Card>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={handleBack}
        style={{ marginBottom: "16px" }}
      >
        Quay lại danh sách chương
      </Button>

      <Card style={{ marginBottom: "24px" }}>
        <Title level={3}>
          Chương {chapter.chapterNumber}
          {chapter.title && `: ${chapter.title}`}
        </Title>
        
        <Space>
          <Tag icon={<EyeOutlined />}>
            {Number(chapter.viewCount).toLocaleString()} lượt xem
          </Tag>
          <Text type="secondary">
            Tạo: {moment(chapter.createdAt).format("DD/MM/YYYY HH:mm")}
          </Text>
          <Text type="secondary">
            Cập nhật: {moment(chapter.updatedAt).format("DD/MM/YYYY HH:mm")}
          </Text>
        </Space>

        {chapter.detailUrl && (
          <div style={{ marginTop: "8px" }}>
            <Text strong>URL nguồn: </Text>
            <Text code>{chapter.detailUrl}</Text>
          </div>
        )}
      </Card>

      <Card title={`Danh sách trang (${chapter.pages?.length || 0})`}>
        {chapter.pages && chapter.pages.length > 0 ? (
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 4,
              xxl: 5,
            }}
            dataSource={chapter.pages}
            renderItem={(page) => (
              <List.Item>
                <Card
                  size="small"
                  title={
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {page.contentType === "image" ? (
                        <FileImageOutlined />
                      ) : (
                        <FileTextOutlined />
                      )}
                      <Text>Trang {page.pageNumber}</Text>
                    </div>
                  }
                  extra={
                    <Tag size="small">
                      {page.contentType}
                    </Tag>
                  }
                >
                  {page.contentType === "image" && page.imageUrl ? (
                    <div style={{ textAlign: "center" }}>
                      <Image
                        width="100%"
                        src={page.imageUrl}
                        alt={`Page ${page.pageNumber}`}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1xkE8M+b3UBERHhERMZmRGS4Q0RERERkRkZGREZGRMZGRGREREZERkZGREZER"
                        style={{ maxHeight: "300px", objectFit: "contain" }}
                      />
                    </div>
                  ) : page.contentType === "text" && page.textContent ? (
                    <div
                      style={{
                        padding: "12px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "6px",
                        maxHeight: "200px",
                        overflow: "auto",
                      }}
                    >
                      <Text style={{ whiteSpace: "pre-wrap", fontSize: "12px" }}>
                        {page.textContent}
                      </Text>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <Text type="secondary">Không có nội dung</Text>
                    </div>
                  )}

                  <div style={{ marginTop: "8px", fontSize: "12px" }}>
                    <Text type="secondary">
                      {moment(page.createdAt).format("DD/MM/YY HH:mm")}
                    </Text>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Text type="secondary">Không có trang nào</Text>
          </div>
        )}
      </Card>
    </div>
  );
}