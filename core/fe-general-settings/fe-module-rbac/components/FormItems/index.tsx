import { Col, Flex, Input, Row, Spin, Switch, Typography } from "antd";
import { Form } from "antd";
import TablePermission from "../PermissionTable";

const { TextArea } = Input;

interface Props {
  data: any;
  isLoading: boolean;
  isEdit?: boolean;
  disabled?: boolean;
}

const FormItems = (props: Props) => {
  const { data, isLoading, isEdit, disabled } = props;
  console.log("FormItems data", data);
  return (
    <>
      <Row gutter={[16, 0]}>
        <Col xs={24} lg={12}>
          <Form.Item
            name="code"
            label="Mã phân quyền"
            rules={[
              { required: true, message: "Vui lòng nhập mã phân quyền" },
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
            <Input placeholder="Nhập mã phân quyền" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            name="name"
            label="Tên phân quyền"
            rules={[
              {
                pattern: /^[a-zA-Z0-9\sÀ-ỹ\-_]+$/,
                message: "Chỉ được nhập chữ, số, khoảng trắng, dấu - hoặc _",
              },
              { required: true, message: "Vui lòng nhập tên phân quyền" },
              { max: 64, message: "Không được nhập quá 64 ký tự" },
            ]}
          >
            <Input placeholder="Nhập tên phân quyền" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              {
                pattern: /^[a-zA-Z0-9\sÀ-ỹ\-_]+$/,
                message: "Chỉ được nhập chữ, số, khoảng trắng, dấu - hoặc _",
              },
              { max: 200, message: "Không được nhập quá 200 ký tự" },
            ]}
          >
            <TextArea placeholder="Nhập mô tả" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          {isEdit && (
            <Form.Item name="isActive" label={"Hoạt động"}>
              <Switch />
            </Form.Item>
          )}
        </Col>
      </Row>
      <Flex vertical gap={12}>
        <Typography.Text strong>BẢNG DANH SÁCH CHỨC NĂNG</Typography.Text>
        <Spin spinning={isLoading}>
          <TablePermission data={data} disabled={disabled} />
        </Spin>
      </Flex>
    </>
  );
};

export default FormItems;
