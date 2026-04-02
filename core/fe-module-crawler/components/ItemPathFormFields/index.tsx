import React from 'react';
import { Row, Col, Form, Select, Input, Card, Typography, theme } from 'antd';
import FormFieldWithLabel from './FormFieldWithLabel';

const { TextArea } = Input;
const { Text } = Typography;

interface ItemPathFormFieldsProps {
  fieldName: string | string[];
  label: string;
  locatorTypePlaceholder?: string;
  locatorValuePlaceholder?: string;
  attributePlaceholder?: string;
  parserScriptPlaceholder?: string;
  showParserScript?: boolean;
  style?: React.CSSProperties;
  isEditing?: boolean;
  crawlerType?: string;
}

const LOCATOR_OPTIONS = [
  { value: 'ID', label: 'ID' },
  { value: 'NAME', label: 'NAME' },
  { value: 'XPATH', label: 'XPATH' },
  { value: 'CSS', label: 'CSS' }
];

const ItemPathFormFields: React.FC<ItemPathFormFieldsProps> = ({
  fieldName,
  label,
  locatorTypePlaceholder = "Loại locator",
  locatorValuePlaceholder = "Giá trị locator",
  attributePlaceholder = "Thuộc tính",
  parserScriptPlaceholder = "Parser script",
  showParserScript = true,
  style,
  isEditing = true,
  crawlerType = 'WEB'
}) => {
  const { token } = theme.useToken();

  // Unified color scheme that works for both light and dark modes
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

  const isApiMode = crawlerType === 'API';

  // Unified input styling for editing mode
  const editingInputStyle: React.CSSProperties = {
    backgroundColor: token.colorBgContainer,
    border: 'none',
    boxShadow: `0 2px 4px ${token.colorBorderSecondary}40`,
    borderRadius: '6px'
  };


  // Helper component to render parser script as code block when not editing
  const renderParserScript = (fieldPath: string[]) => {
    return (
      <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
        {(form) => {
          const value = form.getFieldValue(fieldPath);
          return (
            <pre style={{
              padding: '16px',
              backgroundColor: value ? token.colorFillSecondary : token.colorFillQuaternary,
              borderRadius: '8px',
              borderLeft: value ? `4px solid ${token.colorPrimary}` : `4px solid ${token.colorBorderSecondary}`,
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              fontSize: '13px',
              lineHeight: '1.5',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: '200px',
              overflow: 'auto',
              color: value ? token.colorText : token.colorTextSecondary,
              boxShadow: value ? `0 2px 4px ${token.colorBorderSecondary}40` : 'none',
              transition: 'all 0.2s ease'
            }}>
              {value || 'Chưa có parser script'}
            </pre>
          );
        }}
      </Form.Item>
    );
  };

  return (
    <div style={containerStyle}>
      <label style={labelStyle}>
        {label}
      </label>

      {isApiMode ? (
        // API Mode Fields
        <>
          <FormFieldWithLabel
            fieldPath={[...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'locatorValue']}
            label="Đường dẫn thuộc tính"
            placeholder="Đường dẫn thuộc tính"
            isEditing={isEditing}
          />
          {/* Main form fields for API */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 calc(50% - 6px)', minWidth: 200 }}>
              <FormFieldWithLabel
                fieldPath={[...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'filter']}
                label="Lọc dữ liệu"
                placeholder="Lọc dữ liệu"
                isEditing={isEditing}
              />
            </div>
            <div style={{ flex: '1 1 calc(50% - 6px)', minWidth: 200 }}>
              <FormFieldWithLabel
                fieldPath={[...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'parserType']}
                label="Loại parser"
                placeholder="Loại parser"
                type="select"
                options={[
                  { value: 'liquid', label: 'liquid' },
                  { value: 'python', label: 'python' }
                ]}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* Parser script row for API */}
          {showParserScript && (
            <div style={{ marginTop: 16 }}>
              <Text style={fieldLabelStyle}>Mã code parser</Text>
              <Row gutter={12} style={{ marginTop: 4 }}>
                <Col span={24}>
                  {isEditing ? (
                    <Form.Item name={[...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'parserScript']} style={{ marginBottom: 0 }}>
                      <TextArea
                        rows={4}
                        placeholder="Nhập mã code parser"
                        style={{
                          ...editingInputStyle,
                          fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                          fontSize: '13px'
                        }}
                      />
                    </Form.Item>
                  ) : (
                    renderParserScript([...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'parserScript'])
                  )}
                </Col>
              </Row>
            </div>
          )}
        </>
      ) : (
        // WEB Mode Fields (current implementation)
        <>
          {/* Main form fields row */}
          <Row gutter={12}>
            <Col span={24}>
              <FormFieldWithLabel
                fieldPath={[...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'locatorValue']}
                label="Giá trị Locator"
                placeholder={locatorValuePlaceholder}
                isEditing={isEditing}
              />
            </Col>
            <Col span={12}>
              <FormFieldWithLabel
                fieldPath={[...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'locatorType']}
                label="Loại"
                placeholder={locatorTypePlaceholder}
                type="select"
                options={LOCATOR_OPTIONS}
                isEditing={isEditing}
              />
            </Col>
            <Col span={12}>
              <FormFieldWithLabel
                fieldPath={[...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'attribute']}
                label="Thuộc tính"
                placeholder={attributePlaceholder}
                maxRows={2}
                isEditing={isEditing}
              />
            </Col>
          </Row>

          {/* Parser script row */}
          {showParserScript && (
            <div style={{ marginTop: 16 }}>
              <Text style={fieldLabelStyle}>Parser Script (Tùy chọn)</Text>
              <Row gutter={12} style={{ marginTop: 4 }}>
                <Col span={24}>
                  {isEditing ? (
                    <Form.Item name={[...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'parserScript']} style={{ marginBottom: 0 }}>
                      <TextArea
                        rows={3}
                        placeholder={parserScriptPlaceholder}
                        style={{
                          ...editingInputStyle,
                          fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                          fontSize: '13px'
                        }}
                      />
                    </Form.Item>
                  ) : (
                    renderParserScript([...(Array.isArray(fieldName) ? fieldName : [fieldName]), 'parserScript'])
                  )}
                </Col>
              </Row>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ItemPathFormFields;