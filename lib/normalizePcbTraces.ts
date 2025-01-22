import type { CircuitJson, PcbTrace } from "circuit-json"
import type { NormalizationTransform } from "./convertCircuitJsonToNormalizedAutoroutingJson"
import type {
  NormalizedAutoroutingTrace,
  NormalizedRoutePoint,
} from "./NormalizedAutoroutingTrace"
import { getFullConnectivityMapFromCircuitJson } from "circuit-json-to-connectivity-map"
import { LAYER_NAME_TO_NUMBER } from "./constants"

export const normalizePcbTraces = ({
  normalizationTransform,
  circuitJson,
  pcbTraceIds,
}: {
  normalizationTransform: NormalizationTransform
  circuitJson: CircuitJson
  pcbTraceIds: string[]
}): NormalizedAutoroutingTrace[] => {
  const connectivityMap = getFullConnectivityMapFromCircuitJson(circuitJson)
  const normalizedTraces: NormalizedAutoroutingTrace[] = []

  for (const pcbTraceId of pcbTraceIds) {
    const pcbTrace = circuitJson.find(
      (el): el is PcbTrace =>
        el.type === "pcb_trace" && el.pcb_trace_id === pcbTraceId,
    )

    if (!pcbTrace?.route) continue

    // Get net from connectivity map using source trace ID
    const sourceTraceId = pcbTrace.source_trace_id
    const connNet = sourceTraceId
      ? connectivityMap.getNetConnectedToId(sourceTraceId)
      : undefined

    // Find normalized net number that contains this source trace ID
    const netEntry = Object.entries(normalizationTransform.netInfo).find(
      ([_, info]) => info.sourceTraceIds.includes(sourceTraceId!),
    )
    if (!netEntry) continue

    const normalizedRoute: NormalizedRoutePoint[] = pcbTrace.route.map(
      (routePoint) => {
        const position = {
          x: routePoint.x - normalizationTransform.offsetX,
          y: routePoint.y - normalizationTransform.offsetY,
        }

        if (routePoint.route_type === "wire") {
          return {
            ...position,
            route_type: "wire" as const,
            width: routePoint.width,
            layer: LAYER_NAME_TO_NUMBER[routePoint.layer],
          }
        } else {
          return {
            ...position,
            route_type: "via" as const,
            from_layer: LAYER_NAME_TO_NUMBER[routePoint.from_layer!],
            to_layer: LAYER_NAME_TO_NUMBER[routePoint.to_layer!],
          }
        }
      },
    )

    normalizedTraces.push({
      net: parseInt(netEntry[0]),
      route: normalizedRoute,
    })
  }

  return normalizedTraces
}
