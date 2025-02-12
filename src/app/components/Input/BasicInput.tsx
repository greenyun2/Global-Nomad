"use client";

import React, { ForwardedRef, forwardRef, useState } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import icon_visibility_off from "@icons/icon_visibility_off.svg";
import icon_visibility_on from "@icons/icon_visibility_on.svg";

type BasicInputPropsType = {
  placeholder?: string;
  type: "email" | "password" | "text" | "number" | "textarea"; // textarea 추가
  id: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  invalid?: boolean;
  value?: string | number;
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => void;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const BasicInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  BasicInputPropsType
>(
  (
    {
      placeholder,
      id,
      type,
      onChange,
      onBlur,
      invalid,
      value,
      className,
      ...props
    },
    ref: ForwardedRef<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
      <section>
        <div className="relative flex items-center">
          {type === "textarea" ? (
            <textarea
              {...props}
              placeholder={placeholder}
              id={id}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref as ForwardedRef<HTMLTextAreaElement>}
              value={value}
              className={twMerge(
                `${invalid ? "border-red-100" : "border-gray-700"} h-[58px] w-full rounded-[6px] border px-[16px] py-[20px] text-[16px] font-[400] text-black`,
                className,
              )}
            />
          ) : (
            <input
              {...props}
              placeholder={placeholder}
              id={id}
              type={isPasswordVisible ? "text" : type}
              onChange={onChange} // Directly pass the onChange handler
              onBlur={onBlur}
              ref={ref as ForwardedRef<HTMLInputElement>}
              value={value}
              className={twMerge(
                `${invalid ? "border-red-100" : "border-gray-700"} h-[58px] w-full rounded-[6px] border px-[16px] py-[20px] text-[16px] font-[400] text-black ${props.readOnly ? "bg-gray-200" : ""}`,
                className,
              )}
            />
          )}

          {type == "password" && (
            <div
              onClick={() => {
                setIsPasswordVisible((prev) => !prev);
              }}
              className="absolute right-[10px] cursor-pointer"
            >
              <Image
                src={
                  isPasswordVisible ? icon_visibility_on : icon_visibility_off
                }
                width={24}
                alt="icon_visibility"
                className="text-[#9FA6B2]"
              />
            </div>
          )}
        </div>
      </section>
    );
  },
);

BasicInput.displayName = "BasicInput"; // Display name for debugging

export default BasicInput;
