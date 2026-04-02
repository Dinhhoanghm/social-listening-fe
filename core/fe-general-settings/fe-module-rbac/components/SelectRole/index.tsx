import { Select, SelectProps } from "antd";
import { Option } from "antd/es/mentions";
import React, { useMemo } from "react";
import { useGetSelectRoleQuery } from "../../apis";

export function SelectRole(props: SelectProps) {
  const { value, onChange, disabled } = props;
  const { data } = useGetSelectRoleQuery({});

  const roleOptions = useMemo(() => {
    return data?.items?.map((item: any) => (
      <Option key={`${item.id}-${item.name}`} value={item.id}>
        {item.name}
      </Option>
    ));
  }, [data?.items]);

  return (
    <>
      <Select
        placeholder="Chọn quyền truy cập"
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {roleOptions}
      </Select>
    </>
  );
}
