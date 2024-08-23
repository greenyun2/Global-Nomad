"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { uploadActivityImage } from "@api/activities";
import Button from "@app/components/Button/Button";
import BasicInput from "@app/components/Input/BasicInput";
import CalendarInput from "@app/components/Input/CalendarInput";
import DropDownInput from "@app/components/Input/DropDownInput";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AddressModal from "./AddressModal";
import { useDropdown } from "@hooks/useDropdown";

const CATEGORIES = ["문화 · 예술", "식음료", "스포츠", "투어", "관광", "웰빙"];

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
  description: z.string().nonempty("설명을 입력해 주세요"),
  price: z.preprocess(
    (value) => (typeof value === "string" ? parseFloat(value) : value),
    z.number().min(0, "최소 0원 설정 간으합니다.")
    .max(5000000, "최대 500만원 설정 가능합니다.")
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
    .optional(),
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
    keyName: '_internalId', // 'id' 대신 내부적으로 사용할 고유 ID 키를 설정
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);
  const [scheduleIdsToRemove, setScheduleIdsToRemove] = useState<number[]>([]);
  const [subImageIdsToRemove, setSubImageIdsToRemove] = useState<number[]>([]);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);

  // 주소 필드의 변화를 감지하고 오류를 지우는 로직 추가
  const addressValue = useWatch({
    control,
    name: "address",
  });
  const { isOpen: isModalOpen, ref, toggle } = useDropdown();

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
        alert("배너 이미지는 최대 1개만 등록할 수 있습니다.");
        return;
      }

      const file = e.target.files[0];
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
    setImagePreviewUrl(null);
    setValue("bannerImageUrl", "");
  };

  const handleRemoveSubImage = (index: number) => {
    const imageId = initialData?.subImages?.[index]?.id;
    console.log(imageId);
    if (imageId) {
      setSubImageIdsToRemove((prev) => [...prev, imageId]);
    }

    const newSubImagePreviews = [...subImagePreviews];
    const newSubImageUrls = [...(subImageUrls || [])]; // undefined일 경우 빈 배열로 처리

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
        alert("최대 4개의 이미지만 등록할 수 있습니다.");
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
      // 수정 시, 새롭게 추가된 스케줄과 이미지를 필터링
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
    setAddressModalOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div>
        <label htmlFor="title">체험 이름</label>
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
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="category">카테고리</label>
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
        <label htmlFor="description">설명</label>
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
            />
          )}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="price">가격</label>
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
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </div>

      <div>
        <label htmlFor="address">주소</label>
        <div className="flex items-center gap-2">
          <Controller
            name="address"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <BasicInput
                id="address"
                {...field}
                type="text"
                placeholder="주소를 입력해 주세요"
                invalid={invalid}
                readOnly
              />
            )}
          />
          <Button type="button" onClick={toggle} size="sm" color={"dark"}>
            주소 찾기
          </Button>
        </div>
        {errors.address && (
          <p className="text-red-500">{errors.address.message}</p>
        )}
      </div>

      {isModalOpen && (
        <AddressModal
          ref={ref}
          toggle={toggle}
          onComplete={handleCompleteAddress}
        ></AddressModal>
      )}

      <div>
        <label htmlFor="bannerImageUrl">배너 이미지</label>
        <div className="flex items-center gap-4">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              id="image-upload-input"
              className="hidden"
            />
            <label
              htmlFor="image-upload-input"
              className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300"
            >
              <span className="text-2xl text-gray-300">+</span>
              <span className="text-gray-500">이미지 등록</span>
            </label>
          </div>

          {imagePreviewUrl && (
            <div className="relative">
              <div
                className="h-24 w-24 rounded-lg bg-cover bg-center"
                style={{
                  backgroundImage: `url(${imagePreviewUrl})`,
                }}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute right-0 top-0 flex h-6 w-6 -translate-y-2 translate-x-2 transform items-center justify-center rounded-full bg-black text-white"
              >
                X
              </button>
            </div>
          )}

          {errors.bannerImageUrl && (
            <p className="text-sm text-red-500">
              {errors.bannerImageUrl.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="subImageUrls"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          추가 이미지 업로드
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleSubImageUpload}
              id="sub-image-upload-input"
              className="hidden"
            />
            <label
              htmlFor="sub-image-upload-input"
              className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300"
            >
              <span className="text-2xl text-gray-300">+</span>
              <span className="text-gray-500">이미지 등록</span>
            </label>
          </div>

          {subImagePreviews.map((previewUrl, index) => (
            <div key={index} className="relative">
              <div
                className="h-24 w-24 rounded-lg bg-cover bg-center"
                style={{
                  backgroundImage: `url(${previewUrl})`,
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveSubImage(index)}
                className="absolute right-0 top-0 flex h-6 w-6 -translate-y-2 translate-x-2 transform items-center justify-center rounded-full bg-black text-white"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label>예약 가능한 시간대</label>

        <div className="mb-4 flex flex-col items-center gap-4">
          {fields.map((item, index) => (
            <div key={item._internalId} className="mb-4 flex items-center gap-4">
              <Controller
                name={`schedules.${index}.date`}
                control={control}
                render={({ field }) => (
                  <CalendarInput
                    id={`schedules-${index}`}
                    {...field}
                    placeholder="YY/MM/DD"
                  />
                )}
              />
              <Controller
                name={`schedules.${index}.startTime`}
                control={control}
                render={({ field }) => (
                  <DropDownInput
                    id={`schedules-startTime-${index}`}
                    setInitialValue={false}
                    dropDownOptions={["00:00", "01:00", "02:00", "03:00"]}
                    {...field}
                    placeholder="0:00"
                  />
                )}
              />
              <span>~</span>
              <Controller
                name={`schedules.${index}.endTime`}
                control={control}
                render={({ field }) => (
                  <DropDownInput
                    id={`schedules-endTime-${index}`}
                    setInitialValue={false}
                    dropDownOptions={["01:00", "02:00", "03:00", "04:00"]}
                    {...field}
                    placeholder="0:00"
                  />
                )}
              />
              <Button
                type="button"
                onClick={() => handleRemoveSchedule(index)}
                size={"sm"}
                color={"dark"}
                className={"ml-2"}
              >
                -
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          onClick={handleAddSchedule}
          size={"sm"}
          color={"dark"}
        >
          +
        </Button>

        <div className="mt-4">
          <Button
            size={"sm"}
            color={"dark"}
            type="submit"
            className={""}
            disabled={isSubmitting || isImageUploading}
          >
            {initialData ? "수정하기" : "등록하기"}
          </Button>
        </div>
      </div>
    </form>
  );
}
