import Image from "next/image";
import image from "../../../public/favicon.ico";

function RoomPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <div className="relative h-36 w-36">
        <Image src={image} alt="Room" fill />
      </div>
      <h1 className="text-6xl">Horizon</h1>
      <p className="mt-10">
        Safest and most reliable platform to meet your loved ones
      </p>
    </div>
  );
}

export default RoomPage;
