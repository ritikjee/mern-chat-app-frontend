import ChatInput from "@/components/chat/chat-input";
import ChatNavbar from "@/components/chat/chat-navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerSideUser } from "@/utils/get-server-side-user";
import axios from "axios";
import { redirect } from "next/navigation";

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
      <div className="flex flex-1 overflow-auto">
        {messages.length === 0 ? (
          <h1 className="h-full w-full flex items-center justify-center">
            No messages. Be the first to send a message
          </h1>
        ) : (
          <div>
            {
              // @ts-ignore
              messages.map((message) => (
                <div key={message._id} className="my-3">
                  <div className="flex items-center px-5 gap-5 overflow-auto">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={message.senderId.profilePic}
                        alt={message.senderId.fullName}
                      />
                      <AvatarFallback>!</AvatarFallback>
                    </Avatar>
                    <div>
                      <div>
                        {message.senderId.fullName}

                        {user.id === message.senderId._id && (
                          <span className="text-xs text-zinc-500 pl-3">
                            {"("}
                            You
                            {")"}
                          </span>
                        )}
                      </div>
                      <div>{message.message}</div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
      <ChatInput roomId={params.roomId} userId={user.id} token={user.token} />
    </div>
  );
}

export default RoomIdPage;
