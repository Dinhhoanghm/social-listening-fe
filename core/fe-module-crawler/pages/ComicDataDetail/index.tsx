import React, { useEffect, useState } from "react";
import { Card, Typography, Tag, Image, Button, Spin, message, Descriptions } from "antd";
import { ArrowLeftOutlined, EyeOutlined, LinkOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;

interface ComicDataDetailProps {
  comicDataId: string;
}

interface ComicData {
  id: number;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  status: string;
  isActive: boolean;
  createdAt: Date;
  creator?: string;
  updater?: string;
  updatedAt: Date;
}

export default function ComicDataDetail({ comicDataId }: ComicDataDetailProps) {
  const router = useRouter();
  const [comicData, setComicData] = useState<ComicData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComicDataDetail();
  }, [comicDataId]);

  const fetchComicDataDetail = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch(`/api/comic-data/${comicDataId}`);
      if (response.ok) {
        const data = await response.json();
        setComicData(data);
      } else {
        message.error("Không thể tải thông tin dữ liệu truyện");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tải dữ liệu");
      console.error("Error fetching comic data detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/crawler/comic-data");
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!comicData) {
    return (
      <Card>
        <Text>Không tìm thấy dữ liệu truyện</Text>
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
        Quay lại
      </Button>

      <Card>
        <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
          <Image
            width={200}
            height={280}
            src={comicData.imageUrl}
            alt={comicData.title}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1xkE8M+b3UBERHhERMZmRGS4Q0RERERkRkZGREZGRMZGRGREREZERkZGREZER"
          />
          <div style={{ flex: 1 }}>
            <Title level={2}>{comicData.title}</Title>
            
            <div style={{ marginBottom: "16px" }}>
              <Tag color={comicData.isActive ? "green" : "red"}>
                {comicData.isActive ? "ĐANG HOẠT ĐỘNG" : "DỪNG HOẠT ĐỘNG"}
              </Tag>
              <Tag color={comicData.status === "ongoing" ? "blue" : "green"}>
                {comicData.status.toUpperCase()}
              </Tag>
            </div>

            {comicData.description && (
              <div style={{ marginBottom: "16px" }}>
                <Text strong>Mô tả: </Text>
                <div 
                  style={{ 
                    marginTop: "8px",
                    padding: "12px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "6px",
                    border: "1px solid #e0e0e0"
                  }}
                  dangerouslySetInnerHTML={{ __html: comicData.description }}
                />
              </div>
            )}

            <div style={{ marginBottom: "8px" }}>
              <Text strong>URL nguồn: </Text>
              <Button 
                type="link" 
                icon={<LinkOutlined />}
                onClick={() => openUrl(comicData.url)}
                style={{ padding: 0 }}
              >
                {comicData.url}
              </Button>
            </div>
          </div>
        </div>

        <Descriptions bordered column={2}>
          <Descriptions.Item label="ID">
            {comicData.id}
          </Descriptions.Item>
          
          <Descriptions.Item label="Trạng thái hoạt động">
            <Tag color={comicData.isActive ? "green" : "red"}>
              {comicData.isActive ? "Đang hoạt động" : "Dừng hoạt động"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái truyện">
            <Tag color={comicData.status === "ongoing" ? "blue" : "green"}>
              {comicData.status === "ongoing" ? "Đang cập nhật" : "Hoàn thành"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Ngày tạo">
            {moment(comicData.createdAt).format("DD/MM/YYYY HH:mm:ss")}
          </Descriptions.Item>

          <Descriptions.Item label="Người tạo">
            {comicData.creator || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Cập nhật cuối">
            {moment(comicData.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
          </Descriptions.Item>

          <Descriptions.Item label="Người cập nhật">
            {comicData.updater || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="URL hình ảnh" span={2}>
            <Button 
              type="link" 
              icon={<LinkOutlined />}
              onClick={() => openUrl(comicData.imageUrl)}
              style={{ padding: 0 }}
            >
              {comicData.imageUrl}
            </Button>
          </Descriptions.Item>

          {comicData.description && (
            <Descriptions.Item label="Mô tả đầy đủ" span={2}>
              <div 
                style={{ 
                  maxHeight: "300px",
                  overflow: "auto",
                  padding: "12px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "6px",
                  border: "1px solid #e0e0e0"
                }}
                dangerouslySetInnerHTML={{ __html: comicData.description }}
              />
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </div>
  );
}