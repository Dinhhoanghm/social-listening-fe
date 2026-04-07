// @ts-nocheck
import { Flex } from "antd";
import React, { FC, memo } from "react";
import GlobalLogo from "../GlobalLogo";
import {
  GLOBAL_SIDER_MENU_ID,
  ThemeLayoutMode,
  LAYOUT_MODE_VERTICAL_MIX,
  LAYOUT_MODE_HORIZONTAL_MIX,
} from "../../constants";
import { createStyles } from "antd-style";

interface Props {
  mode: ThemeLayoutMode;
  headerHeight: number;
  siderCollapse: boolean;
  inverted?: boolean;
}

const GlobalSider: FC<Props> = (props: Props) => {
  const { styles } = useStyles();
  const { mode, headerHeight, siderCollapse, inverted } = props;
  const showLogo =
    mode !== LAYOUT_MODE_VERTICAL_MIX && mode !== LAYOUT_MODE_HORIZONTAL_MIX;

  return (
    <Flex vertical>
      {showLogo && (
        <GlobalLogo
          showTitle={!siderCollapse}
          style={{
            height: headerHeight,
            display: "flex",
            alignItems: "center",
            paddingLeft: 32,
          }}
        />
      )}
      <div id={GLOBAL_SIDER_MENU_ID} className={styles.slderMenu} />
    </Flex>
  );
};

export default memo(GlobalSider);

const useStyles = createStyles(({ token, css }) => ({
  // Also supports obtaining the same writing experience as normal css through css string templates
  slderMenu: css`
    height: calc(100vh - 112px);
    overflow-y: auto;
  `,
}));
