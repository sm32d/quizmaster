export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex flex-col min-h-[92svh] items-center px-4 sm:px-12 lg:px-16 mt-4">
      <div className="flex w-[84svw] gap-2">
        <div className="skeleton h-10 w-10"></div>
        <div className="skeleton h-10 w-32"></div>
      </div>
      <div className="skeleton h-52 w-[80svw] mt-8"></div>
      <div className="flex justify-end mt-6 w-[80svw]">
        <div className="skeleton h-10 w-24"></div>
      </div>
    </div>
  );
}
