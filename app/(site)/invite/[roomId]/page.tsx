import { redirect } from "next/navigation";

import { getServerSideUser } from "@/utils/get-server-side-user";
import axios from "axios";

async function InvitePage({
  params,
}: {
  params: {
    roomId: string;
  };
}) {
  const user = await getServerSideUser();

  if (!user) {
    return redirect("/sign-in");
  }

  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/invite-member`,
      {
        roomId: params.roomId,
        userId: user.id,
      }
    );

    if (data) {
      return redirect(`/room/${params.roomId}`);
    }
  } catch (error) {
    console.log(error);
    return redirect(`/room`);
  }
}

export default InvitePage;
