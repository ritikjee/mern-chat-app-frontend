"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function RoomInvite({ roomId }: { roomId: string }) {
  function copyToClipboard() {
    var copyText = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/invite/${roomId}`;

    navigator.clipboard.writeText(copyText).then(
      function () {
        toast.success("Copied to clipboard");
      },
      function () {
        toast.error("Failed to copy to clipboard");
      }
    );
  }

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
        <Button
          variant={"outline"}
          size={"icon"}
          className="bg-primary-foreground"
        >
          <Share2 size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Invite</DialogTitle>
          <DialogDescription>
            Copy the link below and share it with your friends to invite them to
            this room.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label htmlFor="invite-link">Invite Link</Label>
          <Input
            id="invite-link"
            value={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/invite/${roomId}`}
            readOnly
          />
        </div>
        <DialogFooter>
          <Button
            variant={"outline"}
            size={"icon"}
            type="submit"
            onClick={copyToClipboard}
          >
            <Copy size={20} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RoomInvite;
