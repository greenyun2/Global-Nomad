"use client";

import { useEffect, useState } from "react";
import { getUserMe, UserMe } from "@api/user";
import MyInfoEditor from "@app/(app)/mypage/me/component/MyInfoEditor";

export default function MePage() {
  const [userInfo, setUserInfo] = useState<UserMe | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const response = await getUserMe();
      setUserInfo(response);
    };
    getUser();
  }, []);

  return (
    <div className="relative flex flex-col">
      <h2 className="mb-6 text-3xl font-bold text-primary">내 정보</h2>
      <MyInfoEditor data={userInfo} />
    </div>
  );
}
