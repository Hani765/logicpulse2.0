import { CardStackDemo } from '@/components/auth/cards'
import TooltipDemo from '@/components/auth/tolltip-demo'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Recover Your Logic Pulse Account Password - Affiliate Marketing Mastery',
    description: 'Recover your password for Logic Pulse. Logic Pulse is your go-to affiliate marketing platform that drives traffic, offers analytics, and provides comprehensive reports.',
    keywords: ['Logic Pulse', 'forgot password', 'recover password', 'affiliate marketing', 'traffic analytics', 'marketing reports', 'password reset'],
    openGraph: {
        title: 'Recover Your Logic Pulse Account Password - Affiliate Marketing Mastery',
        description: 'Recover your password for Logic Pulse. Logic Pulse is your go-to affiliate marketing platform that drives traffic, offers analytics, and provides comprehensive reports.',
        url: 'https://www.logicpulse.com/forgot',
        type: 'website',
        images: [
            {
                url: 'https://www.logicpulse.com/images/og-image.jpg',
                width: 800,
                height: 600,
                alt: 'Logic Pulse Forgot Password'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Recover Your Logic Pulse Account Password - Affiliate Marketing Mastery',
        description: 'Recover your password for Logic Pulse. Logic Pulse is your go-to affiliate marketing platform that drives traffic, offers analytics, and provides comprehensive reports.',
        images: 'https://www.logicpulse.com/images/og-image.jpg'
    }
}

export default function Page() {
    return (
        <>
            <div className="col-span-2 min-h-screen overflow-hidden">
                <div className="w-full flex justify-center items-center h-full lg:col-span-2 my-4 relative">
                    {/* Replace with your Forgot Password component */}
                </div>
            </div>
            <div className="min-h-screen hidden lg:flex lg:col-span-3 bg-purple-950 bg-dot-white/[0.5] relative items-center justify-center flex-1 w-full max-h-full overflow-hidden flex-col pt-10 pl-24 gap-3">
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-slate-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <BackgroundBeams />
                <div className="text-white flex flex-col items-start">
                    <h2 className="md:text-4xl font-bold">
                        Forgot Your Password? Recover it with Logic Pulse!
                    </h2>
                    <p className="md:text-sm mb-10 text-gray-300">
                        Recover your password with Logic Pulse. We provide tools to drive traffic, offer analytics, and provide comprehensive reports. Get back to managing your affiliate marketing strategies today!
                    </p>
                </div>
                <div className="flex justify-start h-full w-full">
                    <CardStackDemo />
                </div>
                <div className="flex absolute bottom-4 left-4 z-50">
                    <TooltipDemo />
                </div>
            </div>
        </>
    )
}
