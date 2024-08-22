import getMyActivityListServer from "@app/apiServer/getMyActivityListServer";
import SideNavigation from "@app/components/SideNavigation/SideNavigation";
import MyActivityListContextProvider from "@context/MyActivityListContext";

export default async function MyPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // myActivityList, server-side fetch
  const myActivityList = await getMyActivityListServer();

  return (
    <div className="flex-grow bg-gray-100 py-6 md:py-10 xl:py-[4.5rem]">
      <div className="container flex flex-1 flex-wrap gap-6">
        <div className="hidden w-full md:block md:w-4/12 xl:w-96">
          <SideNavigation></SideNavigation>
        </div>
        <MyActivityListContextProvider data={myActivityList}>
          <div className="min-w-0 flex-1">{children}</div>
        </MyActivityListContextProvider>
      </div>
    </div>
  );
}
