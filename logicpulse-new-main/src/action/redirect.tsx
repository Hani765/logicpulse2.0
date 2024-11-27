"use server";

import { redirect } from "next/navigation";

export default async function redirectPath(path: string) {
  redirect(path);
}
