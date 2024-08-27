import { ForwardedRef, forwardRef } from "react";
import Button from "@app/components/Button/Button";
import Modal from "@app/components/Modal/Modal";
import Image from "next/image";
import icon_check from "@icons/icon_check.svg";

type ConfirmModalProps = {
  ref: ForwardedRef<HTMLDivElement>;
  toggle: () => void;
  handleDelete: () => void;
};

export const ConfirmModal = forwardRef<HTMLDivElement, ConfirmModalProps>(
  ({ toggle, handleDelete }, ref) => {
    return (
      <Modal ref={ref}>
        <div className="flex flex-col items-center gap-[43px] px-[60px] pb-[28px] pt-[81px] md:px-[28px]">
          <Image src={icon_check} alt="check icon" />
          <div className="text-[16px] font-[500] text-[#333236] md:text-[18px]">
            정말 삭제하시겠어요?
          </div>
          <div className="flex gap-2">
            <Button
              className="text-[14px] md:w-[120px] md:place-self-end md:text-[16px]"
              size="md"
              color="bright"
              onClick={toggle}
            >
              아니오
            </Button>
            <Button
              className="text-[14px] md:w-[120px] md:place-self-end md:text-[16px]"
              size="md"
              color="dark"
              onClick={handleDelete}
            >
              삭제하기
            </Button>
          </div>
        </div>
      </Modal>
    );
  },
);

ConfirmModal.displayName = "ConfirmModal";

export default ConfirmModal;
