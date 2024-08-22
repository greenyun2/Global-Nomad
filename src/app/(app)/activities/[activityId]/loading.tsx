import Image from "next/image";
import loadingGif from "@images/loading_text.gif";

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative h-[500px] w-[500px]">
        {/* <Image
          src={loadingGif}
          alt="Loading"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        /> */}
        로딩...
      </div>
    </div>
  );
}
