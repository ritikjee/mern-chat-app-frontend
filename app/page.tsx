import axios from "axios";
import { redirect } from "next/navigation";

import { getServerSideUser } from "@/utils/get-server-side-user";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateRoom from "@/form/create-room-form";
import { log } from "console";

export default async function Home() {
  const user = await getServerSideUser();

  if (!user) {
    return redirect("/sign-in");
  }

  var room;

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/get-rooms?userId=${user.id}`
    );

    room = data;
  } catch (error) {
    console.log(error);
    room = null;
  }

  log(room);
  if (room) {
    return redirect(`/room`);
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center  ">
      <Card className="md:w-96">
        <CardHeader>
          <CardTitle>Create your own room</CardTitle>
          <CardDescription>
            Create your own room which you can edit later
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateRoom userId={user.id} token={user.token} />
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
    </div>
  );
}
