import type { CircuitJson, PcbTrace, PcbTraceRoutePoint } from "circuit-json"

export const findPcbPortForRoutePoint = (
  circuitJson: CircuitJson,
  routePoint: PcbTraceRoutePoint,
) => {
  // HACK: if the route point is less than 0.1mm away from a pcb_port we'll say
  // it's connected.
  const pcbPorts = circuitJson.filter((el: any) => el.type === "pcb_port")
  const pcbPortsWithin01mm: any[] = pcbPorts.filter((pcbPort: any) => {
    return (
      Math.abs(pcbPort.x - routePoint.x) < 0.1 &&
      Math.abs(pcbPort.y - routePoint.y) < 0.1
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
    (closest: any, pcbPort: any) => {
      const distance = Math.sqrt(
        (pcbPort.position.x - routePoint.x) ** 2 +
          (pcbPort.position.y - routePoint.y) ** 2,
      )
      return distance < closest.distance ? pcbPort : closest
    },
    { distance: Infinity, pcb_port_id: null },
  ).pcb_port_id
}

export const addPcbPortIdsToTraces = (
  circuitJson: CircuitJson,
  traces: PcbTrace[],
) => {
  for (const trace of traces) {
    if (trace.route.length <= 2) continue
    const startPcbPortId = findPcbPortForRoutePoint(circuitJson, trace.route[0])
    const endPcbPortId = findPcbPortForRoutePoint(
      circuitJson,
      trace.route[trace.route.length - 1],
    )
    ;(trace.route[0] as any).start_pcb_port_id = startPcbPortId
    ;(trace.route[trace.route.length - 1] as any).end_pcb_port_id = endPcbPortId
  }
  return traces
}
