import type { CircuitJson, PcbTrace } from "circuit-json"
import type { NormalizationTransform } from "./convertCircuitJsonToNormalizedAutoroutingJson"
import type { NormalizedAutoroutingTrace } from "./NormalizedAutoroutingTrace"

export const normalizePcbTraces = ({
  normalizationTransform,
  circuitJson,
  pcbTraceIds,
}: {
  normalizationTransform: NormalizationTransform
  circuitJson: CircuitJson
  pcbTraceIds: string[]
}): NormalizedAutoroutingTrace[] => {
  const { offsetX: sourceOffsetX, offsetY: sourceOffsetY } =
    normalizationTransform

  return circuitJson
    .filter(
      (el): el is PcbTrace =>
        el.type === "pcb_trace" && pcbTraceIds.includes(el.pcb_trace_id),
    )
    .map((trace) => ({
      ...trace,
      route: trace.route.map((routePoint) => ({
        ...routePoint,
        x: routePoint.x - sourceOffsetX,
        y: routePoint.y - sourceOffsetY,
      })),
    }))
}
