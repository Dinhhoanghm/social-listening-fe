import React, { useState } from "react";

// Components
import { Button, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import FormItems from "../FormItems";

// Common
import { useMobile } from "@/fe-cores/common";

// Apis
import { useAddRbacMutation, useGetRbacPermissionQuery } from "../../apis";
import { useApiPostMutation } from "@/fe-cores/hooks/useApiMutation";
import { SubmitRbac } from "../../constants/type";
import AModal from "@/fe-component/AModal";

interface Props {
  refresh: () => void;
}

export const getMenusSubmitData: any = (dataSubmit: any) => {
  if (Array.isArray(dataSubmit)) {
    return dataSubmit
      .filter((data: any) =>
        data.permissions.some((permission: any) => permission?.isCheck),
      )
      .map((data: any) => {
        return getMenusSubmitData(data);
      });
  } else {
    return {
      id: dataSubmit?.id,
      permissionAccessId: dataSubmit?.permissionAccessId,
      permissionIds: (dataSubmit?.permissions || [])
        .filter((permission: any) => permission.isCheck)
        .map((permission: any) => permission?.id),
      children: getMenusSubmitData(dataSubmit?.children || []),
    };
  }
};

function CreateModal(props: Props) {
  const isMobile = useMobile();
  const { refresh } = props;
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: dataPermission, isLoading: isLoadingGetPermission } =
    useGetRbacPermissionQuery({});

  const { callPostApi, isLoading } = useApiPostMutation({
    useMutationHook: useAddRbacMutation,
    onSuccess: () => {
      setOpen(false);
      form.resetFields();
      refresh();
    },
    successMessage: "Thêm quyền thành công!",
  });

  const handleSubmit = (values: SubmitRbac) => {
    callPostApi({
      code: values?.code,
      name: values?.name,
      description: values?.description,
      isActive: true,
      menus: getMenusSubmitData(values.menus),
    });
  };

  return (
    <>
      <Button
        loading={isLoading}
        onClick={() => setOpen(true)}
        type="primary"
        icon={<PlusOutlined />}
      >
        {!isMobile ? "Thêm mới" : ""}
      </Button>
      <AModal
        key={`${open}`}
        title={"Thêm mới phân quyền"}
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        footer={[
          <Button
            key="btn-cancel"
            onClick={() => {
              setOpen(false);
              form.resetFields();
            }}
          >
            Hủy
          </Button>,
          <Button
            key="btn-create"
            loading={isLoading}
            type="primary"
            form={"form-create"}
            htmlType="submit"
          >
            Tạo mới
          </Button>,
        ]}
        width={"1048px"}
      >
        <Form
          id={"form-create"}
          form={form}
          onFinish={handleSubmit}
          style={{ marginTop: "20px" }}
          layout="vertical"
        >
          <FormItems data={dataPermission} isLoading={isLoadingGetPermission} />
        </Form>
      </AModal>
    </>
  );
}

export default CreateModal;
