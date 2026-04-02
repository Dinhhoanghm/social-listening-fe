import { Select, SelectProps } from "antd";

// Apis
import { useGetSelectUserQuery } from "../../apis";

const UserSelect = (props: SelectProps) => {
  const { placeholder, fieldNames, ...otherProps } = props;
  const { data, isLoading } = useGetSelectUserQuery(null);

  return (
    <Select
      showSearch
      options={data?.items || []}
      fieldNames={fieldNames}
      placeholder={placeholder}
      loading={isLoading}
      {...otherProps}
    />
  );
};

export default UserSelect;
