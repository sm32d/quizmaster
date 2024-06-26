export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex flex-col min-h-[92svh] items-center px-4 sm:px-12 lg:px-16 mt-4">
      <div className="flex justify-between w-[93svw] sm:w-[83svw]">
        <div className="skeleton h-10 w-[50svw]"></div>
        <div className="skeleton h-10 w-10"></div>
      </div>
      <div className="flex flex-col mt-8 gap-3">
        <div className="skeleton h-10 w-32"></div>
        <div className="skeleton h-[60svh] w-[90svw] sm:w-[80svw] py-6"></div>
      </div>
    </div>
  );
}
