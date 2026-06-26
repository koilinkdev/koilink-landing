"use client";

import React from "react";
import { Box, IconButton, styled } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { A11y, Keyboard, Pagination } from "swiper/modules";
import { common, primary } from "@/theme/palette";

import "swiper/css";
import "swiper/css/pagination";

type ProfileGalleryCarouselProps = {
  images: string[];
  alt?: string;
};

const CarouselWrap = styled(Box)`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  margin: 0 0 18px;
  border-radius: 24px;
  overflow: hidden;
  background-color: ${common.white};
  border: 1px solid ${common.colorE8EBEC};

  .swiper,
  .swiper-slide {
    width: 100%;
    height: 100%;
  }

  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  /* Pagination dots */
  .swiper-pagination {
    bottom: 10px;
  }
  .swiper-pagination-bullet {
    width: 7px;
    height: 7px;
    background-color: ${common.white};
    opacity: 0.6;
    box-shadow: 0 0 4px rgba(13, 28, 46, 0.45);
    transition: width 0.25s ease, opacity 0.25s ease, background-color 0.25s ease;
  }
  .swiper-pagination-bullet-active {
    width: 18px;
    border-radius: 4px;
    background-color: ${primary.main};
    opacity: 1;
  }
`;

const NavButton = styled(IconButton)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  width: 36px;
  height: 36px;
  padding: 0;
  color: ${primary.main};
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 10px rgba(13, 28, 46, 0.2);
  backdrop-filter: blur(2px);
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: ${common.white};
    transform: translateY(-50%) scale(1.06);
  }
  svg {
    font-size: 22px;
  }
`;

const Counter = styled("span")`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: ${common.white};
  background-color: rgba(13, 28, 46, 0.5);
  backdrop-filter: blur(2px);
`;

const ProfileGalleryCarousel = ({ images, alt = "Profile photo" }: ProfileGalleryCarouselProps) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const swiperRef = React.useRef<SwiperClass | null>(null);
  const hasMultiple = images.length > 1;

  if (images.length === 0) return null;

  return (
    <CarouselWrap>
      {hasMultiple && (
        <Counter>
          {activeIndex + 1} / {images.length}
        </Counter>
      )}

      <Swiper
        modules={[Pagination, Keyboard, A11y]}
        pagination={hasMultiple ? { clickable: true } : false}
        keyboard={{ enabled: true }}
        loop={hasMultiple}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        slidesPerView={1}
        spaceBetween={0}
      >
        {images.map((image, index) => (
          <SwiperSlide key={`${index}-${image.slice(0, 32)}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={`${alt} ${index + 1}`} draggable={false} />
          </SwiperSlide>
        ))}
      </Swiper>

      {hasMultiple && (
        <>
          <NavButton
            aria-label="Previous photo"
            onClick={() => swiperRef.current?.slidePrev()}
            sx={{ left: 12 }}
          >
            <ChevronLeftRoundedIcon />
          </NavButton>
          <NavButton
            aria-label="Next photo"
            onClick={() => swiperRef.current?.slideNext()}
            sx={{ right: 12 }}
          >
            <ChevronRightRoundedIcon />
          </NavButton>
        </>
      )}
    </CarouselWrap>
  );
};

export default ProfileGalleryCarousel;
