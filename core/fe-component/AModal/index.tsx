import React, { memo } from "react";
import { Modal, ModalProps } from "antd";
import { createStyles } from "antd-style";

/**
 * Component Modal base với khả năng tự động xử lý scroll khi nội dung quá dài
 */
const AModal: React.FC<ModalProps> = ({
  children,
  className,
  ...restProps
}) => {
  const { styles, cx } = useStyles();
  return (
    <Modal
      className={cx(`${styles.container} ${className}`)}
      styles={{
        body: {
          maxHeight: "calc(100vh - 180px)",
          maxWidth: "calc(100vw - 180px)",
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: "16px",
        },
      }}
      centered
      {...restProps}
    >
      {children}
    </Modal>
  );
};

export default memo(AModal);

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    & .ant-modal-content {
      padding: 20px 8px 20px 24px;
    }
    & .ant-modal-footer {
      padding-right: 16px;
    }
  `,
}));
