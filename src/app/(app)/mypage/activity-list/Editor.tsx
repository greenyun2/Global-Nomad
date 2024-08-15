"use client";

import { useState } from "react";
import { uploadActivityImage } from "@api/activities";
import Button from "@app/components/Button/Button";
import Image from "next/image";

interface EditorProps {
  initialData?: {
    title: string;
    category: string;
    description: string;
    price: number;
    address: string;
    bannerImageUrl: string;
    schedules?: { date: string; startTime: string; endTime: string }[] | null;
    subImageUrls?: string[] | null;
  };
  onSubmit: (formData: any) => void;
}

export default function Editor({ initialData, onSubmit }: EditorProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    address: initialData?.address || "",
    bannerImageUrl: initialData?.bannerImageUrl || "",
    schedules: initialData?.schedules || [],
    subImageUrls: initialData?.subImageUrls || [],
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    formData.bannerImageUrl || null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl); // 이미지 미리보기 설정
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let updatedFormData = { ...formData };

    // 이미지 업로드 후 URL 설정
    if (imageFile) {
      try {
        const imageUrl = await uploadActivityImage(imageFile);
        updatedFormData = {
          ...updatedFormData,
          bannerImageUrl: imageUrl,
        };
      } catch (error) {
        console.error("Image upload failed", error);
        return;
      }
    }

    // 이미지를 포함한 폼 데이터 제출
    onSubmit(updatedFormData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>체험 이름</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div>
        <label>카테고리</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div>
        <label>설명</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="textarea"
          required
        />
      </div>
      <div>
        <label>가격</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div>
        <label>주소</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div>
        <label>배너 이미지</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imagePreviewUrl && (
          <Image
            src={imagePreviewUrl}
            alt="배너 이미지 미리보기"
            width={100}
            height={100}
          />
        )}
      </div>
      {/* 추가 필드들 */}
      <div className="mt-4">
        <Button size={"sm"} color={"dark"} type="submit" className={""}>
          {initialData ? "수정하기" : "등록하기"}
        </Button>
      </div>
    </form>
  );
}
