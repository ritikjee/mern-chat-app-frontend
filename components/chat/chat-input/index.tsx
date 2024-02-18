"use client";

import io from "socket.io-client";
import axios from "axios";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ChatSpace({
  roomId,
  userId,
  token,
  messages,
  profilePic,
  name,
}: {
  roomId: string;
  userId: string;
  token: string;
  profilePic: string;
  name: string;
  messages: any;
}) {
  const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!);
  socket.emit("setup", roomId);

  const [text, setText] = useState("");
  const [message1, setMessage] = useState(messages);

  useEffect(() => {
    socket.on("message", (msg) => {
      console.log("message", msg);

      setMessage((prev: any) => [...prev, msg]);
    });
  });

  async function sendMessage(text: string) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/message/create-message`,
        {
          roomId,
          userId,
          text: text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      socket.emit("message", {
        roomId,
        message: text,
        senderId: {
          _id: userId,
          profilePic,
          fullName: name,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setText("");
    }
  }

  return (
    <>
      <div className="flex flex-1 overflow-auto">
        {message1.length === 0 ? (
          <h1 className="h-full w-full flex items-center justify-center">
            No messages. Be the first to send a message
          </h1>
        ) : (
          <div>
            {
              // @ts-ignore
              message1.map((message) => (
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

                        {userId === message.senderId._id && (
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
      <div className="w-full">
        <div className="flex">
          <Input
            placeholder="Start typing"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              sendMessage(text);
            }}
          >
            <Send />
          </Button>
        </div>
      </div>
    </>
  );
}

export default ChatSpace;
