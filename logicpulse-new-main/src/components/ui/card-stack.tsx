"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from 'next/image'
let interval: any;

type Card = {
    id: number;
    name: string;
    designation: string;
    content: string;
};

export const CardStack = ({
    items,
    offset,
    scaleFactor,
}: {
    items: Card[];
    offset?: number;
    scaleFactor?: number;
}) => {
    const CARD_OFFSET = offset || 10;
    const SCALE_FACTOR = scaleFactor || 0.06;
    const [cards, setCards] = useState<Card[]>(items);

    useEffect(() => {
        startFlipping();

        return () => clearInterval(interval);
    }, []);
    const startFlipping = () => {
        interval = setInterval(() => {
            setCards((prevCards: Card[]) => {
                const newArray = [...prevCards]; // create a copy of the array
                newArray.unshift(newArray.pop()!); // move the last element to the front
                return newArray;
            });
        }, 10000);
    };

    return (
        <div className="relative h-full w-full">
            {cards.map((card, index) => {
                return (
                    <motion.div
                        key={card.id}
                        className="absolute h-fit w-fit shadow-xl shadow-black/[0.1] dark:shadow-white/[0.05]"
                        style={{
                            transformOrigin: "top center",
                        }}
                        animate={{
                            top: index * -CARD_OFFSET,
                            scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
                            zIndex: cards.length - index, //  decrease z-index for the cards that are behind
                        }}
                    >
                        <div className="font-normaltext-neutral-200">
                            <Image src={`/${card.content}`} alt={card.designation} 
                            loading="lazy"
                                sizes="30"
                                className="!w-[100%]"
                                width={0}
                                height={0} />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};
