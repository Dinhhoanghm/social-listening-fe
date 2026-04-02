import { Button, Flex, List, Popover, theme, Typography, Select } from "antd";
import { memo, useEffect, useState } from "react";
import { AlignLeftOutlined, SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import { useResponsive } from "ahooks";

const { Text } = Typography;

interface SortOption {
  label: string;
  direction: string | string[];
  property: string;
}

interface SortPopoverProps {
  showLabel: boolean;
  options: SortOption[];
  onSorts: (sort: any) => void;
}

const SortPopover: React.FC<SortPopoverProps> = (props) => {
  const { sm } = useResponsive();
  const { token } = theme.useToken();
  const [open, setOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [selectedDirection, setSelectedDirection] = useState<string>("ASC");
  const [selectedItem, setSelectedItem] = useState<SortOption | null>(null);
  const { options = [], showLabel, onSorts } = props;

  useEffect(() => {
    if (options.length > 0) {
      const firstOption = options[0];
      setSelectedItem(firstOption);
      setSelectedProperty(firstOption.property);
      const firstDirection = Array.isArray(firstOption.direction) 
        ? firstOption.direction[0] 
        : firstOption.direction;
      setSelectedDirection(firstDirection);
    }
  }, [options]);

  const handlePropertySelect = (option: SortOption) => {
    setSelectedItem(option);
    setSelectedProperty(option.property);
    const firstDirection = Array.isArray(option.direction) 
      ? option.direction[0] 
      : option.direction;
    setSelectedDirection(firstDirection);
  };

  const handleDirectionChange = (direction: string) => {
    setSelectedDirection(direction);
  };

  const handleApplySort = () => {
    if (selectedProperty && selectedDirection) {
      onSorts([{ property: selectedProperty, direction: selectedDirection }]);
      setOpen(false);
    }
  };

  const getDirectionOptions = () => {
    if (!selectedItem) return [];
    const directions = Array.isArray(selectedItem.direction) 
      ? selectedItem.direction 
      : [selectedItem.direction];
    
    return directions.map(dir => ({
      label: dir === "ASC" ? "Tăng dần (A-Z)" : "Giảm dần (Z-A)",
      value: dir,
      icon: dir === "ASC" ? <SortAscendingOutlined /> : <SortDescendingOutlined />
    }));
  };

  const content = (
    <div style={{ width: 280, padding: 8 }}>
      <div style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 12, color: token.colorTextSecondary, fontWeight: 500 }}>
          Sắp xếp theo
        </Text>
        <List
          size="small"
          dataSource={options}
          renderItem={(item) => (
            <List.Item
              onClick={() => handlePropertySelect(item)}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                borderRadius: 6,
                marginBottom: 4,
                backgroundColor:
                  selectedProperty === item.property
                    ? token.colorPrimaryBg
                    : token.colorBgContainer,
                border: selectedProperty === item.property 
                  ? `1px solid ${token.colorPrimary}` 
                  : `1px solid ${token.colorBorder}`,
              }}
            >
              <Text style={{ 
                color: selectedProperty === item.property 
                  ? token.colorPrimary 
                  : token.colorText 
              }}>
                {item.label}
              </Text>
            </List.Item>
          )}
        />
      </div>
      
      {selectedItem && Array.isArray(selectedItem.direction) && selectedItem.direction.length > 1 && (
        <div style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 12, color: token.colorTextSecondary, fontWeight: 500, display: 'block', marginBottom: 8 }}>
            Thứ tự
          </Text>
          <Select
            value={selectedDirection}
            onChange={handleDirectionChange}
            style={{ width: '100%' }}
            options={getDirectionOptions()}
          />
        </div>
      )}
      
      <Button 
        type="primary" 
        onClick={handleApplySort}
        style={{ width: '100%' }}
        disabled={!selectedProperty || !selectedDirection}
      >
        Áp dụng
      </Button>
    </div>
  );

  const getButtonLabel = () => {
    if (!sm || !showLabel || !selectedItem) return "";
    const directionText = selectedDirection === "ASC" ? "↑" : "↓";
    return `${selectedItem.label} ${directionText}`;
  };

  return (
    <Popover
      content={content}
      trigger="click"
      arrow={false}
      placement="bottomRight"
      open={open}
      onOpenChange={(visible) => setOpen(visible)}
    >
      <Flex align="center" gap={8}>
        <Button icon={<AlignLeftOutlined />}>
          {getButtonLabel()}
        </Button>
      </Flex>
    </Popover>
  );
};

export default memo(SortPopover);
