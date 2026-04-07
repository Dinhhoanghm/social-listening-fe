"use client";
import { APP_STATE } from "@/fe-cores/reducers";

export const appConfig: APP_STATE = {
  layoutMode: "vertical",
  header: {
    title: "Thu thập dữ liệu",
    showTitle: true,
    showLogo: false,
    logo: "",
    logoCompact: "",
    heightLogo: 20,
    headerHeight: 64,
  },
  sider: {
    showSider: true,
    inverted: false,
    collapsedSider: false,
    collapsedWidth: 80,
    width: 260,
    darkMode: false,
  },
  memu: {
    showMenuToggler: false,
    showMenu: true,
    items: [],
  },
  pageTab: {
    isPageTab: false,
  },
  footer: {
    showFooter: false,
    height: 48,
  },
  isMobile: false,
  theme: "light",
  rootRoute: "/crawler/config",
};
