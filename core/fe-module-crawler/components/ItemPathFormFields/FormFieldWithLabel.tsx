import React from 'react';
import { Form, Select, Input, Typography, theme } from 'antd';

const { TextArea } = Input;
const { Text } = Typography;

interface FormFieldWithLabelProps {
  fieldPath: string[];
  label: string;
  placeholder: string;
  type?: 'textarea' | 'select';
  options?: { value: string; label: string }[];
  maxRows?: number;
  isEditing?: boolean;
  style?: React.CSSProperties;
}

const FormFieldWithLabel: React.FC<FormFieldWithLabelProps> = ({
  fieldPath,
  label,
  placeholder,
  type = 'textarea',
  options,
  maxRows = 4,
  isEditing = true,
  style
}) => {
  const { token } = theme.useToken();

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

  const renderFieldValue = (fieldPath: string[], placeholder?: string) => {
    return (
      <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
        {(form) => {
          const value = form.getFieldValue(fieldPath);
          return (
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
              boxShadow: value ? `0 1px 2px ${token.colorBorderSecondary}30` : 'none',
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word'
            }}>
              {value || placeholder || '-'}
            </div>
          );
        }}
      </Form.Item>
    );
  };

  return (
    <div style={{ marginBottom: 12, ...style }}>
      <Text style={fieldLabelStyle}>{label}</Text>
      {isEditing ? (
        <Form.Item name={fieldPath} style={{ marginBottom: 0 }}>
          {type === 'select' ? (
            <Select
              placeholder={placeholder}
              size="middle"
              style={editingInputStyle}
              allowClear
            >
              {options?.map(option => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          ) : (
            <TextArea
              placeholder={placeholder}
              autoSize={{ minRows: 1, maxRows }}
              style={{
                ...editingInputStyle,
                resize: 'none'
              }}
            />
          )}
        </Form.Item>
      ) : (
        renderFieldValue(fieldPath, `Chưa có ${label.toLowerCase()}`)
      )}
    </div>
  );
};

export default FormFieldWithLabel;