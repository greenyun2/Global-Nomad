"use client";

import { createContext, useState } from "react";
import { MyActivityType } from "@customTypes/MyActivity-Status";

export type MyActivityListContextType = {
  myActivityList: MyActivityType[] | [];
  setMyActivityList: React.Dispatch<React.SetStateAction<MyActivityType[]>>;
  handleMyActivitySelect: (selectedActivity: string) => void;
  selectedActivityId: string;
};

export const MyActivityListContext =
  createContext<MyActivityListContextType | null>(null);

type MyActivityListProviderPropsType = {
  data: MyActivityType[] | [];
  children: React.ReactNode;
};

export default function MyActivityListContextProvider({
  data,
  children,
}: MyActivityListProviderPropsType) {
  const [myActivityList, setMyActivityList] = useState<MyActivityType[] | []>(
    data,
  );
  const [selectedActivityId, setSelectedActivityId] = useState("");

  const handleMyActivitySelect = (selectedActivity: string) => {
    setSelectedActivityId(selectedActivity);
  };

  return (
    <MyActivityListContext.Provider
      value={{ myActivityList, setMyActivityList, handleMyActivitySelect, selectedActivityId }}
    >
      {children}
    </MyActivityListContext.Provider>
  );
}
