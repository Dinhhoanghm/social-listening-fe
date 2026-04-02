import React, { useEffect, useState } from "react";
import { Card, Typography, Tag, Image, Table, Button, Spin, message, Modal, Form, Input } from "antd";
import { ArrowLeftOutlined, EyeOutlined, UnlockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import moment from "moment";
import { useLazyGetCrawledComicDetailQuery, useUnlockCrawledComicChapterMutation, useUnlockCrawledComicMutation } from "../../apis";

const { Title, Text, Paragraph } = Typography;

interface CrawledComicDetailProps {
  comicId: string;
}

interface CrawledComic {
  id: number;
  title: string;
  description?: string;
  coverUrl?: string;
  status: string;
  viewCount: number;
  tags?: string[];
  chapters?: CrawledChapter[];
  createdAt: Date;
  updatedAt: Date;
  numCoin?: number;
  crawledChapterCount?: number;
  pageCounts?: number;
  chapterCounts?: number;
}

interface CrawledChapter {
  id: number;
  chapterNumber: number;
  title?: string;
  viewCount: number;
  detailUrl?: string;
  pages?: CrawledChapterPage[];
  createdAt: Date;
  crawledDetailAt: Date;
  updatedAt: Date;
  numCoin?: number;
  unlockAt?: Date;
  unlock?: boolean;
}

interface CrawledChapterPage {
  id: number;
  chapterId: number;
  pageNumber: number;
  contentType: string;
  imageUrl?: string;
  textContent?: string;
  orgId?: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: number;
  updatedBy?: number;
}

export default function CrawledComicDetail({ comicId }: CrawledComicDetailProps) {
  const router = useRouter();
  const [comic, setComic] = useState<CrawledComic | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<CrawledChapter | null>(null);
  const [isUnlockModalVisible, setIsUnlockModalVisible] = useState(false);
  const [isUnlockComicModalVisible, setIsUnlockComicModalVisible] = useState(false);
  const [selectedUnlockChapter, setSelectedUnlockChapter] = useState<CrawledChapter | null>(null);
  const [unlockForm] = Form.useForm();
  const [unlockComicForm] = Form.useForm();
  
  const [fetchComicDetail, { isLoading, error }] = useLazyGetCrawledComicDetailQuery();
  const [unlockChapter, { isLoading: isUnlockLoading }] = useUnlockCrawledComicChapterMutation();
  const [unlockComic, { isLoading: isUnlockComicLoading }] = useUnlockCrawledComicMutation();

  useEffect(() => {
    const loadComicDetail = async () => {
      try {
        const result = await fetchComicDetail({ id: parseInt(comicId) });
        if (result.data) {
          setComic(result.data);
        } else {
          message.error("Không thể tải thông tin truyện");
        }
      } catch (error) {
        message.error("Đã xảy ra lỗi khi tải dữ liệu");
        console.error("Error fetching comic detail:", error);
      }
    };
    
    loadComicDetail();
  }, [comicId, fetchComicDetail]);

  const handleViewChapter = (chapter: CrawledChapter) => {
    setSelectedChapter(chapter);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedChapter(null);
  };

  const handleBack = () => {
    router.push("/crawler/crawled-comic");
  };

  const handleUnlockChapter = (chapter: CrawledChapter) => {
    setSelectedUnlockChapter(chapter);
    setIsUnlockModalVisible(true);
  };

  const handleUnlockSubmit = async () => {
    if (!selectedUnlockChapter) return;
    
    try {
      const values = await unlockForm.validateFields();
      
      await unlockChapter({
        username: values.username,
        password: values.password,
        chapterId: selectedUnlockChapter.id
      }).unwrap();
      
      message.success("Mở khoá chương thành công!");
      setIsUnlockModalVisible(false);
      setSelectedUnlockChapter(null);
      unlockForm.resetFields();
      
      // Reload comic detail to get updated unlock status
      const result = await fetchComicDetail({ id: parseInt(comicId) });
      if (result.data) {
        setComic(result.data);
      }
    } catch (error: any) {
      console.error("Unlock chapter failed:", error);
      message.error(error?.data?.message || "Mở khoá chương thất bại!");
    }
  };

  const handleUnlockCancel = () => {
    setIsUnlockModalVisible(false);
    setSelectedUnlockChapter(null);
    unlockForm.resetFields();
  };

  const handleUnlockComic = () => {
    setIsUnlockComicModalVisible(true);
  };

  const handleUnlockComicSubmit = async () => {
    if (!comic) return;
    
    try {
      const values = await unlockComicForm.validateFields();
      
      await unlockComic({
        username: values.username,
        password: values.password,
        comicId: comic.id
      }).unwrap();
      
      message.success("Mở khoá tất cả chương thành công!");
      setIsUnlockComicModalVisible(false);
      unlockComicForm.resetFields();
      
      // Reload comic detail to get updated unlock status
      const result = await fetchComicDetail({ id: parseInt(comicId) });
      if (result.data) {
        setComic(result.data);
      }
    } catch (error: any) {
      console.error("Unlock comic failed:", error);
      message.error(error?.data?.message || "Mở khoá tất cả chương thất bại!");
    }
  };

  const handleUnlockComicCancel = () => {
    setIsUnlockComicModalVisible(false);
    unlockComicForm.resetFields();
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!comic) {
    return (
      <Card>
        <Text>Không tìm thấy truyện</Text>
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

      <Card style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "24px" }}>
          <Image
            width={200}
            height={280}
            src={comic.coverUrl}
            alt={comic.title}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1xkE8M+b3UBERHhERMZmRGS4Q0RERERkRkZGREZGRMZGRGREREZERkZGREZER"
          />
          <div style={{ flex: 1 }}>
            <Title level={2}>{comic.title}</Title>
            
            <div style={{ marginBottom: "16px" }}>
              <Tag color={comic.status === "ongoing" ? "blue" : "green"}>
                {comic.status.toUpperCase()}
              </Tag>
              <Tag icon={<EyeOutlined />}>
                {Number(comic.viewCount).toLocaleString()} lượt xem
              </Tag>
            </div>

            {comic.tags && comic.tags.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <Text strong>Tags: </Text>
                {comic.tags.map((tag, index) => (
                  <Tag key={index} style={{ marginBottom: "4px" }}>
                    {tag}
                  </Tag>
                ))}
              </div>
            )}

            {comic.description && (
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
                  dangerouslySetInnerHTML={{ __html: comic.description }}
                />
              </div>
            )}

            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", gap: "24px", marginBottom: "8px" }}>
                {comic.chapterCounts !== undefined && (
                  <div>
                    <Text strong>Tổng số chương: </Text>
                    <Tag color="purple">{comic.chapterCounts.toLocaleString()}</Tag>
                  </div>
                )}
                {comic.numCoin !== undefined && (
                  <div>
                    <Text strong>Số coin mở khoá: </Text>
                    <Tag color="orange">{comic.numCoin.toLocaleString()}</Tag>
                  </div>
                )}
              </div>
              
              <div style={{ display: "flex", gap: "24px" }}>
                {comic.crawledChapterCount !== undefined && (
                  <div>
                    <Text strong>Số chương đã cào: </Text>
                    <Tag color="blue">{comic.crawledChapterCount.toLocaleString()}</Tag>
                  </div>
                )}
                {comic.pageCounts !== undefined && (
                  <div>
                    <Text strong>Tổng số trang đã cào: </Text>
                    <Tag color="green">{comic.pageCounts.toLocaleString()}</Tag>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Text strong>Ngày tạo: </Text>
              <Text>{moment(comic.createdAt).format("DD/MM/YYYY HH:mm")}</Text>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <Text strong>Cập nhật: </Text>
              <Text>{moment(comic.updatedAt).format("DD/MM/YYYY HH:mm")}</Text>
            </div>

            {(comic?.numCoin || 0) > 0 && (
              <div>
                <Button
                  type="primary"
                  icon={<UnlockOutlined />}
                  onClick={handleUnlockComic}
                  size="large"
                  style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                >
                  Mở khoá tất cả chương
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card title={`Danh sách chương (${comic.chapters?.length || 0})`}>
        {comic.chapters && comic.chapters.length > 0 ? (
          <Table
            dataSource={[...comic.chapters].sort((a, b) => a.chapterNumber - b.chapterNumber)}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} chương`
            }}
            columns={[
              {
                title: "Chương",
                dataIndex: "chapterNumber",
                key: "chapterNumber",
                width: 150,
                sorter: (a, b) => a.chapterNumber - b.chapterNumber,
                render: (chapterNumber) => (
                  <Text strong>Chương {parseInt(chapterNumber)}</Text>
                )
              },
              {
                title: "Tiêu đề",
                dataIndex: "title",
                key: "title",
                width: 200,
                render: (title) => title || <Text type="secondary">Không có tiêu đề</Text>
              },
              {
                title: "Thời gian cào page",
                dataIndex: "crawledDetailAt",
                key: "crawledDetailAt",
                width: 150,
                align: "center",
                sorter: (a, b) => new Date(a.crawledDetailAt).getTime() - new Date(b.crawledDetailAt).getTime(),
                render: (crawledDetailAt) => moment(crawledDetailAt).format("DD/MM/YYYY HH:mm")
              },
              {
                title: "Số trang",
                dataIndex: "pages",
                key: "pageCount",
                width: 100,
                align: "center",
                render: (pages) => (
                  <Tag color="blue">
                    {pages?.length || 0} trang
                  </Tag>
                )
              },
              {
                title: "Lượt xem",
                dataIndex: "viewCount",
                key: "viewCount",
                width: 120,
                align: "center",
                sorter: (a, b) => a.viewCount - b.viewCount,
                render: (viewCount) => (
                  <Text>
                    <EyeOutlined /> {Number(viewCount).toLocaleString()}
                  </Text>
                )
              },
              {
                title: "Số coin mở khoá",
                dataIndex: "numCoin",
                key: "numCoin",
                width: 130,
                align: "center",
                sorter: (a, b) => (a.numCoin || 0) - (b.numCoin || 0),
                render: (numCoin) => (
                  numCoin !== undefined ? (
                    <Tag color="orange">{numCoin.toLocaleString()}</Tag>
                  ) : (
                    <Text type="secondary">-</Text>
                  )
                )
              },
              {
                title: "Mở khoá vào lúc",
                dataIndex: "unlockAt",
                key: "unlockAt",
                width: 150,
                align: "center",
                sorter: (a, b) => {
                  if (!a.unlockAt && !b.unlockAt) return 0;
                  if (!a.unlockAt) return 1;
                  if (!b.unlockAt) return -1;
                  return new Date(a.unlockAt).getTime() - new Date(b.unlockAt).getTime();
                },
                render: (unlockAt, chapter) => {
                  if ((chapter.numCoin || 0) === 0) {
                    return <Text type="secondary">-</Text>;
                  }
                  if (chapter.unlock === true && !unlockAt) {
                    return <Tag color="orange">Đang xử lý</Tag>;
                  }
                  return unlockAt ? (
                    <Tag color="green">{moment(unlockAt).format("DD/MM/YYYY HH:mm")}</Tag>
                  ) : (
                    <Tag color="red">Chưa mở</Tag>
                  );
                }
              },
              {
                title: "Ngày tạo",
                dataIndex: "createdAt",
                key: "createdAt",
                width: 150,
                align: "center",
                sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                render: (createdAt) => moment(createdAt).format("DD/MM/YYYY HH:mm")
              },
              {
                title: "Thao tác",
                key: "action",
                width: 180,
                align: "center",
                render: (_, chapter) => (
                  <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleViewChapter(chapter)}
                    >
                      Xem trang
                    </Button>
                    {(chapter.numCoin || 0) > 0 && !chapter.unlockAt && (
                      <Button
                        type="default"
                        size="small"
                        icon={<UnlockOutlined />}
                        onClick={() => handleUnlockChapter(chapter)}
                      >
                        Mở khoá
                      </Button>
                    )}
                  </div>
                )
              }
            ]}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Text type="secondary">Không có chương nào</Text>
          </div>
        )}
      </Card>

      <Modal
        title={
          selectedChapter ? (
            <div>
              <Text strong>
                Chương {parseFloat(selectedChapter.chapterNumber)}
                {selectedChapter.title && `: ${selectedChapter.title}`}
              </Text>
              <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                {selectedChapter.pages?.length || 0} trang
              </div>
            </div>
          ) : ""
        }
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width="90vw"
        style={{ top: 20 }}
        styles={{
          body: { 
            padding: "20px",
            maxHeight: "80vh",
            overflow: "auto"
          }
        }}
      >
        {selectedChapter?.pages && selectedChapter.pages.length > 0 ? (
          <div>
            {[...selectedChapter.pages]
              .sort((a, b) => a.pageNumber - b.pageNumber)
              .map((page, index) => (
                <div key={page.id} style={{ marginBottom: "20px", textAlign: "center" }}>
                  <div style={{ 
                    marginBottom: "8px", 
                    fontSize: "14px", 
                    color: "#666",
                    fontWeight: "bold"
                  }}>
                    Trang {page.pageNumber}
                  </div>
                  
                  {page.contentType === "image" && page.imageUrl ? (
                    <Image
                      src={page.imageUrl}
                      alt={`Page ${page.pageNumber}`}
                      style={{ 
                        maxWidth: "100%",
                        height: "auto",
                        border: "1px solid #f0f0f0",
                        borderRadius: "4px"
                      }}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1xkE8M+b3UBERHhERMZmRGS4Q0RERERkRkZGREZGRMZGRGREREZERkZGREZER"
                    />
                  ) : page.contentType === "text" && page.textContent ? (
                    <div
                      style={{
                        padding: "20px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0",
                        textAlign: "left",
                        maxWidth: "600px",
                        margin: "0 auto"
                      }}
                    >
                      <div 
                        style={{ whiteSpace: "pre-wrap", fontSize: "14px", lineHeight: "1.6" }}
                        dangerouslySetInnerHTML={{ __html: page.textContent }}
                      />
                    </div>
                  ) : (
                    <div style={{ 
                      padding: "40px", 
                      backgroundColor: "#f5f5f5", 
                      borderRadius: "8px",
                      border: "1px dashed #d9d9d9"
                    }}>
                      <Text type="secondary">Không có nội dung cho trang này</Text>
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Text type="secondary">Không có trang nào trong chương này</Text>
          </div>
        )}
      </Modal>

      <Modal
        title={
          selectedUnlockChapter ? (
            <div>
              <Text strong>Mở khoá chương {parseFloat(selectedUnlockChapter.chapterNumber)}</Text>
              {selectedUnlockChapter.title && (
                <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                  {selectedUnlockChapter.title}
                </div>
              )}
              <div style={{ fontSize: "12px", color: "#f60", marginTop: "4px" }}>
                Cần {selectedUnlockChapter.numCoin} coin
              </div>
            </div>
          ) : "Mở khoá chương"
        }
        open={isUnlockModalVisible}
        onOk={handleUnlockSubmit}
        onCancel={handleUnlockCancel}
        okText="Mở khoá"
        cancelText="Huỷ"
        width={400}
        confirmLoading={isUnlockLoading}
      >
        <Form
          form={unlockForm}
          layout="vertical"
          style={{ marginTop: "16px" }}
        >
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" }
            ]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>
          
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Mở khoá tất cả chương"
        open={isUnlockComicModalVisible}
        onOk={handleUnlockComicSubmit}
        onCancel={handleUnlockComicCancel}
        okText="Mở khoá tất cả"
        cancelText="Huỷ"
        width={400}
        confirmLoading={isUnlockComicLoading}
      >
        <div style={{ marginBottom: "16px" }}>
          <Text type="warning" strong>
            Bạn có chắc chắn muốn mở khoá tất cả chương của truyện này?
          </Text>
        </div>
        <Form
          form={unlockComicForm}
          layout="vertical"
          style={{ marginTop: "16px" }}
        >
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" }
            ]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>
          
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}