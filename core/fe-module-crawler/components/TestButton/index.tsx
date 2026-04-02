import React, { useState } from 'react';
import { Button, message } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import TestResultModal from '../TestResultModal';

interface TestButtonProps {
  testData?: any;
  testDataFunction?: () => any;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  apiUrl?: string;
  buttonText?: string;
  modalTitle?: string;
  className?: string;
  style?: React.CSSProperties;
}

const TestButton: React.FC<TestButtonProps> = ({
  testData,
  testDataFunction,
  disabled = false,
  size = 'small',
  apiUrl,
  buttonText = 'Test',
  modalTitle = 'Kết quả thử nghiệm cấu hình',
  className,
  style
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTest = async () => {
    try {
      // Show modal immediately with loading state
      setResult(null);
      setModalVisible(true);
      setLoading(true);

      // Get API URL from props or environment
      const testApiUrl = apiUrl || process.env.CRAWLER_JOB_TEST_HOME;
      
      if (!testApiUrl) {
        throw new Error('API URL not configured');
      }

      // Get fresh test data - use function if provided, otherwise use static data
      const currentTestData = testDataFunction ? testDataFunction() : testData;

      const response = await fetch(testApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentTestData),
      });

      const responseData = await response.json();
      setResult(responseData);

    } catch (error) {
      console.error('Test error:', error);
      setResult({ 
        error: 'Thử nghiệm thất bại!', 
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      message.error('Thử nghiệm thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setResult(null);
  };

  return (
    <>
      <Button
        type="primary"
        size={size}
        icon={<PlayCircleOutlined />}
        onClick={handleTest}
        loading={loading}
        disabled={disabled}
        className={className}
        style={style}
      >
        {buttonText}
      </Button>

      <TestResultModal
        visible={modalVisible}
        loading={loading}
        result={result}
        onClose={handleModalClose}
        title={modalTitle}
      />
    </>
  );
};

export default TestButton;