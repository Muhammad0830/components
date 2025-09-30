"use client";

import { Link } from "lucide-react";
import NextLink from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <ul className="flex flex-col gap-2 ">
        <li>
          <NextLink
            href={"/dragAndDropCards"}
            className="flex items-center gap-2"
          >
            <Link className="w-5 h-5 text-black dark:text-white" />
            <div>Drag and Drop Cards</div>
          </NextLink>
        </li>
      </ul>
    </div>
  );
}
