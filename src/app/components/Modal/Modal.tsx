import { forwardRef, ForwardedRef } from "react";
import { twMerge } from "tailwind-merge";

type ModalProps = {
  children: React.ReactNode;
  className?: string;
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ children, className }, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000000B2] px-[24px]">
        <div
          ref={ref}
          className={twMerge(
            `w-full max-w-[540px] rounded-[8px] bg-white`,
            className,
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);

Modal.displayName = "Modal";

export default Modal;
