import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button, Modal, Input, Form, message } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import TestResultModal from '../TestResultModal';

interface PageDetailTestButtonProps {
  testData: any | (() => any);
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  buttonText?: string;
  className?: string;
  style?: React.CSSProperties;
}

const PageDetailTestButton: React.FC<PageDetailTestButtonProps> = ({
  testData,
  disabled = false,
  size = 'small',
  buttonText = 'Test Page Detail',
  className,
  style
}) => {
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [form] = Form.useForm();
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTestClick = () => {
    setInputModalVisible(true);
  };

  const handleInputModalClose = () => {
    setInputModalVisible(false);
    form.resetFields();
  };

  const executePageDetailTest = async () => {
    if (loading) return; // Prevent duplicate calls

    try {
      setLoading(true);
      const values = await form.validateFields();

      // Close input modal and show result modal
      setInputModalVisible(false);
      setResult(null);
      setResultModalVisible(true);

      // Add a small delay to ensure form values are updated
      await new Promise(resolve => setTimeout(resolve, 100));

      const apiUrl = process.env.CRAWLER_JOB_TEST_PAGE_DETAIL || 'https://api.s8truyen.com/crawler-job/api/v1/test-crawler-page-detail';

      // Get fresh test data when the button is clicked
      const currentTestData = typeof testData === 'function' ? testData() : testData;
      console.log('PageDetailTestButton: Using test data:', currentTestData);

      const requestData = {
        ...currentTestData,
        detailUrl: values.pageUrl
      };

      console.log('PageDetailTestButton: Request data:', requestData);

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
      console.error('Page detail crawler test error:', error);
      setResult({
        error: 'Thử nghiệm crawler chi tiết trang thất bại!',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      message.error('Thử nghiệm crawler chi tiết trang thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handlePageDetailTest = useCallback(() => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      executePageDetailTest();
    }, 300); // 300ms debounce
  }, [loading, testData]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

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
        title="Nhập URL chi tiết trang để test crawler"
        open={inputModalVisible}
        onCancel={handleInputModalClose}
        footer={[
          <Button key="cancel" onClick={handleInputModalClose}>
            Hủy
          </Button>,
          <Button
            key="test"
            type="primary"
            onClick={handlePageDetailTest}
            loading={loading}
            disabled={loading}
          >
            Crawler Page Detail
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
            name="pageUrl"
            label="URL chi tiết trang truyện"
            rules={[
              { required: true, message: 'Vui lòng nhập URL chi tiết trang!' },
              { type: 'url', message: 'URL không hợp lệ!' }
            ]}
          >
            <Input
              placeholder="Nhập URL chi tiết trang truyện (vd: https://example.com/manga/chapter-1/page-1)"
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
        title="Kết quả test crawler chi tiết trang"
      />
    </>
  );
};

export default PageDetailTestButton;