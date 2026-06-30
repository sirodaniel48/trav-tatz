'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface Image {
	src: string;
	alt?: string;
}

interface ZoomParallaxProps {
	/** Array of images to be displayed in the parallax effect max 7 images */
	images: Image[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
	const container = useRef(null);
	const [lightboxIndex, setLightboxIndex] = useState(-1);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	return (
		<>
			<div ref={container} className="relative h-[200vh] w-full">
				<div className="sticky top-0 h-screen overflow-hidden">
					{images.map(({ src, alt }, index) => {
						const scale = scales[index % scales.length];

						return (
							<motion.div
								key={index}
								style={{ scale }}
								className={`absolute pointer-events-none top-0 flex h-full w-full items-center justify-center ${index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]' : ''} ${index === 3 ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]' : ''} ${index === 4 ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]' : ''} ${index === 5 ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]' : ''} ${index === 6 ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]' : ''} `}
							>
								<div 
									className="relative pointer-events-auto h-[25vh] w-[25vw] cursor-pointer hover:opacity-90 transition-opacity"
									onClick={() => setLightboxIndex(index)}
								>
									<img
										src={src || '/placeholder.svg'}
										alt={alt || `Parallax image ${index + 1}`}
										className="h-full w-full object-cover"
									/>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
			
			<Lightbox
				open={lightboxIndex >= 0}
				close={() => setLightboxIndex(-1)}
				index={lightboxIndex}
				slides={images.map(img => ({ src: img.src, alt: img.alt || 'Gallery Image' }))}
				styles={{ container: { backgroundColor: "rgba(10, 10, 10, 0.95)" } }}
			/>
		</>
	);
}
