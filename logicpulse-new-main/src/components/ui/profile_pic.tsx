import { getImageUrl } from '@/lib/utils';
import { CircleUser } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

export default function ProfilePic({ path }: { path: string }) {
  return (
    <div className="w-9 h-9 rounded-full border overflow-hidden flex items-center justify-center">
      {path != "null" ? (
        <Image
          src={getImageUrl(path)}
          width={100}
          height={100}
          alt="logo"
        />
      ) : (
        <CircleUser className="h-5 w-5" />
      )}
    </div>
  )
}
