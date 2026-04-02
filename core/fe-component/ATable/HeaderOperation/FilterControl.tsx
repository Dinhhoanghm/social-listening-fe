import React, { memo, useEffect, useState } from "react";
import {
  DatePicker,
  Input,
  Select,
  Slider,
  TreeSelect,
  Typography,
} from "antd";
import { getToken } from "@/fe-base/utils/getToken";

const { Text } = Typography;

// Định nghĩa kiểu dữ liệu cho filter item
interface FilterItem {
  title: string;
  props: any;
  name: string;
  operation: string;
  type: "DatePicker" | "Select" | "Input" | "Slider" | "TreeSelect";
  urlApi?: string;
  value?: any;
  format?: string;
  showTime?: boolean;
}

interface Props {
  item: FilterItem;
  style?: any;
}

const FilterControl = (props: Props) => {
  const { item, style, ...otherProps } = props;
  const [options, setOptions] = useState(item.props.options || []);

  useEffect(() => {
    if (item.urlApi) {
      fetchData(item.urlApi);
    }
  }, [item]);

  const fetchData = (uri: string) => {
    const token = getToken(1);
    fetch(uri, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        const data = result.data;
        setOptions(data?.items ? data?.items : data);
        console.log("Data fetched successfully:", data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  switch (item.type) {
    case "DatePicker":
      return (
        <DatePicker
          style={{ width: "100%", ...style }}
          format={item.format}
          showTime={item.showTime}
          {...item.props}
          {...otherProps}
        />
      );

    case "Select":
      return (
        <Select
          style={{ width: "100%", ...style }}
          options={options}
          allowClear
          {...item.props}
          {...otherProps}
        />
      );

    case "TreeSelect":
      return (
        <TreeSelect
          showSearch
          style={{ width: "100%", ...style }}
          treeData={options}
          treeDefaultExpandAll
          {...item.props}
          {...otherProps}
        />
      );

    case "Input":
      return <Input {...item.props} {...otherProps} />;
    case "Slider":
      return (
        <>
          <Slider
            range
            defaultValue={item.value}
            min={item.value?.[0] || 0}
            max={item.value?.[1] || 100}
            style={style}
            {...otherProps}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <Text type="secondary">{item.value?.[0].toLocaleString()}</Text>
            <Text type="secondary">{item.value?.[1].toLocaleString()}</Text>
          </div>
        </>
      );

    default:
      return null;
  }
};

export default memo(FilterControl);
