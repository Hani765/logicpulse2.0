import React from 'react'
import { Button } from '../ui/button'

import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa6';
import { MdMailLock } from 'react-icons/md';

export default function SocialLogin() {
    return (
        <>
            <Button variant="ringHover" size="icon" className="rounded-full bg-gray-100 shadow-md transition-all duration-300 hover:bg-gray-200 hover:ring-gray-200"><FcGoogle /></Button>
            <Button variant="ringHover" size="icon" className="rounded-full bg-gray-100 shadow-md hover:transition-all text-black duration-300 hover:bg-gray-200 hover:ring-gray-200"><FaGithub /></Button>
            <Button variant="ringHover" size="icon" className="rounded-full bg-gray-100 shadow-md hover:transition-all text-black duration-300 hover:bg-gray-200 hover:ring-gray-200"><MdMailLock /></Button>
        </>
    )
}
