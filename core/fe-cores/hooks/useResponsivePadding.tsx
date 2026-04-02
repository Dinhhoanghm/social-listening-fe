"use client";
import { useState, useEffect } from "react";
import { useTheme } from "antd-style";
import { Grid } from "antd";

const { useBreakpoint } = Grid;

export const useResponsivePadding = () => {
  const token = useTheme();
  const { xs, sm, md, lg, xl, xxl } = useBreakpoint(); // Lấy các breakpoint từ useResponsive
  const [padding, setPadding] = useState(token.padding); // Giá trị padding mặc định

  useEffect(() => {
    // Dựa vào các giá trị xs, sm, md, lg, xl để xác định padding
    if (xxl) {
      setPadding(token.padding);
    } else if (xl) {
      setPadding(token.padding);
    } else if (lg) {
      setPadding(token.paddingMD);
    } else if (md) {
      setPadding(token.paddingSM);
    } else if (sm) {
      setPadding(token.paddingXS);
    } else {
      setPadding(token.paddingXXS);
    }
  }, [xs, sm, md, lg, xl, xxl]);

  return padding;
};
