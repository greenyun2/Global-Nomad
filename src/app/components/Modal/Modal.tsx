import { forwardRef, ForwardedRef } from "react";

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void; // onClose를 포함
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ children, onClose }, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000000B2] px-[24px]" onClick={onClose}>
        <div ref={ref} className="w-full max-w-[540px] rounded-[8px] bg-white" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    );
  },
);

Modal.displayName = "Modal";

export default Modal;
