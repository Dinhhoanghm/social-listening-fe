import { Button, Form, Input, Modal, Switch } from "antd";
import { FC, memo } from "react";
import { usePutUpdateBranchMutation } from "../../apis";
import { useApiPutMutation } from "@/fe-cores/hooks/useApiMutation";
import BranchTreeSelect from "../BranchTreeSelect";
import { EditBranch } from "../../constants/type";

interface propsType {
  initialValues: EditBranch;
  open: boolean;
  onClose: Function;
  onRefresh: Function;
}

const EditModal: FC<propsType> = (props: propsType) => {
  const { initialValues, open, onClose, onRefresh } = props;

  const { callPutApi, isLoading } = useApiPutMutation({
    useMutationHook: usePutUpdateBranchMutation,
    onSuccess: () => {
      onRefresh();
      onClose();
    },
    successMessage: "Cập nhật chi nhánh thành công",
  });

  const handleSubmit = (data: any) => {
    callPutApi(data, { id: initialValues?.id });
  };

  return (
    <Modal
      title={"Chỉnh sửa chi nhánh/ban/phòng"}
      onCancel={() => onClose()}
      destroyOnClose
      footer={[
        <Button key="btn-cancel" onClick={() => onClose()}>
          Hủy
        </Button>,
        <Button
          key="btn-submit"
          loading={isLoading}
          form={"form-branch"}
          type="primary"
          htmlType="submit"
        >
          Lưu
        </Button>,
      ]}
      open={open}
      centered
    >
      <Form
        id={"form-branch"}
        initialValues={initialValues}
        onFinish={handleSubmit}
        layout="vertical"
        style={{ marginTop: 20 }}
      >
        <Form.Item
          label={"Mã chi nhánh"}
          name={"code"}
          rules={[
            { required: true, message: "Vui lòng nhập mã chi nhánh" },
            { max: 24, message: "Không được nhập quá 24 ký tự" },
            {
              pattern: /^[a-zA-Z0-9\sÀ-ỹ\-_]+$/,
              message: "Chỉ được nhập chữ, số, khoảng trắng, dấu - hoặc _",
            },
            () => ({
              validator(_, value) {
                if (value && value.startsWith(" ")) {
                  return Promise.reject("Không được nhập dấu cách đầu tiên");
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input placeholder={"Nhập mã chi nhánh"} />
        </Form.Item>
        <Form.Item
          label={"Tên chi nhánh"}
          name={"name"}
          rules={[
            {
              pattern: /^[a-zA-Z0-9\sÀ-ỹ\-_]+$/,
              message: "Chỉ được nhập chữ, số, khoảng trắng, dấu - hoặc _",
            },
            { required: true, message: "Vui lòng nhập tên chi nhánh" },
            { max: 64, message: "Không được nhập quá 64 ký tự" },
          ]}
        >
          <Input placeholder={"Nhập tên chi nhánh"} />
        </Form.Item>
        <Form.Item label={"Thuộc chi nhánh"} name={"parentId"}>
          <BranchTreeSelect
            placeholder={"Chọn chi nhánh"}
            fieldNames={{ label: "name", value: "id" }}
          />
        </Form.Item>
        <Form.Item label={"Hoạt động"} name={"isActive"}>
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(EditModal);
