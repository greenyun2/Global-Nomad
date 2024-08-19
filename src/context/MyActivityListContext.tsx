"use client";

import { createContext, useEffect, useState } from "react";
import {
  MyActivityResponseType,
  MyActivityType,
} from "@customTypes/MyActivityStatusType";

export type MyActivityListContextType = {
  myActivityList: MyActivityType[] | [];
  setMyActivityList: React.Dispatch<React.SetStateAction<MyActivityType[]>>;
  handleMyActivitySelect: (
    selectedActivity: string | undefined,
    selectedActivityId: string | undefined,
  ) => void;
  selectedActivityId: string | undefined;
  selectedActivity: string | undefined;
  setSelectedActivity: React.Dispatch<React.SetStateAction<string | undefined>>;
  data: MyActivityResponseType;
};

export const MyActivityListContext =
  createContext<MyActivityListContextType | null>(null);

type MyActivityListProviderPropsType = {
  data: MyActivityResponseType;
  children: React.ReactNode;
};

export default function MyActivityListContextProvider({
  data,
  children,
}: MyActivityListProviderPropsType) {
  const [myActivityList, setMyActivityList] = useState<MyActivityType[] | []>(
    data.activities,
  );
  
  const [selectedActivityId, setSelectedActivityId] = useState<string | undefined>(undefined);
  const [selectedActivity, setSelectedActivity] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (myActivityList.length > 0) {
      setSelectedActivityId(myActivityList[0].id.toString());
      setSelectedActivity(myActivityList[0].title);
    }
  }, [myActivityList]);

  const handleMyActivitySelect = (
    selectedActivity: string | undefined,
    selectedActivityId: string | undefined,
  ) => {
    setSelectedActivity(selectedActivity);
    setSelectedActivityId(selectedActivityId);
  };

  return (
    <MyActivityListContext.Provider
      value={{
        myActivityList,
        setMyActivityList,
        handleMyActivitySelect,
        selectedActivityId,
        selectedActivity,
        setSelectedActivity,
        data,
      }}
    >
      {children}
    </MyActivityListContext.Provider>
  );
}