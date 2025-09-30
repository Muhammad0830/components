"use client";

import { Link } from "lucide-react";
import NextLink from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl mb-4">Components</h1>
      <h3 className="text-xl ">
        Click one of the links below to see the components in action
      </h3>
      <ul className="flex flex-col p-2 rounded-md border mt-4">
        <li>
          <NextLink
            href={"/dragAndDropCards"}
            className="flex items-center gap-2 hover:bg-neutral-900 p-2 rounded-sm"
          >
            <Link className="w-5 h-5 text-black dark:text-white" />
            <div>Drag and Drop Cards</div>
          </NextLink>
        </li>
      </ul>
    </div>
  );
}
