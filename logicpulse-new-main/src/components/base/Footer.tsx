import React from 'react'
import { FaFacebook, FaInstagram, FaPinterest, FaSkype, FaTwitter, FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
    return (
        <div className="pb-4 pt-2">
            <div className="bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-900 w-full shadow-sm flex justify-between items-center px-2 rounded py-4">
                <div className="left">
                    <p className="text-center  mt-2">
                        &copy; {new Date().getFullYear()} LogicPulse. All rights reserved.
                    </p>
                </div>
                <div className="right social-icons flex gap-4 text-lg items-center">
                    <FaFacebook />
                    <FaWhatsapp />
                    <FaTwitter />
                    <FaInstagram />
                    <FaPinterest />
                    <FaSkype />
                </div>
            </div>
        </div>
    )
}
