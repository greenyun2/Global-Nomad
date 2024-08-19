"use client";

import React from "react";
import Image from "next/image";
import Notifications from "../Notification/Notifications";
import { useDropdown } from "@hooks/useDropdown";
import Notification from "@icons/icon_notification.svg";

export default function NotificationMenu() {
  const { ref, isOpen, toggle, close } = useDropdown();

  return (
    <div className="relative flex" ref={ref}>
      <button onClick={toggle}>
        <Image src={Notification} alt="알림" width={24} height={24} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-2 w-[368px] min-w-40 rounded-lg border border-gray-400 bg-[#CBD8D5] px-5 py-6 shadow-custom-shadow-01">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <Notifications close={close} />
          </div>
        </div>
      )}
    </div>
  );
}
