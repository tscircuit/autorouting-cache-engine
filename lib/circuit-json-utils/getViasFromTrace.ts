import type { PcbTrace } from "circuit-json"
import type { NormalizedTrace } from "../types"

export const getViasFromTrace = (
  trace: PcbTrace,
  normalizationTransform: {
    offsetX: number
    offsetY: number
  },
): NormalizedTrace["vias"] => {
  const vias: NormalizedTrace["vias"] = []
  for (const point of trace.route) {
    if (point.route_type === "via") {
      vias.push({
        x: (Number(point.x) - normalizationTransform.offsetX).toFixed(2),
        y: (Number(point.y) - normalizationTransform.offsetY).toFixed(2),
        layers: [point.from_layer, point.to_layer],
        // TODO where is this stored?
        radius: "0.60",
      })
    }
  }
  return vias
}
