import type { CircuitJson, PcbTrace } from "circuit-json"
import type { CacheSpaceTransform } from "./convertCircuitJsonToNormalizedAutoroutingJson"
import type { NormalizedAutoroutingTrace } from "./NormalizedAutoroutingTrace"

export const normalizePcbTraces = ({
  cacheSpaceTransform,
  circuitJson,
  pcbTraceIds,
}: {
  cacheSpaceTransform: CacheSpaceTransform
  circuitJson: CircuitJson
  pcbTraceIds: string[]
}): NormalizedAutoroutingTrace[] => {
  const { offsetX: sourceOffsetX, offsetY: sourceOffsetY } = cacheSpaceTransform
  const targetOffsetX = 0 // Cache space is always centered at 0,0
  const targetOffsetY = 0

  return circuitJson
    .filter(
      (el): el is PcbTrace =>
        el.type === "pcb_trace" && pcbTraceIds.includes(el.pcb_trace_id),
    )
    .map((trace) => ({
      ...trace,
      route: trace.route.map((routePoint) => ({
        ...routePoint,
        x: routePoint.x - sourceOffsetX + targetOffsetX,
        y: routePoint.y - sourceOffsetY + targetOffsetY,
      })),
    }))
}
