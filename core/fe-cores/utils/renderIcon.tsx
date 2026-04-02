"use client";
import React from "react";
import { Image } from "antd";
import * as AntdIcons from "@ant-design/icons";

export const renderIcon = (iconValue: any) => {
  if (!iconValue) return null;

  const func = (icon: string) => {
    // Check if it's a URL (simple check for http/https or starts with /)
    if (icon.startsWith("http") || icon.startsWith("/")) {
      return (
        <Image
          src={icon}
          width={"1em"}
          preview={false}
          style={{ height: "1em" }}
          wrapperClassName="ant-menu-item-icon"
        />
      );
    }

    // Directly use the icon name as provided
    // Assuming your icon names exactly match Ant Design's component names
    const AntIcon: any = AntdIcons[icon as keyof typeof AntdIcons];

    // Return the icon component if it exists
    if (AntIcon) {
      return <AntIcon />;
    }

    // If icon doesn't exist, return null or a fallback icon
    console.warn(`Icon "${icon}" not found in Ant Design icons`);
    return null;
  };

  // Check if icon is a string
  if (typeof iconValue === "string") {
    return func(iconValue);
  }

  // If icon is already a React element, return it as is
  if (React.isValidElement(iconValue)) {
    return iconValue;
  }

  // Check if icon is a object
  if (typeof iconValue === "object") {
    return func(iconValue?.value || "");
  }
};
