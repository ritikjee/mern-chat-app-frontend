import axios from "axios";
import { redirect } from "next/navigation";

import ChatNavbar from "@/components/chat/chat-navbar";
import { getServerSideUser } from "@/utils/get-server-side-user";
import ChatSpace from "@/components/chat/chat-input";

async function RoomIdPage({
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

  var messages = [];
  var rooms;

  try {
    [{ data: rooms }, { data: messages }] = await Promise.all([
      await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/get-room?roomId=${params.roomId}`
      ),
      axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/message/get-messages`,
        {
          roomId: params.roomId,
          userId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      ),
    ]);

    if (!rooms) {
      return redirect("/room");
    }
  } catch (error) {
    console.log(error);
    return redirect("/room");
  }

  return (
    <div className="flex flex-col  h-screen w-full">
      <ChatNavbar
        userId={user.id}
        name={rooms.name}
        profilePic={rooms.profile}
        roomId={params.roomId}
      />

      <ChatSpace
        roomId={params.roomId}
        userId={user.id}
        token={user.token}
        messages={messages}
        profilePic={user.profileImage}
        name={user.name}
      />
    </div>
  );
}

export default RoomIdPage;
