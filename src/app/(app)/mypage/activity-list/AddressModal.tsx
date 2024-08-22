import { ForwardedRef, forwardRef } from "react";
import DaumPostcode from "react-daum-postcode";
import Modal from "@app/components/Modal/Modal";
import Image from "next/image";
import IconClose from "@icons/icon_x_medium_24px.svg";

type AddressModalProps = {
  ref: ForwardedRef<HTMLDivElement>;
  toggle: () => void;
  onComplete: (data: any) => void;
};

export const AddressModal = forwardRef<HTMLDivElement, AddressModalProps>(
  ({ toggle, onComplete }, ref: ForwardedRef<HTMLDivElement>) => {
    const handleComplete = (data: any) => {
      onComplete(data);
      toggle();
    };

    return (
      <Modal ref={ref}>
        <div className="flex flex-col">
          <div className="w-full text-[16px] font-[500] text-[#333236] md:text-[18px]">
            <DaumPostcode
              style={{ width: "100%", height: 450 }}
              onComplete={handleComplete}
            ></DaumPostcode>
          </div>
        </div>
      </Modal>
    );
  },
);

AddressModal.displayName = "AddressModal";

export default AddressModal;