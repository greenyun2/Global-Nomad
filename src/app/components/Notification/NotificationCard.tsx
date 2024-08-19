import instance from "@api/axios";
import { useMutation, QueryClient } from "@tanstack/react-query";
import Image from "next/image";
import useUpdatedAt from "@hooks/useUpdatedAt";
import icon_X from "@icons/icon_x_medium_24px.svg";

interface NotificationCardProp {
  content: string;
  updatedAt: string;
  notificationId: number;
}
const deleteNotification = async (notificationId: number) => {
  const response = await instance.delete(`/my-notifications/${notificationId}`);
  return response.data;
};

const NotificationCard = ({
  content,
  updatedAt,
  notificationId,
}: NotificationCardProp) => {
  const queryClient = new QueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notificatioin"],
      });
    },
  });

  const confirmOrDecline = content.slice(
    content.length - 8,
    content.length - 6,
  );

  const handleDeleteNotification = () => {
    mutate(notificationId);
  };

  return (
    <li className="rounded-[5px] bg-white px-3 py-4">
      <div className="flex items-center justify-between">
        <div
          className={`${confirmOrDecline === "승인" ? "bg-blue-300" : "bg-red-100"} h-2 w-2 rounded-full bg-blue-300`}
        ></div>
        <button onClick={handleDeleteNotification}>
          <Image src={icon_X} alt="delete notification" />
        </button>
      </div>
      <div>
        {content.split(confirmOrDecline)[0]}
        <br />
        <div
          className={`${confirmOrDecline === "승인" ? "text-blue-300" : "text-red-100"} inline`}
        >
          {confirmOrDecline}
        </div>
        {content.split(confirmOrDecline)[1]}
      </div>
      <div className="text-gray-700">{useUpdatedAt(updatedAt)}</div>
    </li>
  );
};

export default NotificationCard;
