import { TreeSelect, TreeSelectProps } from "antd";
import { useGetSelectBranchQuery } from "../../apis";

const BranchTreeSelect = (props: TreeSelectProps) => {
  const { placeholder, fieldNames, ...otherProps } = props;
  const { data, isLoading } = useGetSelectBranchQuery(null);

  return (
    <TreeSelect
      showSearch
      treeData={data?.items || []}
      treeNodeFilterProp="name"
      fieldNames={fieldNames}
      placeholder={placeholder}
      loading={isLoading}
      treeLine={{ showLeafIcon: false }}
      treeDefaultExpandAll
      {...otherProps}
    />
  );
};

export default BranchTreeSelect;
