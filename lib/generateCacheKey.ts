import type { CircuitJson } from "circuit-json"
import { createHash } from "node:crypto"
import type { NormalizationOptions } from "./types"
import { convertCircuitJsonToNormalizedAutoroutingJson } from "./convertCircuitJsonToNormalizedAutoroutingJson"
import deterministicStringify from "json-stringify-deterministic"

export const generateCacheKey = (
  circuitJson: CircuitJson,
  options?: NormalizationOptions,
) => {
  const { normalizationTransform, normalizedAutoroutingJson } =
    convertCircuitJsonToNormalizedAutoroutingJson(circuitJson, options)

  const longString = deterministicStringify(normalizedAutoroutingJson)

  const cacheKey = createHash("md5").update(longString).digest("hex")

  return {
    normalizationTransform,
    normalizedAutoroutingJson,
    longString,
    cacheKey,
  }
}
