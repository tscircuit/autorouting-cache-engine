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
  const normalizedTraces: NormalizedAutoroutingTrace[] = []
  // TODO implement
  return normalizedTraces
}
