"use client";

import { Settings } from "lucide-react";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function ChatSetting({ roomId, userId }: { roomId: string; userId: string }) {
  const router = useRouter();

  const [memo, setMemo] = useState(true);
  const [members, setMembers] = useState<any>();
  const [admin, setAdmin] = useState<any>();

  useEffect(() => {
    setMemo(false);
  }, []);

  useEffect(() => {
    async function getMembers() {
      try {
        const { data: memb } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/get-members?roomId=${roomId}`
        );

        console.log(memb);

        setMembers(memb);
      } catch (error) {
        console.log(error);
      }
    }
    async function getAdmin() {
      try {
        const { data: memb } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/get-admin-member?roomId=${roomId}`
        );

        console.log(memb);

        setAdmin(memb);
      } catch (error) {
        console.log(error);
      }
    }

    getMembers();
    getAdmin();

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (memo) {
    return null;
  }

  async function deleteRoom() {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/delete-room`,
        {
          roomId,
          userId,
        }
      );
      toast.success("Room deleted successfully");
      router.refresh();
      router.push("/room");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }
  async function leaveRoom() {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/leave-room`,
        {
          roomId,
          userId,
        }
      );
      toast.success("Room Left successfully");
      router.refresh();
      router.push("/room");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  async function removeMember(memberId: string) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/remove-member`,
        {
          roomId,
          userId: memberId,
        }
      );
      toast.success("Member removed successfully");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button
            variant={"outline"}
            size={"icon"}
            className="bg-primary-foreground"
          >
            <Settings size={24} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Group Members</AlertDialogTitle>
            <AlertDialogDescription>
              {members?.map((member: any) => (
                <div
                  key={member._id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-5 p-2 my-3 rounded mb-2">
                    <Avatar>
                      <AvatarImage src={member.profilePic} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{member.fullName}</div>
                      {admin?._id === member._id ? (
                        <span>Admin</span>
                      ) : (
                        <span>Member</span>
                      )}
                    </div>
                  </div>
                  <div>
                    {userId === admin?._id && (
                      <Button
                        variant={"destructive"}
                        disabled={member._id === admin?._id}
                        onClick={() => {
                          removeMember(member._id);
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <div>
              {userId === admin?._id ? (
                <Button variant={"destructive"} onClick={deleteRoom}>
                  Delete Group
                </Button>
              ) : (
                <Button variant={"destructive"} onClick={leaveRoom}>
                  Leave Room
                </Button>
              )}
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ChatSetting;
