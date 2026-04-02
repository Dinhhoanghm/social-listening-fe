import React from "react";
import { Card, Dropdown, Flex, Typography, Button, Tooltip } from "antd";
import isEmpty from "lodash/isEmpty";
import isFunction from "lodash/isFunction";
import { MoreOutlined } from "@ant-design/icons";

const BranchCard = (title: string, icon: any, depth = 0, menu, data) => {
  const isActive = data?.isActive === undefined || data?.isActive;
  const menuItems = menu
    .map((item, index) => {
      if (isFunction(item.visible) && !item.visible(data)) {
        return null;
      }
      return {
        key: `${item.key}_${index}`,
        label: item.label,
        icon: item.icon,
        onClick: ({ key, keyPath, domEvent }) => {
          item.onClick({ key, keyPath, domEvent, data });
        },
      };
    })
    .filter((item) => !!item);
  return (
    <Card
      style={{
        width: 380 - depth * 52,
        textAlign: "left",
        boxShadow: "0px 0px 8px 0px #00000040",
        borderRadius: "8px",
        background: !isActive && "#E6FFFB",
        opacity: isActive ? 1 : 0.75,
      }}
      styles={{ body: { padding: "12px" } }}
    >
      <Flex align="center">
        <Flex
          align="center"
          justify="space-around"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "12px",
            background: "#1890FF",
            marginRight: "12px",
          }}
        >
          {icon}
        </Flex>
        <div style={{ width: 380 - 112 - depth * 52 }}>
          <Tooltip title={title}>
            <Typography.Paragraph
              title={title}
              style={{
                fontWeight: 500,
                fontSize: 16,
                lineHeight: "24px",
                margin: 0,
              }}
              ellipsis={{ rows: 2 }}
            >
              {title}
            </Typography.Paragraph>
          </Tooltip>
          <Typography.Text
            type="secondary"
            style={{
              fontSize: "12px",
              lineHeight: "20px",
            }}
          >
            {`${data?.numOfEmployees || 0} Nhân sự`}
          </Typography.Text>
        </div>
        {!isEmpty(menuItems) && (
          <div
            style={{
              position: "absolute",
              top: "30%",
              right: 8,
            }}
          >
            <Dropdown
              menu={{
                items: menuItems,
              }}
              trigger={["hover"]}
            >
              <Button
                type="text"
                shape="circle"
                icon={<MoreOutlined style={{ fontSize: 16 }} />}
              />
            </Dropdown>
          </div>
        )}
      </Flex>
    </Card>
  );
};

export default BranchCard;
