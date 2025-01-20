# autorouting-cache-engine

Generate a cache key(s) to enable re-using previous autorouting results.

```tsx
import { generateAutoroutingCacheKey } from "@tscircuit-internal/autorouting-cache-engine"
import circuitJson from "./circuit.json"

const { cacheKey, transformTracesToCacheSpace, transformTracesFromCacheSpace } =
  generateAutoroutingCacheKey(circuitJson, {
    subcircuit_id: "...",
  })

console.log(cacheKey)
// 938c2cc0dcc05f2b68c4287040cfcf71

// ------------- USAGE WITH CACHE -------------------

import myCachedTraces from "./cached-traces"

const cachedTraces = myCachedTraces.get(cacheKey)

if (!cachedTraces) {
  const newlyRoutedTraces = autoroute(circuitJson)
  const cacheSpaceTraces = transformTracesToCacheSpace(newlyRoutedTraces)
  myCachedTraces.set(cacheKey, cacheSpaceTraces)

  const circuitJsonWithTraces = circuitJson.concat(newlyRoutedTraces)
} else (cachedTraces) {
  // We found the traces in the cache! Let's use them!
  const traces = transformTracesFromCacheSpace(cachedTraces)

  const circuitJsonWithTraces = circuitJson.concat(traces)
}


```

You can now use this `cacheKey` to see if you've already routed this subcircuit,
and re-use the results!

The `cacheKeyTransform` represents how you need to
