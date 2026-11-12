"use client";
import Link from "next/link";
import { track } from "@/lib/track";
export default function TrackLink({ href, event, props, className, children }: { href: string; event: string; props?: Record<string, unknown>; className?: string; children: React.ReactNode }) {
  return <Link href={href} className={className} onClick={() => track(event, props)}>{children}</Link>;
}
