import { ForwardedRef, forwardRef } from "react";
import Button from "@app/components/Button/Button";
import Modal from "@app/components/Modal/Modal";

type FormErrorMessageModalProps = {
  ref: ForwardedRef<HTMLDivElement>;
  errorMessage: string | undefined;
  toggle: () => void;
};

export const FormErrorMessageModal = forwardRef<
  HTMLDivElement,
  FormErrorMessageModalProps
>(({ errorMessage, toggle }, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <Modal ref={ref}>
      <div className="flex flex-col items-center gap-[43px] px-[60px] pb-[28px] pt-[81px] md:px-[28px] md:pt-[108px]">
        <div className="text-[16px] font-[500] text-[#333236] md:text-[18px]">
          {errorMessage}
        </div>
        <Button
          className="md:w-[120px] md:place-self-end"
          size="md"
          color="dark"
          onClick={() => toggle()}
        >
          확인
        </Button>
      </div>
    </Modal>
  );
});

FormErrorMessageModal.displayName = "FormErrorMessageModal";

export default FormErrorMessageModal;
