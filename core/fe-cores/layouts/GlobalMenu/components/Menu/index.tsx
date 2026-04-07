// @ts-nocheck
"use client";
import React, { memo, useEffect, useMemo, useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { appSelector } from "../../../../reducers/app";
import useLayoutBase from "../../../LayoutBase/useLayoutBase";
import { renderIcon } from "../../../../utils/renderIcon";

interface Props {
  mode: "inline" | "horizontal";
}

const mapMenuItems = (items: any): MenuProps["items"] => {
  return items.map((item: any) => {
    const processedIcon = renderIcon(item.icon);

    if (item.children) {
      // Nếu có children, tạo submenu
      return {
        key: item.key,
        icon: processedIcon,
        label: item.label,
        children: mapMenuItems(item.children), // Đệ quy render children
      };
    }

    // Nếu không có children, tạo menu item với Link
    return {
      key: item.key,
      icon: processedIcon,
      label: (
        <Link href={item.link} target={item.target || "_self"}>
          {item.label}
        </Link>
      ),
    };
  });
};

const getLevelKeys = (items1: LevelKeysProps[]) => {
  const key: Record<string, number> = {};
  const func = (items2: LevelKeysProps[], level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};

interface LevelKeysProps {
  key?: string;
  children?: LevelKeysProps[];
}

const MenuBase: React.FC<Props> = (props: Props) => {
  const path = usePathname();
  const { mode = "inline" } = props;
  const items = useSelector(appSelector.getItemsMenu);
  const theme = useSelector(appSelector.getTheme);
  const { isMobile, collapsedSider } = useLayoutBase();
  const darkMode = useSelector(appSelector.getDarkModeSider);
  const [current, setCurrent] = useState(path);
  const [stateOpenKeys, setStateOpenKeys] = useState([]);

  useEffect(() => {
    setCurrent(findActiveMenuKey(path, items));
    setStateOpenKeys(getDefaultOpenKeys(path, items));
  }, [path, items]);

  const findActiveMenuKey = (currentPath: string, menuItems: any[]): string => {
    const findMatchingKey = (items: any[]): string | null => {
      for (const item of items) {
        // Exact match
        if (item.link === currentPath) {
          return item.key;
        }
        
        // Check children first for exact matches
        if (item.children) {
          const childMatch = findMatchingKey(item.children);
          if (childMatch) return childMatch;
        }
        
        // Parent-child relationship: check if current path starts with menu link
        if (item.link && currentPath.startsWith(item.link + '/')) {
          return item.key;
        }
      }
      return null;
    };
    
    return findMatchingKey(menuItems) || currentPath;
  };

  const getDefaultOpenKeys = (path: string, items: any[]): string[] => {
    const findKeys = (
      items = [],
      parentKeys: string[] = []
    ): string[] | null => {
      for (const item of items) {
        const newParentKeys = [...parentKeys, item.key];

        // Check for exact match or parent-child relationship
        if (item.key === path || (item.link && path.startsWith(item.link + '/'))) {
          return newParentKeys.slice(0, -1); // Bỏ path, chỉ lấy key cha
        }

        if (item.children) {
          const result = findKeys(item.children, newParentKeys);
          if (result) return result;
        }
      }
      return null;
    };

    return findKeys(items) || [];
  };

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  const setOpenKeys = (openKeys: any) => {
    const levelKeys = getLevelKeys(items as LevelKeysProps[]);

    const currentOpenKey = openKeys.find(
      (key: string) => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

  const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
    setOpenKeys(openKeys);
  };

  // Trường hợp mobile thì luôn hiển thị thông tin chi tiết menu
  const _inlineCollapsed = useMemo(() => {
    if (isMobile) {
      return false;
    }
    return collapsedSider;
  }, [collapsedSider, isMobile]);

  const menuItems = useMemo(() => mapMenuItems(items), [items]);

  return (
    <Menu
      theme={darkMode && mode === "inline" ? "dark" : theme}
      onClick={onClick}
      selectedKeys={[current]}
      defaultSelectedKeys={[current]}
      style={{ height: "100%" }}
      defaultOpenKeys={getDefaultOpenKeys(path, items)}
      openKeys={stateOpenKeys}
      onOpenChange={onOpenChange}
      mode={mode}
      inlineCollapsed={_inlineCollapsed}
      items={menuItems}
    />
  );
};

export default memo(MenuBase);
