/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface BrandSliderProps {
    variant: 'examples';
    className?: string;
}

export const BrandSlider: React.FC<BrandSliderProps> = ({ variant, className = '' }) => {
    const ServiceSliderSettings = {
        infinite: true,
        speed: 5000,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        reverse: true,
        autoplaySpeed: 100,
        cssEase: "linear",
        direction: "horizontal",
        rtl: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };

    const TestimonialSliderSettings = {
        infinite: true,
        speed: 7000,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        reverse: true,
        autoplaySpeed: 100,
        cssEase: "linear",
        direction: "left",
        rtl: true,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const client = [
        {
            'title': 'SaaS Development',
            'url': 'https://zgyslfhedwkrwtdihcjt.supabase.co/storage/v1/object/sign/landing-page-scroll/12C.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsYW5kaW5nLXBhZ2Utc2Nyb2xsLzEyQy5tcDQiLCJpYXQiOjE3NDc4MjkyNTEsImV4cCI6MjA2MzE4OTI1MX0.YGHOcYQg7soryXIsQ79wY2KlH3ADuBGBvrOgMlt3hTU'
        },
        {
            'title': 'SaaS Development',
            'url': 'https://zgyslfhedwkrwtdihcjt.supabase.co/storage/v1/object/sign/landing-page-scroll/Ai2.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsYW5kaW5nLXBhZ2Utc2Nyb2xsL0FpMi5tcDQiLCJpYXQiOjE3NDc4MjkzNTEsImV4cCI6MjA2MzE4OTM1MX0.01eA_bnftM9JBFyh7_U6W9KIn-GHWWgrF2Ydq8m4FsE'
        },
        {
            'title': 'SaaS Development',
            'url': 'https://zgyslfhedwkrwtdihcjt.supabase.co/storage/v1/object/sign/landing-page-scroll/AI.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsYW5kaW5nLXBhZ2Utc2Nyb2xsL0FJLm1wNCIsImlhdCI6MTc0NzgyOTM2NywiZXhwIjoyMDYzMTg5MzY3fQ.vsdfpHmTorItWWBrP7aKorIalskWluDQMxhfaIFBwag'
        },
        {
            'title': 'SaaS Development',
            'url': 'https://zgyslfhedwkrwtdihcjt.supabase.co/storage/v1/object/sign/landing-page-scroll/Bin%20laden.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsYW5kaW5nLXBhZ2Utc2Nyb2xsL0JpbiBsYWRlbi5tcDQiLCJpYXQiOjE3NDc4MjkzOTgsImV4cCI6MjA2MzE4OTM5OH0.iX_7czzVZJpaGrpOMnC-j2TmL1vcKVzCcrkQSIaKOJg'
        },
        {
            'title': 'SaaS Development',
            'url': 'https://zgyslfhedwkrwtdihcjt.supabase.co/storage/v1/object/sign/landing-page-scroll/himalayas.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsYW5kaW5nLXBhZ2Utc2Nyb2xsL2hpbWFsYXlhcy5tcDQiLCJpYXQiOjE3NDc4Mjk0MTYsImV4cCI6MjA2MzE4OTQxNn0.EIEcUQOkVS9v1DmzbzTH9jbNa5EtrW9_gcUZSQuqWDc'
        },
        {
            'title': 'SaaS Development',
            'url': 'https://zgyslfhedwkrwtdihcjt.supabase.co/storage/v1/object/sign/landing-page-scroll/LV.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsYW5kaW5nLXBhZ2Utc2Nyb2xsL0xWLm1wNCIsImlhdCI6MTc0NzgyOTQzMiwiZXhwIjoyMDYzMTg5NDMyfQ.1sU3byvW7AdbDm8nYDx4zMM2SofG55ep6MOgyKA6-X4'
        },
        {
            'title': 'SaaS Development',
            'url': 'https://zgyslfhedwkrwtdihcjt.supabase.co/storage/v1/object/sign/landing-page-scroll/mumbai.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsYW5kaW5nLXBhZ2Utc2Nyb2xsL211bWJhaS5tcDQiLCJpYXQiOjE3NDc4Mjk0NDUsImV4cCI6MjA2MzE4OTQ0NX0.-4zrQnD8EmsvhRttTfH6isRDv4z01IxLPI-XXJVo7ZU'
        },
    ]

    const examplesSlider = () => (
        <div className={`w-full overflow-hidden ${className}`}>
            <Slider {...TestimonialSliderSettings} className="">
                {client.map((item, index) => (

                    <div key={index} className="p-2 overflow-hidden rounded-2xl">
                        <div className="w-fit mx-auto p-2 mb-5 shadow-md shadow-indigo-500 text-left rounded-2xl overflow-hidden">
                            <video className="h-96" autoPlay muted>
                                <source src={item.url}  className="rounded-2xl"/>
                            </video>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );

    return variant === 'examples' && examplesSlider();
};