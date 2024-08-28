import instance from "@api/axios";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import NotificationCard from "./NotificationCard";
import icon_X from "@icons/icon_x_40px.svg";

interface NotificationsProp {
  close: () => void;
}
const getNotification = async (size?: number, cursorId?: number | null) => {
  const params = new URLSearchParams();
  if (cursorId) params.append("cursorId", String(cursorId));
  if (size) params.append("size", String(size));
  const response = await instance.get<NotificationData>(
    `/my-notifications?${params}`,
  );
  return response.data;
};

const useNotification = (size?: number, cursorId?: number | null) => {
  return useQuery({
    queryKey: ["notification"],
    queryFn: () => getNotification(size, cursorId),
    staleTime: 1000 * 60 * 5,
  });
};

const Notifications = ({ close }: NotificationsProp) => {
  const { data } = useNotification();
  const totalCount = data?.totalCount || 0;
  const notifications = data?.notifications || [];

  const handleButtonClose = () => {
    close();
  };

  return (
    <div>
      {totalCount === 0 ? (
        <div className="flex items-center justify-between">
          <div className="text-lg">알림이 없습니다.</div>
          <button onClick={handleButtonClose}>
            <Image
              src={icon_X}
              alt="notification off"
              width={30}
              height={30}
              style={{ width: 30, height: 30 }}
            />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="text-xl font-bold">알림 {totalCount}개</div>
            <button onClick={handleButtonClose}>
              <Image
                src={icon_X}
                alt="notification off"
                width={30}
                height={30}
                style={{ width: 30, height: 30 }}
              />
            </button>
          </div>
          <ol className="flex flex-col gap-2">
            {notifications.map((item) => (
              <NotificationCard
                key={item.id}
                content={item.content}
                updatedAt={item.updatedAt}
                notificationId={item.id}
              />
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};
export default Notifications;
