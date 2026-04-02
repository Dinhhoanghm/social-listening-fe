import { useLazySelectPositionQuery } from "../../apis";
import { Select, SelectProps } from "antd";
import { Option } from "antd/es/mentions";
import { useEffect, useMemo } from "react";

export function PositionSelect(props: SelectProps) {
  const { value, onChange, disabled } = props;

  const [selectPosition, { data, isLoading }] = useLazySelectPositionQuery();

  useEffect(() => {
    selectPosition({});
  }, []);

  const positionOptions = useMemo(() => {
    return (
      data?.items?.map((item: any) => (
        <Option key={`${item.id}-${item.name}`} value={item.id}>
          {item.name}
        </Option>
      )) || []
    );
  }, [data?.items]);

  return (
    <Select
      placeholder="Chọn chức vụ"
      disabled={disabled}
      loading={isLoading}
      value={value}
      onChange={onChange}
    >
      {positionOptions}
    </Select>
  );
}
