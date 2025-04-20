import Loading from "@/components/ui/loading";
import React from "react";

const loading = () => {
  return (
    <div className="text-white">
      <Loading className="flex items-center justify-center mx-auto h-screen w-full" />
    </div>
  );
};

export default loading;
