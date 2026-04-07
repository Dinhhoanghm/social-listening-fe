// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useMemo, useState, useEffect, useCallback } from "react";
import { TablePaginationConfig, TableProps } from "antd/es/table";
import { useHeightContent } from "../hooks/useHeightContent";
import { useResponsivePadding } from "../hooks/useResponsivePadding";
import { useMobile } from "./mobile";
import { SearchBody } from "fe-base/apis";
import { useLayoutBase } from "../layouts";
import { useMessage } from "../components/MessageProvider";
import { useHookFilter } from "../hooks/useHookFilter";

type SIZE = { small: number; middle: number; large: number };

const HEADER_TABLE_SIZE: SIZE = {
  small: 39,
  middle: 47,
  large: 55,
};

const FOOTER_TABLE_SIZE: SIZE = {
  small: 56,
  middle: 56,
  large: 64,
};

const CARD_PADDING = 32;

const TABLE_HEADER_OPERAITION_HEIGHT = 58;

interface TableScrollProps {
  scrollX?: number;
  isHidePadding?: boolean;
  isHideCard?: boolean;
  size?: "small" | "middle" | "large";
  minHeight?: number;
  deductionHeight?: number;
  isPagination?: boolean;
  isFooter?: boolean;
  isHeaderOperaiton?: boolean;
}

/**
 * useTableScroll - Hook tính toán scroll của table
 * Mục đích - Bảng table luôn nằm trong 1 màn hình thì cần tính toán scroll table trong màn hình đó
 * @param {Object} props - Props của component
 * @param {number} props.scrollX - Giới hạn scrollX(Mặc định là 960)
 * @param {boolean} props.isHidePadding - Trạng thái padding trên dưới(khi padding trên dưới Content 1 khoảng padding thì trạng thái là false, ngược lại là true)
 * @param {boolean} props.isHideCard - Trạng thái table có dùng component Card bao ngoài hay không(nêú có dùng thì sẽ phải trừ khoảng padding trên dưới của Card)
 * @param {string} props.size - Size của table(Nhắm mục đính tính toán chiều cao Header, Footer của table)
 * @param {number} props.minHeight - Chiều cao nhỏ nhất của table
 * @param {number} props.deductionHeight - Chiều cao còn lại của Content đã dùng
 * @param {boolean} props.isPagination - Trạng thái phân trạng(nếu có phân trang thì sẽ phải trừ đi chiều cao của phân trang)
 * @param {boolean} props.isFooter - Trạng thái dùng footer(nếu có footer thì sẽ phải trừ đi chiều cao của footer)
 */

export function useTableScroll(props: TableScrollProps) {
  const {
    scrollX = 960,
    isHidePadding = false,
    isHideCard = false,
    size = "large",
    minHeight = 120,
    deductionHeight = 0,
    isPagination = true,
    isHeaderOperaiton = false,
  } = props;
  const { footer } = useLayoutBase();
  const tableHeight = useHeightContent();
  const padding = useResponsivePadding();

  const scrollConfig = useMemo(() => {
    let PADDING = 0;
    let _CARD_PADDING = 0;
    let FOOTER_TABLE = 0;
    let PAGINATION_TABLE = 0;
    let _TABLE_HEADER_OPERAITION_HEIGHT = 0;
    if (!isHidePadding) {
      PADDING = padding;
    }

    if (!isHideCard) {
      _CARD_PADDING = CARD_PADDING;
    }

    if (isPagination) {
      PAGINATION_TABLE = FOOTER_TABLE_SIZE[size];
    }

    if (footer.showFooter) {
      FOOTER_TABLE = footer.height;
    }

    if (isHeaderOperaiton) {
      _TABLE_HEADER_OPERAITION_HEIGHT = TABLE_HEADER_OPERAITION_HEIGHT;
    }

    const HEADER_TABLE = HEADER_TABLE_SIZE[size];

    /**
     * scrollY - được tính toán lấy chiều cao của Content trừ đi các phần còn lại
     * đã hiển thị trên content, và các phần Header Footer Pagination của table
     */
    const scrollY =
      tableHeight -
      PADDING * 2 -
      HEADER_TABLE -
      FOOTER_TABLE -
      PAGINATION_TABLE -
      _CARD_PADDING -
      _TABLE_HEADER_OPERAITION_HEIGHT -
      deductionHeight;
    return { x: scrollX, y: Math.max(scrollY, minHeight) };
  }, [
    isHidePadding,
    isHideCard,
    size,
    tableHeight,
    deductionHeight,
    scrollX,
    minHeight,
    padding,
    isPagination,
  ]);

  return { scrollConfig };
}

/** ------------------------------------------------------------------ */

interface ConfigProps {
  useSearchMutation: any;
  bodyApi: SearchBody;
  updateSearchBody: (body: any) => void;
  columns: any[];
}

export function useHookTable(
  config: ConfigProps,
  paginationConfig?: Omit<
    TablePaginationConfig,
    "total" | "current" | "pageSize" | "onChange"
  >
) {
  const isMobile = useMobile();
  const { message } = useMessage();
  const { useSearchMutation, bodyApi, updateSearchBody, columns } = config;
  const [searchTable, { data, isLoading, isSuccess, isError, reset }] =
    useSearchMutation();
  const [isInitialFetchDone, setIsInitialFetchDone] = useState(false);

  // Memoize bodyApi để tránh re-render không cần thiết
  const currentBodyApi = useMemo(
    () => bodyApi,
    [
      bodyApi.page,
      bodyApi.pageSize,
      // Serialize các filter khác để so sánh
      JSON.stringify(
        Object.fromEntries(
          Object.entries(bodyApi).filter(
            ([key]) => !["page", "pageSize"].includes(key)
          )
        )
      ),
    ]
  );

  // Gọi API search table
  const searchTableApi = useCallback(
    async (body: SearchBody) => {
      try {
        const result = await searchTable(body).unwrap();
        return result;
      } catch (error) {
        message.error(error?.message);
        console.error("Error in searchTableApi:", error);
        return null;
      }
    },
    [searchTable]
  );

  // Gọi API khi bodyApi thay đổi
  useEffect(() => {
    const fetchData = async () => {
      await searchTableApi(currentBodyApi);
      if (!isInitialFetchDone) {
        setIsInitialFetchDone(true);
      }
    };

    fetchData();
  }, [currentBodyApi, searchTableApi]);

  // Tính toán total từ dữ liệu
  const total = useMemo(() => data?.total || 0, [data]);

  // Cấu hình pagination
  const pagination: TablePaginationConfig = useMemo(
    () => ({
      total,
      simple: isMobile,
      pageSizeOptions: ["10", "15", "20", "25", "30"],
      showSizeChanger: true,
      current: bodyApi.page,
      pageSize: bodyApi.pageSize,
      locale: { items_per_page: "/ trang" },
      onChange: (page: number, pageSize: number) => {
        updateSearchBody({
          page,
          pageSize,
        });
      },
      showTotal: (total, range) => `${range[0]} - ${range[1]} của ${total} mục`,
      ...paginationConfig,
    }),
    [
      total,
      isMobile,
      bodyApi.page,
      bodyApi.pageSize,
      updateSearchBody,
      paginationConfig,
    ]
  );

  const [checkedRowKeys, setCheckedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (keys) => {
    console.log("keys", keys);
    setCheckedRowKeys(keys);
  };

  const rowSelection: TableProps<T>["rowSelection"] = {
    columnWidth: 48,
    type: "checkbox",
    fixed: true,
    selectedRowKeys: checkedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  // Force refresh bảng
  const refreshTable = useCallback(async () => {
    return searchTableApi(currentBodyApi);
  }, [currentBodyApi, searchTableApi]);

  // Reset về trang đầu tiên
  const resetToFirstPage = useCallback(() => {
    updateSearchBody({
      page: 1,
    });
  }, [updateSearchBody]);

  return {
    tableProps: {
      loading: isLoading,
      pagination,
      dataSource: data?.items || [],
      columns,
    },
    rowSelection,
    checkedRowKeys,
    setCheckedRowKeys,
    data,
    isInitialFetchDone,
    isSuccess,
    isError,
    updateSearchBody,
    refreshTable,
    resetToFirstPage,
    setCheckedRowKeys,
    reset,
  };
}

/** ==================================================== */

export { useHookFilter };
