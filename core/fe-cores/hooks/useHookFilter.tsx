// @ts-nocheck
import { SearchBody } from "fe-base/apis";
import {
  cloneDeep,
  findIndex,
  has,
  includes,
  isArray,
  isEmpty,
  isObject,
  isString,
  merge,
  remove,
  some,
} from "lodash";
import { useCallback, useState } from "react";

const defaultFilter: SearchBody = {
  keyword: "",
  pageSize: 10,
  page: 1,
  filters: [],
};

type UpdateFilterParam = string | Partial<SearchBody> | "reset";

export const useHookFilter = (initialFilter?: Partial<SearchBody>) => {
  const [filters, setFilters] = useState<SearchBody>(
    merge({}, defaultFilter, initialFilter)
  );

  const isEmptyValue = (value: any): boolean => {
    // Xử lý đặc biệt cho giá trị boolean
    if (typeof value === "boolean" || typeof value === "number") {
      return false; // Boolean (true/false) không được coi là rỗng
    }

    // Xử lý các trường hợp khác
    return isEmpty(value) || value === null || value === undefined;
  };

  const updateFilter = useCallback(
    (keyOrObj: UpdateFilterParam, value?: any) => {
      // Case: Reset filters
      if (keyOrObj === "reset") {
        setFilters(defaultFilter);
        return;
      }

      setFilters((prev) => {
        // Case: Update via object
        if (isObject(keyOrObj) && !isString(keyOrObj)) {
          const newState = cloneDeep(prev);
          const updatedFields = keyOrObj as Partial<SearchBody>;

          // Determine if we need to reset page
          let shouldResetPage = some(
            ["keyword", "pageSize", "fieldsSearch"],
            (key) => has(updatedFields, key)
          );

          // Cập nhật các trường cơ bản khác
          if ("keyword" in updatedFields)
            newState.keyword = updatedFields.keyword || "";
          if ("filters" in updatedFields)
            newState.filters = updatedFields.filters || [];
          if ("fieldsSearch" in updatedFields)
            newState.fieldsSearch = updatedFields.fieldsSearch || "";
          if ("pageSize" in updatedFields)
            newState.pageSize = updatedFields.pageSize || 10;
          if ("page" in updatedFields) newState.page = updatedFields.page || 1;

          // Reset page if needed
          if (shouldResetPage && !("page" in updatedFields)) {
            newState.page = 1;
          }

          return newState;
        }

        // Case: Update base property
        if (includes(["keyword", "pageSize", "page"], keyOrObj)) {
          const resetPage = includes(["keyword", "pageSize"], keyOrObj);
          return {
            ...prev,
            [keyOrObj]: value,
            page: resetPage ? 1 : prev.page,
          };
        }

        // Case: Update filter
        const newFilters = cloneDeep(prev.filters);
        const filterIndex = findIndex(newFilters, { name: keyOrObj });

        if (filterIndex === -1) {
          // Filter không tồn tại, thêm mới nếu giá trị không rỗng
          if (!isEmptyValue(value)) {
            newFilters.push({
              name: keyOrObj as string,
              operation: isArray(value) ? "in" : "eq",
              value,
            });
          }
        } else {
          // Filter đã tồn tại
          if (isEmptyValue(value)) {
            // Xóa filter nếu giá trị rỗng
            remove(newFilters, (_, i) => i === filterIndex);
          } else {
            // Cập nhật giá trị
            newFilters[filterIndex].value = value;
          }
        }

        return {
          ...prev,
          filters: newFilters,
          page: 1, // Reset page when updating filters
        };
      });
    },
    []
  );

  // // Hàm này trả về filters đã loại bỏ các giá trị rỗng
  // const getCleanFilters = useCallback(() => {
  //   return {
  //     ...filters,
  //     filters: filters.filters.filter((filter) => !isEmptyValue(filter.value)),
  //   };
  // }, [filters]);

  return { filters, updateFilter };
};
