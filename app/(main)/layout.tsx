import Sidebar from "@/components/sidebar";

function RoomLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="h-full">
        <div className="hidden md:flex h-full w-[300px] z-30 flex-col rounded-lg border shadow-md fixed inset-y-0">
          <Sidebar />
        </div>
        <main className="md:pl-[300px] h-full">{children}</main>
      </div>
    </>
  );
}

export default RoomLayout;
