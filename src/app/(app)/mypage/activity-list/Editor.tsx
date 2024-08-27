"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { uploadActivityImage } from "@api/activities";
import Button from "@app/components/Button/Button";
import FormErrorMessageModal from "@app/components/Form/FormErrorMessageModal";
import BasicInput from "@app/components/Input/BasicInput";
import CalendarInput from "@app/components/Input/CalendarInput";
import DropDownInput from "@app/components/Input/DropDownInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Image from "next/image";
import * as z from "zod";
import AddressModal from "./AddressModal";
import { useDropdown } from "@hooks/useDropdown";
import IconAdd from "@icons/icon_add_img.svg";
import IconDel from "@icons/icon_delete_40px.svg";
import IconMinus from "@icons/icon_minus_time.svg";
import IconPlus from "@icons/icon_plus_time.svg";

const CATEGORIES = ["문화 · 예술", "식음료", "스포츠", "투어", "관광", "웰빙"];

const TIME_OPTIONS = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`,
);

export type ModifiedEditorSchemaType = EditorSchemaType & {
  schedulesToAdd?: {
    date: string;
    startTime: string;
    endTime: string;
    id?: number;
  }[];
  subImageUrlsToAdd?: string[];
};

const EditorSchema = z.object({
  title: z.string().nonempty("체험 이름을 입력해 주세요"),
  category: z.string().nonempty("카테고리를 입력해 주세요"),
  description: z
    .string()
    .nonempty("설명을 입력해 주세요")
    .max(500, "설명은 최대 500자까지 입력할 수 있습니다."),
  price: z.preprocess(
    (value) => (typeof value === "string" ? parseFloat(value) : value),
    z
      .number()
      .min(0, "최소 0원 설정 가능합니다.")
      .max(5000000, "최대 500만원 설정 가능합니다."),
  ),
  address: z.string().nonempty("주소를 입력해 주세요"),
  bannerImageUrl: z.string().nonempty("배너 이미지를 등록해 주세요"),
  schedules: z
    .array(
      z.object({
        id: z.number().optional(),
        date: z.string(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .min(1, "최소 하나의 스케줄을 추가해야 합니다."),
  subImageUrls: z
    .array(z.string())
    .max(4, "최대 4개의 이미지만 등록할 수 있습니다.")
    .optional(),
  scheduleIdsToRemove: z.array(z.number()).optional(),
  subImageIdsToRemove: z.array(z.number()).optional(),
});

export type EditorSchemaType = z.infer<typeof EditorSchema>;

interface EditorProps {
  initialData?: any;
  onSubmit: (formData: EditorSchemaType) => void;
}

export default function Editor({ initialData, onSubmit }: EditorProps) {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ModifiedEditorSchemaType>({
    resolver: zodResolver(EditorSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      price: 0,
      address: "",
      bannerImageUrl: "",
      schedules: [{ date: "", startTime: "", endTime: "" }],
      subImageUrls: [],
      scheduleIdsToRemove: [],
      subImageIdsToRemove: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
    keyName: "_internalId", // 'id' 대신 내부적으로 사용할 고유 ID 키를 설정
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);
  const [scheduleIdsToRemove, setScheduleIdsToRemove] = useState<number[]>([]);
  const [subImageIdsToRemove, setSubImageIdsToRemove] = useState<number[]>([]);
  // const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [popupMessage, setPopUpMessage] = useState("");

  // 주소 필드의 변화를 감지하고 오류를 지우는 로직 추가
  const addressValue = useWatch({
    control,
    name: "address",
  });

  const {
    isOpen: isAddressModalOpen,
    ref: addressRef,
    toggle: toggleAddressModal,
  } = useDropdown();
  const {
    isOpen: isPopUpOpen,
    ref: popupRef,
    toggle: togglePopUp,
  } = useDropdown();

  useEffect(() => {
    if (addressValue) {
      clearErrors("address");
    }
  }, [addressValue, clearErrors]);

  useEffect(() => {
    if (initialData) {
      console.log("Initial Data:", initialData); // 초기 데이터 출력

      const schedules = initialData.schedules.map((schedule: any) => ({
        id: schedule.id,
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      }));

      setValue("schedules", schedules);
      const subImageUrls = initialData.subImages.map(
        (image: any) => image.imageUrl,
      );

      setValue("title", initialData.title);
      setValue("category", initialData.category);
      setValue("description", initialData.description);
      setValue("price", initialData.price);
      setValue("address", initialData.address);
      setValue("bannerImageUrl", initialData.bannerImageUrl);
      setValue("schedules", schedules);
      setValue("subImageUrls", subImageUrls);

      setImagePreviewUrl(initialData.bannerImageUrl);
      setSubImagePreviews(subImageUrls);
    }
  }, [initialData, setValue]);

  useEffect(() => {
    console.log("Fields structure:", fields); // fields 구조 출력
  }, [fields]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (imagePreviewUrl) {
        setPopUpMessage("배너 이미지는 최대 1개만 등록할 수 있습니다.");
        togglePopUp();
        return;
      }

      const file = e.target.files[0];

      // 파일 크기 검사 (5MB 이하)
      if (file.size > 5 * 1024 * 1024) {
        // 파일 크기 5MB 제한
        setPopUpMessage("파일 크기는 5MB보다 작아야 합니다.");
        togglePopUp();
        return; // 파일 크기 제한에 걸리면 함수 종료
      }

      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);

      setIsImageUploading(true);
      try {
        const imageUrl = await uploadActivityImage(file);
        setValue("bannerImageUrl", imageUrl);
        setImagePreviewUrl(imageUrl);
        clearErrors("bannerImageUrl");
      } catch (error) {
        console.error("Image upload failed", error);
      } finally {
        setIsImageUploading(false);
      }
    }
  };

  const subImageUrls = useWatch({
    control,
    name: "subImageUrls",
    defaultValue: [],
  });

  const handleRemoveImage = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl); // URL 메모리 해제
      setImagePreviewUrl(null);
      setValue("bannerImageUrl", "");
    }
  };

  const handleRemoveSubImage = (index: number) => {
    const imageId = initialData?.subImages?.[index]?.id;
    console.log(imageId);
    if (imageId) {
      setSubImageIdsToRemove((prev) => [...prev, imageId]);
    }

    const newSubImagePreviews = [...subImagePreviews];
    const newSubImageUrls = [...(subImageUrls || [])]; // undefined일 경우 빈 배열로 처리

    // URL 메모리 해제
    URL.revokeObjectURL(newSubImagePreviews[index]);

    newSubImagePreviews.splice(index, 1);
    newSubImageUrls.splice(index, 1);

    setSubImagePreviews(newSubImagePreviews);
    setValue("subImageUrls", newSubImageUrls);
  };

  const handleSubImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      if (subImagePreviews.length + files.length > 4) {
        setPopUpMessage("최대 4개의 이미지만 등록할 수 있습니다.");
        togglePopUp();
        return;
      }

      const oversizedFiles = files.filter(
        (file) => file.size > 5 * 1024 * 1024,
      );

      if (oversizedFiles.length > 0) {
        setPopUpMessage("파일 크기는 5MB보다 작아야 합니다.");
        togglePopUp();
        return;
      }

      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      const updatedPreviews = [...subImagePreviews, ...newPreviewUrls];
      setSubImagePreviews(updatedPreviews);

      try {
        const uploadPromises = files.map((file) => uploadActivityImage(file));
        const imageUrls = await Promise.all(uploadPromises);

        const updatedSubImageUrls = [...(subImageUrls || []), ...imageUrls];
        setValue("subImageUrls", updatedSubImageUrls);
      } catch (error) {
        console.error("Sub image upload failed", error);
      }
    }
  };

  const handleAddSchedule = () => {
    append({ date: "", startTime: "", endTime: "" });
  };
  const handleRemoveSchedule = (index: number) => {
    if (fields.length === 1) {
      // 스케줄이 하나일 때는 삭제를 막기 위해 아무 작업도 하지 않음

      setPopUpMessage("최소 하나의 스케줄이 있어야 합니다.");
      togglePopUp();
      return;
    }

    const scheduleId = fields[index].id; // 서버에서 제공된 고유 ID 값
    const internalId = fields[index]._internalId; // useFieldArray에서 관리하는 내부 식별자

    console.log("Schedule ID to remove:", scheduleId); // 스케줄 ID 출력
    console.log("Internal ID to remove:", internalId); // 내부 식별자 출력

    // 필드를 삭제합니다.
    remove(index);

    // 만약 서버에서 제공된 고유 ID가 있다면, 삭제 대상 ID 목록에 추가합니다.
    if (scheduleId) {
      setScheduleIdsToRemove((prev) => [...prev, scheduleId]);
    }
  };

  const handleFormSubmit = async (data: ModifiedEditorSchemaType) => {
    let finalData: ModifiedEditorSchemaType;

    if (initialData) {
      const filteredSchedulesToAdd =
        data.schedules?.filter((schedule) => !schedule.id) || [];
      const filteredSubImageUrlsToAdd =
        data.subImageUrls?.filter(
          (url) =>
            !initialData.subImages.some((img: any) => img.imageUrl === url),
        ) || [];

      finalData = {
        title: data.title,
        category: data.category,
        description: data.description,
        price: data.price,
        address: data.address,
        schedules: [], // 빈 배열을 포함하여 전송
        bannerImageUrl: data.bannerImageUrl,
        schedulesToAdd: filteredSchedulesToAdd,
        subImageUrlsToAdd: filteredSubImageUrlsToAdd,
        scheduleIdsToRemove: scheduleIdsToRemove,
        subImageIdsToRemove: subImageIdsToRemove,
      };
    } else {
      // 등록 시
      finalData = {
        title: data.title,
        category: data.category,
        description: data.description,
        price: data.price,
        address: data.address,
        bannerImageUrl: data.bannerImageUrl,
        schedules: data.schedules, // 그대로 전송
        subImageUrls: data.subImageUrls, // 그대로 전송
      };
    }

    console.log("Submitting data:", finalData);
    onSubmit(finalData);
  };

  const handleCompleteAddress = (data: { address: string }) => {
    setValue("address", data.address);
    // setAddressModalOpen(false);
  };

  return (
    <>
      {isPopUpOpen && (
        <FormErrorMessageModal
          errorMessage={popupMessage}
          toggle={togglePopUp}
          ref={popupRef}
        />
      )}
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="mt-6 flex flex-col gap-6"
      >
        <div>
          <label htmlFor="title" className="sr-only">
            체험 이름
          </label>
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <BasicInput
                id="title"
                {...field}
                type="text"
                placeholder="체험 이름을 입력해 주세요"
                invalid={invalid}
              />
            )}
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="sr-only">
            카테고리
          </label>
          <Controller
            name="category"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <DropDownInput
                setInitialValue={false}
                dropDownOptions={CATEGORIES}
                placeholder="옵션을 선택해 주세요"
                id="category"
                invalid={invalid}
                {...field}
              />
            )}
          />
          {errors.category && (
            <p className="text-red-500">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="sr-only">
            설명
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <BasicInput
                id="description"
                {...field}
                invalid={invalid}
                placeholder="설명을 입력해 주세요"
                type="textarea"
                maxLength={500}
                className="h-96 resize-none overflow-hidden"
              />
            )}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-xl font-bold text-black md:mb-4 md:text-2xl">
            가격
          </h2>
          <Controller
            name="price"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <BasicInput
                id="price"
                {...field}
                type="number"
                placeholder="가격을 입력해 주세요"
                invalid={invalid}
              />
            )}
          />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div>
          <div className="mb-3 flex place-content-between md:mb-4">
            <h2 className="content-center text-xl font-bold text-black md:text-2xl">
              주소
            </h2>
            <Button
              type="button"
              onClick={toggleAddressModal}
              size="sm"
              color={"dark"}
            >
              주소 찾기
            </Button>
          </div>
          <Controller
            name="address"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <BasicInput
                className="flex-1"
                id="address"
                {...field}
                type="text"
                placeholder="주소를 입력해 주세요"
                invalid={invalid}
                readOnly
              />
            )}
          />
          {errors.address && (
            <p className="text-red-500">{errors.address.message}</p>
          )}
        </div>

        {isAddressModalOpen && (
          <AddressModal
            ref={addressRef}
            toggle={toggleAddressModal}
            onComplete={handleCompleteAddress}
          ></AddressModal>
        )}

        <div>
          <div className="mb-3 flex place-content-between md:mb-4">
            <h2 className="content-center text-xl font-bold text-black md:text-2xl">
              예약 가능한 시간대
            </h2>
            <button type="button" onClick={handleAddSchedule}>
              <Image
                src={IconPlus}
                alt={"예약시간 추가"}
                height={56}
                width={56}
              ></Image>
            </button>
          </div>
          <div className="flex flex-col items-center gap-3 md:gap-4">
            {fields.map((item, index) => (
              <div
                key={item._internalId}
                className="flex w-full items-center gap-1 md:gap-2 xl:gap-4"
              >
                <div className="w-9/12 flex-grow">
                  <Controller
                    name={`schedules.${index}.date`}
                    control={control}
                    render={({ field }) => (
                      <CalendarInput
                        id={`schedules-${index}`}
                        {...field}
                        placeholder="YY/MM/DD"
                        className="px-2"
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name={`schedules.${index}.startTime`}
                    control={control}
                    render={({ field }) => (
                      <DropDownInput
                        id={`schedules-startTime-${index}`}
                        setInitialValue={false}
                        dropDownOptions={TIME_OPTIONS}
                        {...field}
                        placeholder="0:00"
                        className="px-2"
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name={`schedules.${index}.endTime`}
                    control={control}
                    render={({ field }) => (
                      <DropDownInput
                        id={`schedules-endTime-${index}`}
                        setInitialValue={false}
                        dropDownOptions={TIME_OPTIONS}
                        {...field}
                        placeholder="0:00"
                        className="px-2"
                      />
                    )}
                  />
                </div>
                <button
                  type="button"
                  className="flex-shrink-0"
                  onClick={() => handleRemoveSchedule(index)}
                >
                  <Image
                    src={IconMinus}
                    alt={"예약시간 삭제"}
                    height={56}
                    width={56}
                  ></Image>
                </button>
              </div>
            ))}
          </div>
          {errors.schedules && (
            <p className="text-sm text-red-500">{errors.schedules.message}</p>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-xl font-bold text-black md:mb-4 md:text-2xl">
            배너 이미지
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-36 w-36 md:h-[11.25rem] md:w-[11.25rem]">
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={handleImageUpload}
                id="image-upload-input"
                className="hidden"
              />
              <label htmlFor="image-upload-input" className="cursor-pointer">
                <Image src={IconAdd} alt={"이미지 등록"}></Image>
              </label>
            </div>

            {imagePreviewUrl && (
              <div className="relative">
                <div
                  className="h-36 w-36 rounded-3xl bg-cover bg-center md:h-[11.25rem] md:w-[11.25rem]"
                  style={{
                    backgroundImage: `url(${imagePreviewUrl})`,
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2"
                >
                  <Image src={IconDel} alt={"이미지 삭제"}></Image>
                </button>
              </div>
            )}
          </div>
          <div>
            {errors.bannerImageUrl && (
              <p className="mt-2 text-red-500">
                {errors.bannerImageUrl.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-bold text-black md:mb-4 md:text-2xl">
            나머지 이미지
          </h2>
          <div className="flex flex-wrap items-center gap-4 gap-y-9">
            <div className="h-36 w-36 md:h-[11.25rem] md:w-[11.25rem]">
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={handleSubImageUpload}
                id="sub-image-upload-input"
                className="hidden"
              />
              <label
                htmlFor="sub-image-upload-input"
                className="cursor-pointer"
              >
                <Image src={IconAdd} alt={"이미지 등록"}></Image>
              </label>
            </div>

            {subImagePreviews.map((previewUrl, index) => (
              <div key={index} className="relative">
                <div
                  className="h-36 w-36 rounded-3xl bg-cover bg-center md:h-[11.25rem] md:w-[11.25rem]"
                  style={{
                    backgroundImage: `url(${previewUrl})`,
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSubImage(index)}
                  className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2"
                >
                  <Image src={IconDel} alt={"이미지 삭제"}></Image>
                </button>
              </div>
            ))}
          </div>
          <p className="mt-6 text-2lg font-normal text-gray-800">
            * 이미지는 최대 4개까지 등록 가능합니다.
          </p>
        </div>

        <div>
          <Button
            size={"md"}
            color={"dark"}
            type="submit"
            className={"absolute right-0 top-0 w-[120px]"}
            disabled={isSubmitting || isImageUploading}
          >
            {initialData ? "수정하기" : "등록하기"}
          </Button>
        </div>
      </form>
    </>
  );
}
