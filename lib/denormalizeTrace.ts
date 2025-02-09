import type {PcbTrace} from "circuit-json"
import type { NormalizationTransform, NormalizedTrace } from "./types"

export const denormalizeTrace = ({
  normalizedTrace,
  normalizationTransform,
  subcircuitId,
}: {
  normalizedTrace: NormalizedTrace,
  normalizationTransform: NormalizationTransform,
  subcircuitId?: string
}): PcbTrace => {
  const { offsetX, offsetY, netInfo } = normalizationTransform

  const denormalizedTrace: PcbTrace = {
    
}