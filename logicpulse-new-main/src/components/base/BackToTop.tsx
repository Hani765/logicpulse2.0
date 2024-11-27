"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { FaAngleDoubleUp } from 'react-icons/fa';

const BackToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <>
            {isVisible ?
                (
                    <div className="fixed bottom-16 right-4 transition-opacity duration-300" >
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={scrollToTop}
                            className={`transition-transform duration-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        >
                            <FaAngleDoubleUp />
                        </Button>
                    </div >
                ) : null
            }

        </>

    );
};

export default BackToTop;
