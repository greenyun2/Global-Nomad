import axiosServer from "@app/apiServer/axiosServer";

export default async function getMyActivityListServer() {
  try {
    const response = await axiosServer.get("/my-activities");
    return response.data;
  } catch (error) {
    console.error("Error fetching activity list:", error);
    throw error;
  }
}
