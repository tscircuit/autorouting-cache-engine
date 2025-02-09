import type { PcbTrace } from "circuit-json"
import type {
  NormalizationTransform,
  NormalizedObject,
  NormalizedTraceObstacle,
} from "../types"

/**
 * Get the route segments for a trace relative to the region of interest
 */
export const getRouteSegmentsFromTrace = (
  trace: PcbTrace,
  normalizationTransform: { offsetX: number; offsetY: number },
): NormalizedTraceObstacle["route_segments"] => {
  const { offsetX, offsetY } = normalizationTransform
  const segments = []
  for (let i = 0; i < trace.route.length - 1; i++) {
    const current = trace.route[i]
    const next = trace.route[i + 1]
    if (current.route_type === "wire" && next.route_type === "wire") {
      segments.push({
        x1: (Number(current.x) - offsetX).toFixed(2),
        y1: (Number(current.y) - offsetY).toFixed(2),
        x2: (Number(next.x) - offsetX).toFixed(2),
        y2: (Number(next.y) - offsetY).toFixed(2),
        layer: current.layer,
      })
    }
  }

  segments.sort((a, b) =>
    `${a.layer},${a.x1},${a.y1},${a.x2},${a.y2}`.localeCompare(
      `${b.layer},${b.x1},${b.y1},${b.x2},${b.y2}`,
    ),
  )

  return segments
}
