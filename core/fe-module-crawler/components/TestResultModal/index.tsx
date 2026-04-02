import React from 'react';
import { Modal, Button, Spin, Typography } from 'antd';

interface TestResultModalProps {
  visible: boolean;
  loading: boolean;
  result: any;
  onClose: () => void;
  title?: string;
}

const TestResultModal: React.FC<TestResultModalProps> = ({
  visible,
  loading,
  result,
  onClose,
  title = "Kết quả thử nghiệm cấu hình"
}) => {
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>
      ]}
      width={800}
      style={{ top: 20 }}
    >
      <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', minHeight: '200px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Typography.Text>Đang thử nghiệm cấu hình...</Typography.Text>
            </div>
          </div>
        ) : (
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: 16, 
            borderRadius: 4, 
            fontSize: '12px',
            lineHeight: '1.4',
            whiteSpace: 'pre-wrap',
            margin: 0,
            maxHeight: '100%',
            overflow: 'auto'
          }}>
            {result ? JSON.stringify(result, null, 2) : 'Chưa có dữ liệu'}
          </pre>
        )}
      </div>
    </Modal>
  );
};

export default TestResultModal;