import { existsSync } from "node:fs";
import path from "node:path";
import { showcaseGraphics } from "@/data/graphics";
import GraphicsShowcaseClient from "./GraphicsShowcaseClient";

export default function GraphicsShowcaseServer() {
  const existingGraphicIds = new Set(
    showcaseGraphics
      .filter((graphic) =>
        existsSync(
          path.join(
            process.cwd(),
            "public",
            decodeURIComponent(graphic.image.replace(/^\/+/, "")),
          ),
        ),
      )
      .map((graphic) => graphic.id),
  );
  const completeBlocks = new Set(
    showcaseGraphics
      .filter((graphic, index, allGraphics) =>
        allGraphics.findIndex((item) => item.block === graphic.block) === index &&
        allGraphics
          .filter((item) => item.block === graphic.block)
          .every((item) => existingGraphicIds.has(item.id)),
      )
      .map((graphic) => graphic.block),
  );
  const availableGraphics = showcaseGraphics.filter((graphic) => completeBlocks.has(graphic.block));

  return <GraphicsShowcaseClient graphics={availableGraphics} />;
}
