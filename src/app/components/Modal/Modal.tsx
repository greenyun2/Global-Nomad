import { forwardRef, ForwardedRef } from "react";

type ModalProps = {
  children: React.ReactNode;
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ children }, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div className="min-w-72 fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000000B2] px-[24px]">
        <div ref={ref} className="w-full max-w-[540px] rounded-[8px] bg-white overflow-hidden">
          {children}
        </div>
      </div>
    );
  },
);

Modal.displayName = "Modal";

export default Modal;
