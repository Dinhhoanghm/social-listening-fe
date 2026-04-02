import { memo } from "react";

//Components
import ADeleteModal from "@/fe-component/ATable/ADeleteModal";

//Apis
import { useDeleteUserMutation } from "../../apis";

// Constants
import { User } from "../../constants/type";

interface Props {
  data: User;
  refresh: () => void;
  open: boolean;
  onCancelModal: () => void;
}

const DeleteModal = (props: Props) => {
  const { data, open, onCancelModal, refresh } = props;

  return (
    <>
      <ADeleteModal
        title="Xóa tài khoản"
        open={open}
        useMutationHook={useDeleteUserMutation}
        onCancelModal={onCancelModal}
        data={{ ...data, name: data?.username }}
        refresh={refresh}
      />
    </>
  );
};

export default memo(DeleteModal);
