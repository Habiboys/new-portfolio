"use client";
import React from "react";
import { LayoutGrid } from "./ui/layout-grid";
import type { GalleryItem } from "@/types/portfolio";

const CardSkeleton = ({ title }: { title: string }) => (
  <div>
    <p className="font-bold md:text-2xl text-xl text-white">{title}</p>
  </div>
);

export function Gallery({ items }: { items: GalleryItem[] }) {
  const cards = items.map((item) => ({
    id: Number(item.id),
    content: <CardSkeleton title={item.title} />,
    className: item.className ?? "col-span-1",
    thumbnail: item.thumbnail,
  }));

  return (
    <div className="h-screen py-20 w-full">
      <LayoutGrid cards={cards} />
    </div>
  );
}
