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
    return (
      <Modal ref={ref}>
        <div className="flex flex-col">
          <div className="flex h-14 place-content-between items-center bg-gray-200 px-4">
            <h2 className="font-bold text-gray-800">주소찾기</h2>
            <button onClick={toggle}>
              <Image src={IconClose} alt="닫기 버튼" width={28} height={28} />
            </button>
          </div>

          <div className="w-full text-[16px] font-[500] text-[#333236] md:text-[18px]">
            <DaumPostcode
              style={{ width: "100%", height: 480 }}
              onComplete={onComplete}
            ></DaumPostcode>
          </div>
        </div>
      </Modal>
    );
  },
);

AddressModal.displayName = "AddressModal";

export default AddressModal;
