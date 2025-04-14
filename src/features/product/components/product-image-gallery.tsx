"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  images: string[];
}

export function ProductImageGallery({ images }: Props) {
  const [selected, setSelected] = useState<string>(images[0]);

  return (
    <div className="flex flex-col-reverse lg:flex-row lg:space-x-3.5">
      <div className="flex w-full items-center justify-center space-x-3 lg:w-fit lg:flex-col lg:justify-start lg:space-y-3.5 lg:space-x-0">
        {images.map((image, i) => (
          <button
            key={i}
            type="button"
            className="aspect-square max-h-[106px] w-full max-w-[111px] overflow-hidden rounded-[13px] bg-[#F0EEED] xl:max-h-[167px] xl:min-h-[167px] xl:max-w-[152px] xl:rounded-[20px]"
            onClick={() => setSelected(image)}
          >
            <Image
              src={image}
              width={152}
              height={167}
              className="h-full w-full rounded-md object-cover transition-all duration-500 hover:scale-110"
              alt={image}
              style={{ objectPosition: "center 0%" }}
              priority
            />
          </button>
        ))}
      </div>
      <div className="mx-auto mb-3 flex h-full max-h-[530px] min-h-[330px] w-full items-center justify-center overflow-hidden rounded-[13px] bg-[#F0EEED] sm:w-96 sm:rounded-[20px] md:w-full lg:mb-0 lg:min-h-[380px] xl:min-h-[530px]">
        <Image
          src={selected}
          width={444}
          height={530}
          className="h-full w-full rounded-md object-cover transition-all duration-500 hover:scale-110"
          style={{ objectPosition: "center 0%" }}
          alt={selected}
          priority
        />
      </div>
    </div>
  );
}
