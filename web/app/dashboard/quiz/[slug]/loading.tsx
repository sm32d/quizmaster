export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex flex-col min-h-[92svh] items-center px-4 sm:px-12 lg:px-16 mt-4">
      <div className="flex w-[84svw] gap-2">
        <div className="skeleton h-10 w-10"></div>
        <div>
          <div className="skeleton h-10 w-32"></div>
          <div className="skeleton mt-2 ml-2 h-5 w-20"></div>
        </div>
      </div>
      <div className="skeleton h-80 md:h-28 w-[80svw] mt-8"></div>
      <div className="skeleton h-[50svh] w-[80svw] mt-8"></div>
    </div>
  );
}
