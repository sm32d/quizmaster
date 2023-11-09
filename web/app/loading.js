import LoadingCircular from "./components/LoadingCircular";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="hero min-h-screen">
      <LoadingCircular />
    </div>
  );
}
