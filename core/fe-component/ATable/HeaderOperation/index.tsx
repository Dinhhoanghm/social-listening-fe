"use client";
import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import {
  Button,
  Divider,
  Drawer,
  Flex,
  Form,
  Input,
  Popover,
  Tooltip,
} from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";
import { useSize } from "ahooks";
import { useMobile } from "@/fe-cores/common/mobile";
import SortPopover from "./SortPopover";
import FilterControl from "./FilterControl";
import { debounce } from "lodash";
import moment from "moment";
import dayjs from "dayjs";

// Định nghĩa kiểu dữ liệu cho filter item
interface FilterItem {
  title: string;
  props: any;
  name: string;
  operation: string;
  type: "DatePicker" | "Select" | "Input" | "Slider";
  urlApi?: string;
  value?: any;
  format?: string;
  showTime?: boolean;
  pin?: boolean;
}

function transformData(filters, data) {
  // Ensure filters is an array
  const safeFilters = Array.isArray(filters) ? filters : [];
  
  return safeFilters
    .map((filter) => {
      const key = `${filter.name}_${filter.operation}`;
      const value = data[key];

      // Kiểm tra nếu value là Date, Moment.js, hoặc Day.js và chuyển sang milliseconds

      const _value = () => {
        // Check chon ngay, từ ngày thì để là 00h, còn đến ngày là đến 23h
        if (dayjs.isDayjs(value)) {
          if (filter.operation.includes("gt")) {
            return value.startOf("day").valueOf();
          }
          return value.endOf("day").valueOf();
        }
        return value;
      };

      return {
        name: filter.name,
        operation: filter.operation,
        value: _value() === undefined ? "" : _value(),
      };
    })
    .filter((item) => item.value !== "");
}

interface DynamicFilterProps {
  data: any;
  onApply: (values: any) => void;
  title?: string;
  add?: React.ReactNode;
  deleteAll?: React.ReactNode;
  onSorts?: (sort: any) => void;
}

const HeaderOperation: React.FC<DynamicFilterProps> = (props) => {
  const { styles, theme } = useStyles();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const size = useSize(ref);
  const isMobile = useMobile();

  const {
    data = {},
    onApply,
    onSorts,
    title = "Bộ lọc",
    add,
    deleteAll,
  } = props;

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleApply = () => {
    const values = form.getFieldsValue();
    // console.log(
    //   "transformData(data.filters, values)",
    //   transformData(data.filters, values)
    // );
    onApply({ filters: transformData(data?.filters || [], values) });
    setOpen(false);
  };

  const onSearch = useCallback(
    debounce((e: any) => {
      onApply({
        keyword: e.target.value,
        fieldsSearch: data?.search?.fieldsSearch,
      });
    }, 800),
    [onApply]
  );

  const isFilterPin = useMemo(() => {
    if (!size) return false;
    const { width } = size;
    const safeFilters = Array.isArray(data?.filters) ? data.filters : [];
    const numberFilter = safeFilters.filter(
      (item: FilterItem) => item?.pin === true
    ).length;
    const _width = width - numberFilter * 280 - 440;
    return _width > 0;
  }, [size, data]);

  const isBtnFilter = useMemo(() => {
    const safeFilters = Array.isArray(data?.filters) ? data.filters : [];
    const numberFilter = safeFilters.filter(
      (item: FilterItem) => item?.pin === true
    ).length;
    if (isFilterPin && numberFilter === safeFilters.length) {
      return false;
    }
    return true;
  }, [isFilterPin, data?.filters]);

  const content = useMemo(() => {
    const safeFilters = Array.isArray(data?.filters) ? data.filters : [];
    const _data = isFilterPin
      ? safeFilters.filter((item: FilterItem) => item?.pin === false)
      : safeFilters;

    // ${filter.name}_${filter.operation} => nhằm mục đích do có 2 name trùng nhau
    return (
      <Form
        form={form}
        layout="vertical"
        initialValues={safeFilters.reduce((acc: Record<string, any>, filter: FilterItem) => {
          if (filter.value) {
            acc[`${filter.name}_${filter.operation}`] = filter.value;
          }
          return acc;
        }, {})}
      >
        {_data.map((filter: any) => (
          <Form.Item
            key={`${filter.name}_${filter.operation}`}
            name={`${filter.name}_${filter.operation}`}
            label={filter.title}
            style={{ marginBottom: 16 }}
          >
            <FilterControl item={filter} />
          </Form.Item>
        ))}

        <Divider style={{ margin: "12px 0" }} />

        <Form.Item style={{ marginBottom: 0 }}>
          <Flex flex={1} gap={12}>
            <Button
              onClick={handleReset}
              type="primary"
              ghost
              style={{ flex: 1 }}
            >
              Reset
            </Button>
            <Button type="primary" style={{ flex: 1 }} onClick={handleApply}>
              Áp dụng
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    );
  }, [data, form, handleApply, isFilterPin]);

  return (
    <Flex
      className={styles.container}
      gap={12}
      justify="space-between"
      ref={ref}
    >
      <Flex style={{ flex: 1, maxWidth: !isMobile ? 500 : "100%" }} gap={12}>
        {data.search ? (
          <Input
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            onChange={onSearch}
            allowClear
            suffix={
              isMobile ? (
                <Tooltip title="Lọc">
                  <FilterOutlined
                    style={{ color: theme.colorPrimary }}
                    onClick={() => setOpen(true)}
                  />
                </Tooltip>
              ) : null
            }
            {...data.search.props}
          />
        ) : null}
        {deleteAll && deleteAll}
      </Flex>

      <Flex gap={12}>
        {isFilterPin &&
        Array.isArray(data?.filters) &&
        data.filters.filter((item: FilterItem) => item?.pin === true).length >
          0 ? (
          <Form form={form} layout="inline" className={styles.formFilter}>
            {Array.isArray(data?.filters) ? data.filters
              .filter((item: FilterItem) => item?.pin === true)
              .map((filter: FilterItem, index: number) => (
                <Form.Item
                  label={filter.title}
                  key={`${filter.name}_${filter.operation}`}
                  name={`${filter.name}_${filter.operation}`}
                  style={{ marginBottom: 0 }}
                >
                  <FilterControl
                    item={filter}
                    style={{ minWidth: 180 }}
                    onChange={handleApply}
                  />
                </Form.Item>
              )) : null}
          </Form>
        ) : null}
        {add && add}

        {data.sorts && (
          <SortPopover
            options={data.sorts.values}
            showLabel={data.sorts.showLabel}
            onSorts={onSorts}
          />
        )}
        {isBtnFilter && !isMobile ? (
          <Popover
            content={
              <Flex vertical style={{ width: 300 }}>
                {content}
              </Flex>
            }
            title={title}
            trigger="click"
            open={open}
            arrow={false}
            onOpenChange={handleOpenChange}
            placement="bottom"
          >
            <Button type="primary" ghost icon={<FilterOutlined />} />
          </Popover>
        ) : (
          <Drawer title={title} onClose={() => setOpen(false)} open={open}>
            {content}
          </Drawer>
        )}
      </Flex>
    </Flex>
  );
};

export default memo(HeaderOperation);

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    padding-block: 16px;
  `,

  formFilter: css`
    & > div:last-child {
      margin-inline-end: 0;
    }
  `,
}));
