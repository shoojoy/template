import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';

// slick-carousel CSS
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Media {
    title: string;
    image_filename: string;
    token: string;
}

export default function MediaCarousel() {
    const [medias, setMedias] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get<{ status: boolean; medias: Media[] }>('/media')
            .then(res => {
                if (!res.data.status) throw new Error('Failed to load media');
                setMedias(res.data.medias);
            })
            .catch(err => {
                console.error(err);
                setError('미디어를 불러오는 중 오류가 발생했습니다.');
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="w-full h-screen bg-white flex items-center justify-center">
                <p className="text-gray-500">로딩 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-screen bg-white flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!medias.length) {
        return (
            <div className="w-full h-screen bg-white flex items-center justify-center">
                <p className="text-gray-500">등록된 미디어가 없습니다.</p>
            </div>
        );
    }

    // 캐러셀 설정
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <div id="media" className="w-full h-screen bg-gray-200 py-8">
            <div className="max-w-screen-2xl mx-auto px-2">
                <Slider {...settings}>
                    {medias.map(media => (
                        <div key={media.token} className="px-4">
                            <div className="bg-white shadow rounded-2xl overflow-hidden w-full h-[320px]">
                                <img
                                    src={media.image_filename}
                                    alt={media.title}
                                    className="w-full h-full object-cover"
                                />
                                <h3 className="text-lg font-medium text-black ">
                                    {media.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}
