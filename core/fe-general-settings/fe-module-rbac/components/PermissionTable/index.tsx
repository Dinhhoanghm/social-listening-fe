import { Checkbox, Form, Select } from "antd";
import { useEffect, useMemo } from "react";

// Components
import ATable from "@/fe-component/ATable";

interface Props {
  data: any;
  disabled?: boolean;
}

const actionView = "view";

const PermissionTable = (props: Props) => {
  const form = Form.useFormInstance();
  const { data, disabled } = props;

  useEffect(() => {
    form.setFieldValue("menus", setStatusMenus(data?.menus, false));
  }, [data]);

  const dataSource =
    Form.useWatch("menus", form) || form.getFieldValue("menus");

  const permissionAccesses = useMemo(() => {
    return data?.permissionAccesses || [];
  }, [data?.permissionAccesses]);

  const setStatusMenus: any = (data: any, isParentDisabled: boolean) => {
    if (Array.isArray(data)) {
      return data.map((item: any) => {
        return setStatusMenus(item, isParentDisabled);
      });
    } else {
      if (!data) {
        return;
      }
      if (!isParentDisabled) {
        const isViewDisabled = data?.permissions.some(
          (permission: any) =>
            permission?.action === actionView && permission?.isCheck,
        );
        const children = setStatusMenus(data?.children, !isViewDisabled);
        return {
          ...data,
          permissionAccessId:
            data.permissionAccessId ?? permissionAccesses[0]?.id,
          isViewDisabled: false,
          isSelectDisabled: false,
          children: children,
        };
      } else {
        return {
          ...data,
          isViewDisabled: true,
          isSelectDisabled: true,
          permissionAccessId:
            data.permissionAccessId ?? permissionAccesses[0]?.id,
          permissions: data?.permissions.map((permission: any) => ({
            ...permission,
            isCheck: false,
          })),
          children: setStatusMenus(data?.children, true),
        };
      }
    }
  };

  const changePermission: any = (
    id: number,
    dataUpdate: any,
    permissionData: any,
  ) => {
    if (Array.isArray(permissionData)) {
      return permissionData.map((permission: any) => {
        return changePermission(id, dataUpdate, permission);
      });
    } else {
      if (permissionData.id === id) {
        return setStatusMenus(
          {
            ...permissionData,
            ...dataUpdate,
          },
          false,
        );
      } else {
        if (!!permissionData.children) {
          return {
            ...permissionData,
            children: changePermission(id, dataUpdate, permissionData.children),
          };
        } else {
          return permissionData;
        }
      }
    }
  };

  const handleChangePermission = (id: number, dataUpdate: any) => {
    const updateDataSource = changePermission(id, dataUpdate, dataSource);
    form.setFieldValue("menus", updateDataSource);
  };

  return (
    <>
      <Form.Item hidden name="menus"></Form.Item>
      <ATable
        rowKey={"id"}
        columns={[
          {
            key: "name",
            title: "Tên chức năng",
            dataIndex: "name",
          },

          {
            key: "permissions",
            title: "Phân quyền",
            dataIndex: "permissions",
            width: "50vw",
            render: (permissions, row) => {
              const viewIsCheck = permissions?.some(
                (permission: any) =>
                  permission.action === actionView && permission.isCheck,
              );
              return permissions?.map((permission: any) => (
                <Checkbox
                  checked={
                    permission.action === actionView
                      ? permission?.isCheck
                      : viewIsCheck && permission?.isCheck
                  }
                  disabled={
                    (permission.action !== actionView && !viewIsCheck) ||
                    row?.isViewDisabled ||
                    !!disabled
                  }
                  onChange={(value) => {
                    const permissionsUpdate =
                      viewIsCheck && permission.action === actionView
                        ? (row?.permissions || []).map((item: any) => ({
                            ...item,
                            isCheck: false,
                          }))
                        : (row?.permissions || []).map((item: any) =>
                            item.id === permission.id
                              ? { ...item, isCheck: value?.target?.checked }
                              : item,
                          );
                    handleChangePermission(row?.id, {
                      permissions: permissionsUpdate,
                    });
                  }}
                  style={{ paddingRight: 12 }}
                >
                  {permission?.name}
                </Checkbox>
              ));
            },
          },
        ]}
        dataSource={dataSource}
        scroll={{ x: "max-content", y: 480 }}
        pagination={false}
      />
    </>
  );
};

export default PermissionTable;
