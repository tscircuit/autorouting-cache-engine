import type { PcbTrace } from "circuit-json"
import type { NormalizedTraceObstacle } from "../types"

export const getViasFromTrace = (
  trace: PcbTrace,
  normalizationTransform: {
    offsetX: number
    offsetY: number
  },
): NormalizedTraceObstacle["vias"] => {
  const vias: NormalizedTraceObstacle["vias"] = []
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

  vias.sort((a, b) =>
    `${a.layers.join("/")},${a.x},${a.y}`.localeCompare(
      `${b.layers.join("/")},${b.x},${b.y}`,
    ),
  )

  return vias
}
