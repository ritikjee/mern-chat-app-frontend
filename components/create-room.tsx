"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import CreateRoom from "@/form/create-room-form";

function CreateRoomButton({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) {
  const [memo, setMemo] = useState(true);

  useEffect(() => {
    setMemo(false);
  }, []);

  if (memo) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Room</DialogTitle>
          <DialogDescription>
            Create a room. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <CreateRoom userId={userId} token={token} />
      </DialogContent>
    </Dialog>
  );
}

export default CreateRoomButton;
