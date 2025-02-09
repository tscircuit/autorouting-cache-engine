import type { CircuitJson, PcbTrace } from "circuit-json"
import type { NormalizationTransform, NormalizedTrace } from "./types"
import { getFullConnectivityMapFromCircuitJson } from "circuit-json-to-connectivity-map"
import { LAYER_NAME_TO_NUMBER } from "./constants"
import { getRouteSegmentsFromTrace } from "./circuit-json-utils/getRouteSegmentsFromTrace"
import { getViasFromTrace } from "./circuit-json-utils/getViasFromTrace"

export const normalizePcbTraces = ({
  normalizationTransform,
  circuitJson,
  pcbTraceIds,
}: {
  normalizationTransform: NormalizationTransform
  circuitJson: CircuitJson
  pcbTraceIds: string[]
}): NormalizedTrace[] => {
  const normalizedTraces: NormalizedTrace[] = []

  const sourceTraceIdToNetMap = new Map<string, number>()
  for (const [net, info] of Object.entries(normalizationTransform.netInfo)) {
    for (const sourceTraceId of info.sourceTraceIds) {
      sourceTraceIdToNetMap.set(sourceTraceId, parseInt(net))
    }
  }

  for (const pcbTraceId of pcbTraceIds) {
    const pcbTrace = circuitJson.find(
      (el): el is PcbTrace =>
        el.type === "pcb_trace" && el.pcb_trace_id === pcbTraceId,
    )

    if (!pcbTrace?.route) continue

    const sourceTraceId = pcbTrace.source_trace_id
    const connNet = sourceTraceId
      ? (sourceTraceIdToNetMap.get(sourceTraceId) ?? null)
      : undefined

    if (connNet === null) continue

    const normalizedPcbTrace: NormalizedTrace = {
      net: connNet!,
      type: "trace",
      route_segments: getRouteSegmentsFromTrace(
        pcbTrace,
        normalizationTransform,
      ),
      vias: getViasFromTrace(pcbTrace, normalizationTransform),
    }

    normalizedTraces.push(normalizedPcbTrace)
  }

  return normalizedTraces
}
