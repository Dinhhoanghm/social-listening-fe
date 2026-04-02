import React from 'react';
import { Row, Col, Form, Select, Input, Card, Typography, Switch, theme } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

interface ApiTemplateFormFieldsProps {
  fieldName: string | string[];
  label: string;
  isEditing?: boolean;
  style?: React.CSSProperties;
}

const HTTP_METHODS = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' }
];

const ApiTemplateFormFields: React.FC<ApiTemplateFormFieldsProps> = ({
  fieldName,
  label,
  isEditing = true,
  style
}) => {
  const { token } = theme.useToken();
  
  const containerStyle: React.CSSProperties = {
    marginBottom: 20,
    padding: isEditing ? 18 : 16,
    borderRadius: 8,
    backgroundColor: isEditing ? token.colorFillAlter : token.colorFillTertiary,
    transition: 'all 0.3s ease',
    boxShadow: isEditing ? `0 2px 8px ${token.colorPrimary}20` : `0 1px 4px ${token.colorBorderSecondary}40`,
    ...style
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 14,
    fontWeight: 600,
    fontSize: '15px',
    color: isEditing ? token.colorPrimary : token.colorText
  };

  const fieldLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: token.colorTextSecondary,
    marginBottom: 6,
    fontWeight: 500
  };

  const editingInputStyle: React.CSSProperties = {
    backgroundColor: token.colorBgContainer,
    border: 'none',
    boxShadow: `0 2px 4px ${token.colorBorderSecondary}40`,
    borderRadius: '6px'
  };

  // Helper to render field values as text when not editing
  const renderFieldValue = (value: any, placeholder?: string) => (
    <div style={{ 
      padding: '8px 12px',
      minHeight: '32px',
      backgroundColor: value ? token.colorBgContainer : token.colorFillQuaternary,
      borderRadius: '6px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      color: value ? token.colorText : token.colorTextSecondary,
      fontWeight: value ? 500 : 400,
      transition: 'all 0.2s ease',
      boxShadow: value ? `0 1px 2px ${token.colorBorderSecondary}30` : 'none'
    }}>
      {value || placeholder || '-'}
    </div>
  );

  return (
    <div style={containerStyle}>
      <label style={labelStyle}>
        {label}
      </label>

      {/* Method and Field Page */}
      <Row gutter={12} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Text style={fieldLabelStyle}>HTTP Method</Text>
          {isEditing ? (
            <Form.Item name={[...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'method']} style={{ marginBottom: 0 }}>
              <Select 
                placeholder="Chọn HTTP method"
                style={editingInputStyle}
              >
                {HTTP_METHODS.map(method => (
                  <Select.Option key={method.value} value={method.value}>
                    {method.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
              {(form) => {
                const value = form.getFieldValue([...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'method']);
                return renderFieldValue(value, 'Chưa chọn method');
              }}
            </Form.Item>
          )}
        </Col>
        <Col span={6}>
          <Text style={fieldLabelStyle}>Field Page</Text>
          {isEditing ? (
            <Form.Item name={[...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'fieldPage']} style={{ marginBottom: 0 }}>
              <Input 
                placeholder="Trường phân trang"
                style={editingInputStyle}
              />
            </Form.Item>
          ) : (
            <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
              {(form) => {
                const value = form.getFieldValue([...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'fieldPage']);
                return renderFieldValue(value, 'Chưa có field page');
              }}
            </Form.Item>
          )}
        </Col>
        <Col span={6}>
          <Text style={fieldLabelStyle}>Document Location</Text>
          {isEditing ? (
            <Form.Item name={[...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'documentLocation']} style={{ marginBottom: 0 }}>
              <Input 
                placeholder="Vị trí nội dung"
                style={editingInputStyle}
              />
            </Form.Item>
          ) : (
            <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
              {(form) => {
                const value = form.getFieldValue([...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'documentLocation']);
                return renderFieldValue(value, 'Chưa có document location');
              }}
            </Form.Item>
          )}
        </Col>
        <Col span={6}>
          <Text style={fieldLabelStyle}>Load More Page</Text>
          {isEditing ? (
            <Form.Item 
              name={[...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'loadMorePage']} 
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Switch checkedChildren="Có" unCheckedChildren="Không" />
            </Form.Item>
          ) : (
            <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
              {(form) => {
                const value = form.getFieldValue([...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'loadMorePage']);
                return renderFieldValue(value ? 'Có' : 'Không', 'Không');
              }}
            </Form.Item>
          )}
        </Col>
      </Row>

      {/* Parameters Section */}
      <div style={{ marginBottom: 16 }}>
        <Text style={fieldLabelStyle}>Parameters</Text>
        {isEditing ? (
          <Form.Item name={[...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'params']} style={{ marginBottom: 0 }}>
            <Input.TextArea 
              rows={3}
              placeholder='Nhập parameters dưới dạng JSON:\n{\n  "page": 1,\n  "limit": 10\n}'
              style={{
                ...editingInputStyle,
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                fontSize: '13px'
              }}
            />
          </Form.Item>
        ) : (
          <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
            {(form) => {
              const params = form.getFieldValue([...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'params']) || {};
              const paramsStr = typeof params === 'object' ? JSON.stringify(params, null, 2) : params;
              return (
                <pre style={{
                  padding: '12px',
                  backgroundColor: token.colorFillQuaternary,
                  borderRadius: '6px',
                  minHeight: '40px',
                  margin: 0,
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  fontSize: '13px',
                  whiteSpace: 'pre-wrap',
                  color: paramsStr && paramsStr !== '{}' ? token.colorText : token.colorTextSecondary
                }}>
                  {(paramsStr && paramsStr !== '{}') ? paramsStr : 'Chưa có parameters'}
                </pre>
              );
            }}
          </Form.Item>
        )}
      </div>

      {/* URLs Section */}
      <div style={{ marginBottom: 16 }}>
        <Text style={fieldLabelStyle}>Danh sách URL</Text>
        {isEditing ? (
          <Form.List name={[...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'urls']}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={12} style={{ marginBottom: 8 }}>
                    <Col span={22}>
                      <Form.Item
                        {...restField}
                        name={name}
                        style={{ marginBottom: 0 }}
                      >
                        <Input placeholder="Nhập URL" style={editingInputStyle} />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <MinusCircleOutlined 
                        onClick={() => remove(name)}
                        style={{ color: token.colorError, fontSize: '16px', marginTop: '8px' }}
                      />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <div
                    onClick={() => add()}
                    style={{
                      padding: '8px',
                      border: `1px dashed ${token.colorBorder}`,
                      borderRadius: '6px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      color: token.colorPrimary,
                      backgroundColor: token.colorFillQuaternary,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <PlusOutlined /> Thêm URL
                  </div>
                </Form.Item>
              </>
            )}
          </Form.List>
        ) : (
          <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
            {(form) => {
              const urls = form.getFieldValue([...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'urls']) || [];
              return (
                <div style={{
                  padding: '12px',
                  backgroundColor: token.colorFillQuaternary,
                  borderRadius: '6px',
                  minHeight: '40px'
                }}>
                  {urls.length > 0 ? (
                    urls.map((url: string, index: number) => (
                      <div key={index} style={{ 
                        marginBottom: '4px',
                        color: token.colorText,
                        fontSize: '14px'
                      }}>
                        <strong>{index + 1}.</strong> {url}
                      </div>
                    ))
                  ) : (
                    <span style={{ color: token.colorTextSecondary }}>Chưa có URLs</span>
                  )}
                </div>
              );
            }}
          </Form.Item>
        )}
      </div>

      {/* Headers Section */}
      <div>
        <Text style={fieldLabelStyle}>Headers</Text>
        {isEditing ? (
          <Form.Item name={[...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'headers']} style={{ marginBottom: 0 }}>
            <Input.TextArea 
              rows={3}
              placeholder='Nhập headers dưới dạng JSON:\n{\n  "Authorization": "Bearer token",\n  "Content-Type": "application/json"\n}'
              style={{
                ...editingInputStyle,
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                fontSize: '13px'
              }}
            />
          </Form.Item>
        ) : (
          <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
            {(form) => {
              const headers = form.getFieldValue([...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'headers']) || {};
              const headersStr = typeof headers === 'object' ? JSON.stringify(headers, null, 2) : headers;
              return (
                <pre style={{
                  padding: '12px',
                  backgroundColor: token.colorFillQuaternary,
                  borderRadius: '6px',
                  minHeight: '40px',
                  margin: 0,
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  fontSize: '13px',
                  whiteSpace: 'pre-wrap',
                  color: headersStr && headersStr !== '{}' ? token.colorText : token.colorTextSecondary
                }}>
                  {(headersStr && headersStr !== '{}') ? headersStr : 'Chưa có headers'}
                </pre>
              );
            }}
          </Form.Item>
        )}
      </div>
    </div>
  );
};

export default ApiTemplateFormFields;