import type { CircuitJson } from "circuit-json"
import { getFullConnectivityMapFromCircuitJson } from "circuit-json-to-connectivity-map"
import { getBoundsOfRegionOfInterest } from "./getBoundsOfRegionOfInterest"

export type NormalizedAutoroutingJson = {
  allowed_layers: number
  nets_to_route: number[]
  sorted_normalized_objects: Array<{
    net: number | null
    x: string
    y: string
    layers: string[]
    width?: string
    height?: string
    radius?: string
    type?: "pad" | "hole"
  }>
}

export type NormalizationTransform = {
  offsetX: number
  offsetY: number
  netInfo: Record<
    number,
    {
      sourceTraceIds: string[]
      sourceNetIds: string[]
    }
  >
}

export const convertCircuitJsonToNormalizedAutoroutingJson = (
  circuitJson: CircuitJson,
  options: {
    subcircuit_id?: string
    marginOutsideOfRegionOfInterest?: number
  } = {},
): {
  normalizedAutoroutingJson: NormalizedAutoroutingJson
  normalizationTransform: NormalizationTransform
} => {
  const connectivityMap = getFullConnectivityMapFromCircuitJson(circuitJson)

  // Get bounds and calculate offsets
  const {
    minX,
    maxX,
    minY,
    maxY,
    centerX: offsetX,
    centerY: offsetY,
  } = getBoundsOfRegionOfInterest(circuitJson)

  // Collect obstacles with translated positions
  const obstacles = circuitJson
    .filter((el) => el.type === "pcb_smtpad" || el.type === "pcb_plated_hole")
    .map((el) => {
      const base = {
        x: (el.x - offsetX).toFixed(2),
        y: (el.y - offsetY).toFixed(2),
        layers: el.type === "pcb_smtpad" ? [el.layer] : el.layers,
        net: connectivityMap.getNetConnectedToId(
          el.pcb_port_id || el.pcb_plated_hole_id,
        ),
      }

      if (el.type === "pcb_smtpad") {
        return {
          ...base,
          type: "pad" as const,
          width: (el.shape === "rect" ? el.width : el.radius * 2).toFixed(2),
          height: (el.shape === "rect" ? el.height : el.radius * 2).toFixed(2),
        }
      }
      return {
        ...base,
        type: "hole" as const,
        radius: (el.shape === "circle"
          ? el.outer_diameter / 2
          : Math.max(el.outer_width, el.outer_height) / 2
        ).toFixed(2),
      }
    })

  // Collect traces to route
  const traces = circuitJson
    .filter((el) => el.type === "source_trace")
    .map((trace) => {
      const connNet = connectivityMap.getNetConnectedToId(trace.source_trace_id)
      const ports = trace.connected_source_port_ids.flatMap((portId) =>
        circuitJson.filter(
          (el) => el.type === "pcb_port" && el.source_port_id === portId,
        ),
      )

      return {
        net: connNet,
        route: ports.map((port) => ({
          x: (port.x - offsetX).toFixed(2),
          y: (port.y - offsetY).toFixed(2),
          layers: port.layers,
        })),
      }
    })

  // Sort objects by layers, x, y, width, height
  const sortedObstacles = [...obstacles].sort((a, b) => {
    const layerCompare = a.layers.join().localeCompare(b.layers.join())
    if (layerCompare !== 0) return layerCompare
    if (a.x !== b.x) return a.x.localeCompare(b.x)
    if (a.y !== b.y) return a.y.localeCompare(b.y)
    return (a.width || a.radius || "").localeCompare(b.width || b.radius || "")
  })

  // Convert net IDs to numeric indices based on first occurrence in sorted obstacles
  const connNetToNetNumber = new Map<string, number>()
  let netCounter = 1

  // Only include nets that are being routed (have traces)
  const routedNets = new Set(
    traces.map((t) => t.net).filter((n) => n !== null),
  ) as Set<string>

  // Process nets in sort order from obstacles then traces, but only those being routed
  const allConnNetNamesInOrder = [
    ...sortedObstacles
      .map((o) => o.net)
      .filter((n) => n !== null && routedNets.has(n)),
    ...traces.map((t) => t.net).filter((n) => n !== null),
  ] as string[]

  for (const connNetName of allConnNetNamesInOrder) {
    if (!connNetToNetNumber.has(connNetName)) {
      connNetToNetNumber.set(connNetName, netCounter++)
    }
  }

  // Convert nets to numeric indices in obstacles and traces
  const normalizedObstacles = sortedObstacles.map((o) => ({
    ...o,
    net: o.net ? (connNetToNetNumber.get(o.net) ?? null) : null,
  }))

  // Get unique numeric nets to route
  const netsToRoute = Array.from(
    new Set(
      normalizedObstacles
        .map((t) => t.net)
        .filter((n): n is number => n !== null),
    ),
  ).sort()

  const normalizedAutoroutingJson: NormalizedAutoroutingJson = {
    allowed_layers: 1,
    nets_to_route: netsToRoute,
    sorted_normalized_objects: normalizedObstacles,
  }

  // Build netInfo by collecting source trace and net information
  const netInfo: Record<
    number,
    { sourceTraceIds: string[]; sourceNetIds: string[] }
  > = {}

  // Process all source traces to populate netInfo
  for (const el of circuitJson) {
    if (el.type === "source_trace") {
      const connNet = connectivityMap.getNetConnectedToId(el.source_trace_id)
      const netNumber = connNetToNetNumber.get(connNet)

      if (!netNumber) continue

      netInfo[netNumber] ??= {
        sourceTraceIds: [],
        sourceNetIds: [],
      }
      netInfo[netNumber].sourceTraceIds.push(el.source_trace_id)
      netInfo[netNumber].sourceNetIds.push(
        ...(el.connected_source_net_ids || []),
      )
    }
  }

  // Deduplicate sourceNetIds
  for (const info of Object.values(netInfo)) {
    info.sourceNetIds = [...new Set(info.sourceNetIds)]
  }

  return {
    normalizedAutoroutingJson,
    normalizationTransform: {
      offsetX,
      offsetY,
      netInfo,
    },
  }
}
