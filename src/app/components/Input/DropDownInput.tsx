"use client";

import React, { ForwardedRef, forwardRef, useRef, useState } from "react";
import Image from "next/image";
import icon_checkmark from "@icons/icon_checkmark.svg";
import icon_trailing_down from "@icons/icon_trailing_down.svg";
import icon_trailing_up from "@icons/icon_trailing_up.svg";

type DropDownOption = string;

type DropDownPropsType = {
  dropDownOptions: DropDownOption[] | [];
  placeholder?: string;
  id?: string; // <label> 태그에 연결할 id값입니다.
  value?: string; // Ensure the value prop is used for controlled component
  onChange: (value: string) => void; // Update the onChange type to handle value changes
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  invalid?: boolean;
  // setInitialSelectedItem은 dropDownOption중에 가장 첫번째 값을 초기값으로 설정할지 말지 결정합니다.
  setInitialSelectedItem?: boolean;
};

const DropDownInput = forwardRef<HTMLInputElement, DropDownPropsType>(
  (
    {
      placeholder,
      dropDownOptions,
      id,
      onChange,
      onBlur,
      invalid,
      setInitialSelectedItem,
    },
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(
      setInitialSelectedItem ? dropDownOptions[0] : "",
    );

    return (
      <div className="relative flex flex-col">
        <section>
          <div className="relative flex items-center">
            <input
              readOnly
              ref={ref}
              onBlur={onBlur}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              id={id}
              value={selectedItem} // 선택된 option을 Input에 표시합니다.
              placeholder={placeholder}
              className={`w-full cursor-pointer rounded-[6px] border ${invalid ? "border-red-500" : "border-gray-700"} px-[16px] py-[16px] caret-transparent`}
            />
            <button className="cursor-pointer">
              <Image
                src={isDropdownOpen ? icon_trailing_up : icon_trailing_down}
                alt="Toggle Dropdown"
                className="absolute right-[15px] top-[45%]"
              />
            </button>
          </div>
        </section>
        {isDropdownOpen && (
          <section className="absolute top-[70px] z-50 mt-[16px] max-h-[200px] w-full overflow-y-scroll bg-white shadow-md">
            <ul>
              {dropDownOptions?.map((option, index) => (
                <li
                  onClick={() => {
                    onChange(option); // react-hook-form의 controller에 값을 전달합니다.
                    setSelectedItem(option); // input의 value값 표시 용도입니다.
                    setIsDropdownOpen(false);
                  }}
                  key={index}
                  className="flex gap-[8px] rounded-[6px] px-[12px] py-[8px] font-[400] transition hover:cursor-pointer hover:bg-primary hover:text-white"
                >
                  <Image src={icon_checkmark} alt="Checkmark" />
                  <p>{option}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  },
);

DropDownInput.displayName = "DropDown"; // Display name for debugging

export default DropDownInput;
