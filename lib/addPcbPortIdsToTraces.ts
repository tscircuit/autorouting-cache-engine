import type {
  CircuitJson,
  PcbPort,
  PcbTrace,
  PcbTraceRoutePoint,
} from "circuit-json"

export const findPcbPortForRoutePoint = (
  circuitJson: CircuitJson,
  routePoint: PcbTraceRoutePoint,
  endpoint: "start" | "end" = "start",
) => {
  const routePointPosition =
    routePoint.route_type === "through_pad"
      ? routePoint[endpoint]
      : { x: routePoint.x, y: routePoint.y }

  // HACK: if the route point is less than 0.1mm away from a pcb_port we'll say
  // it's connected.
  const pcbPorts = circuitJson.filter(
    (el): el is PcbPort => el.type === "pcb_port",
  )
  const pcbPortsWithin01mm = pcbPorts.filter((pcbPort) => {
    return (
      Math.abs(pcbPort.x - routePointPosition.x) < 0.1 &&
      Math.abs(pcbPort.y - routePointPosition.y) < 0.1
    )
  })
  if (pcbPortsWithin01mm.length === 0) {
    return undefined
  }
  if (pcbPortsWithin01mm.length === 1) {
    return pcbPortsWithin01mm[0]?.pcb_port_id
  }

  // return the closest pcb port if we have multiple matches within 0.1mm
  return pcbPortsWithin01mm.reduce(
    (closest, pcbPort) => {
      const distance = Math.sqrt(
        (pcbPort.x - routePointPosition.x) ** 2 +
          (pcbPort.y - routePointPosition.y) ** 2,
      )
      return distance < closest.distance
        ? { distance, pcbPortId: pcbPort.pcb_port_id }
        : closest
    },
    { distance: Infinity, pcbPortId: undefined as string | undefined },
  ).pcbPortId
}

export const addPcbPortIdsToTraces = (
  circuitJson: CircuitJson,
  traces: PcbTrace[],
) => {
  for (const trace of traces) {
    if (trace.route.length <= 2) continue
    const startPcbPortId = findPcbPortForRoutePoint(
      circuitJson,
      trace.route[0],
      "start",
    )
    const endPcbPortId = findPcbPortForRoutePoint(
      circuitJson,
      trace.route[trace.route.length - 1],
      "end",
    )
    ;(trace.route[0] as any).start_pcb_port_id = startPcbPortId
    ;(trace.route[trace.route.length - 1] as any).end_pcb_port_id = endPcbPortId
  }
  return traces
}
