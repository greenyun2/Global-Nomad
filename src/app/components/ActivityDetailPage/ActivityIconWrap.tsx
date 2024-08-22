import Image from "next/image";
import locationIcon from "@icons/icon_location.svg";
import starIcon from "@icons/icon_star_on.svg";

interface ActivityIconWrapProps {
  iconType: "star" | "location";
  fontColor: "star" | "location";
  text: string;
}

const ICON_TYPES = {
  star: "w-[1rem] h-[1rem]",
  location: "w-[1.125rem] h-[1.125rem]",
};

const ICON_WRAP_STYLES = {
  star: "text-black gap-[0.375rem]",
  location: "text-primary gap-[0.125rem]",
};

export default function ActivityIconWrap({
  iconType,
  fontColor,
  text,
}: ActivityIconWrapProps) {
  return (
    <div
      className={`flex items-center text-md font-regular ${ICON_WRAP_STYLES[fontColor]}`}
    >
      <div className={`relative ${ICON_TYPES[iconType]}`}>
        {iconType === "star" ? (
          <Image fill sizes="1rem" src={starIcon} alt="별 아이콘" />
        ) : (
          <Image fill sizes="1.125rem" src={locationIcon} alt="주소 아이콘" />
        )}
      </div>
      <span className="whitespace-nowrap">{text}</span>
    </div>
  );
}
