import React, { useState } from 'react';
import { Button, Modal, Input, Form, message } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import TestResultModal from '../TestResultModal';

interface DetailTestButtonProps {
  testData: any | (() => any);
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  buttonText?: string;
  className?: string;
  style?: React.CSSProperties;
}

const DetailTestButton: React.FC<DetailTestButtonProps> = ({
  testData,
  disabled = false,
  size = 'small',
  buttonText = 'Test Detail',
  className,
  style
}) => {
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [form] = Form.useForm();

  const handleTestClick = () => {
    setInputModalVisible(true);
  };

  const handleInputModalClose = () => {
    setInputModalVisible(false);
    form.resetFields();
  };

  const handleCrawlerTest = async () => {
    if (loading) return; // Prevent duplicate calls

    try {
      const values = await form.validateFields();

      // Close input modal and show result modal
      setInputModalVisible(false);
      setResult(null);
      setResultModalVisible(true);
      setLoading(true);

      // Add a small delay to ensure form values are updated
      await new Promise(resolve => setTimeout(resolve, 100));

      const apiUrl = process.env.CRAWLER_JOB_TEST_DETAIL || 'https://api.s8truyen.com/crawler-job/api/v1/test-crawler-detail';

      // Get fresh test data when the button is clicked
      const currentTestData = typeof testData === 'function' ? testData() : testData;
      console.log('DetailTestButton: Using test data:', currentTestData);

      const requestData = {
        ...currentTestData,
        detailUrl: values.detailUrl
      };

      console.log('DetailTestButton: Request data:', requestData);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      setResult(responseData);

    } catch (error) {
      console.error('Detail crawler test error:', error);
      setResult({
        error: 'Thử nghiệm crawler chi tiết thất bại!',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      message.error('Thử nghiệm crawler chi tiết thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleResultModalClose = () => {
    setResultModalVisible(false);
    setResult(null);
  };

  return (
    <>
      <Button
        type="primary"
        size={size}
        icon={<PlayCircleOutlined />}
        onClick={handleTestClick}
        disabled={disabled}
        className={className}
        style={style}
      >
        {buttonText}
      </Button>

      {/* Input Modal */}
      <Modal
        title="Nhập URL chi tiết để test crawler"
        open={inputModalVisible}
        onCancel={handleInputModalClose}
        footer={[
          <Button key="cancel" onClick={handleInputModalClose}>
            Hủy
          </Button>,
          <Button
            key="test"
            type="primary"
            onClick={handleCrawlerTest}
            loading={loading}
            disabled={loading}
          >
            Crawler Test
          </Button>
        ]}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <Form.Item
            name="detailUrl"
            label="URL chi tiết truyện"
            rules={[
              { required: true, message: 'Vui lòng nhập URL chi tiết!' },
              { type: 'url', message: 'URL không hợp lệ!' }
            ]}
          >
            <Input
              placeholder="Nhập URL chi tiết truyện (vd: https://example.com/manga/title-123)"
              autoFocus
              disabled={false}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Result Modal */}
      <TestResultModal
        visible={resultModalVisible}
        loading={loading}
        result={result}
        onClose={handleResultModalClose}
        title="Kết quả test crawler chi tiết"
      />
    </>
  );
};

export default DetailTestButton;