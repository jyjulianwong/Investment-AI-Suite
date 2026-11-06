import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BaseEdge,
  Background,
  EdgeLabelRenderer,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  getBezierPath,
  getSmoothStepPath,
  useReactFlow,
  useStore,
  type Edge,
  type FitViewOptions,
  type EdgeProps,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  NODE_WIDTH,
  STANDALONE_TOOLS,
  WORKFLOW_EDGES,
  WORKFLOW_NODES,
  type Side,
  type WorkflowNodeSpec,
} from '../data/workflow'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useSpotlight } from '../hooks/useSpotlight'
import RevealOnScroll from './RevealOnScroll'
import SectionHeading from './SectionHeading'

const GOLD = '#e7c47e'

/** The narrow layout's bypass edge routes ~38 units left of the nodes, so reserve room for it when fitting. */
const FIT_WIDE: FitViewOptions = { padding: 0.04 }
const FIT_NARROW: FitViewOptions = { padding: { top: '8px', right: '4px', bottom: '8px', left: '52px' } }

const POSITION: Record<Side, Position> = {
  l: Position.Left,
  r: Position.Right,
  t: Position.Top,
  b: Position.Bottom,
}

type NodeData = { spec: WorkflowNodeSpec; dim: boolean; onHover: (id: string | null) => void }
type WfNode = Node<NodeData, 'repo'>

type EdgeData = {
  label: string
  state: 'idle' | 'active' | 'dim'
  bypass: boolean
  delay: number
}
type WfEdge = Edge<EdgeData, 'flow'>

export default function WorkflowDiagram() {
  // Mirrors the tools grid breakpoint (md:grid-cols-2) so the stagger restarts on each row.
  const twoCols = useMediaQuery('(min-width: 768px)')
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading index="02" title="How the Suite Fits Together">
        Market regime and news analysis run in parallel upstream, and both feed TradingAgents-Funds. Its reports then
        flow through the runner into S3 and out to the browser.
      </SectionHeading>

      <RevealOnScroll>
        <div className="glass rounded-3xl p-3 sm:p-5">
          <p className="mb-2 flex items-center gap-2 px-3 pt-3 font-mono text-xs uppercase tracking-widest text-gold sm:px-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_#e7c47e]" aria-hidden="true" />
            Data flow
          </p>
          <WorkflowGraph />
        </div>
      </RevealOnScroll>

      <div className="mt-10">
        <p className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" aria-hidden="true" />
          Standalone tools
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {STANDALONE_TOOLS.map((tool, i) => (
            <RevealOnScroll key={tool.name} delay={(i % (twoCols ? 2 : 1)) * 100}>
              <RepoLink name={tool.name} href={tool.href} role={tool.role} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

function WorkflowGraph() {
  const wide = useMediaQuery('(min-width: 768px)')
  const [hovered, setHovered] = useState<string | null>(null)
  const onHover = useCallback((id: string | null) => setHovered(id), [])

  const { nodes, edges } = useMemo(() => {
    const touching = new Set<string>()
    if (hovered) {
      touching.add(hovered)
      for (const e of WORKFLOW_EDGES) {
        if (e.source === hovered) touching.add(e.target)
        if (e.target === hovered) touching.add(e.source)
      }
    }

    const nodes: WfNode[] = WORKFLOW_NODES.map((spec) => ({
      id: spec.id,
      type: 'repo',
      position: wide ? spec.wide : spec.narrow,
      width: NODE_WIDTH,
      data: { spec, dim: hovered !== null && !touching.has(spec.id), onHover },
      draggable: false,
      selectable: false,
      focusable: false,
    }))

    const edges: WfEdge[] = WORKFLOW_EDGES.map((e, i) => {
      const route = wide ? e.wide : e.narrow
      const active = hovered !== null && (e.source === hovered || e.target === hovered)
      return {
        id: e.id,
        type: 'flow',
        source: e.source,
        target: e.target,
        sourceHandle: `${route.from}-out`,
        targetHandle: `${route.to}-in`,
        markerEnd: { type: MarkerType.ArrowClosed, color: GOLD, width: 16, height: 16 },
        selectable: false,
        focusable: false,
        data: {
          label: e.label,
          state: hovered === null ? 'idle' : active ? 'active' : 'dim',
          bypass: !wide && !!e.narrow.bypass,
          delay: i * 0.45,
        },
      }
    })

    return { nodes, edges }
  }, [wide, hovered, onHover])

  return (
    <div
      className={wide ? 'h-[700px]' : 'h-[1300px]'}
      role="group"
      aria-label="Workflow diagram: Market Regime Detector and Investment News Analysis AI feed TradingAgents-Funds, which feeds the Runner and S3 Browser"
    >
      <ReactFlow
        key={wide ? 'wide' : 'narrow'}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        colorMode="dark"
        fitView
        fitViewOptions={wide ? FIT_WIDE : FIT_NARROW}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        minZoom={0.2}
        maxZoom={1.2}
        proOptions={{ hideAttribution: false }}
      >
        <Background color="rgba(255,255,255,0.09)" gap={26} size={1.2} />
        <FitOnResize options={wide ? FIT_WIDE : FIT_NARROW} />
      </ReactFlow>
    </div>
  )
}

/** React Flow only fits the view on mount, so refit whenever the container width changes. */
function FitOnResize({ options }: { options: FitViewOptions }) {
  const { fitView } = useReactFlow()
  const width = useStore((s) => s.width)
  useEffect(() => {
    fitView({ ...options, duration: 0 })
  }, [width, fitView, options])
  return null
}

/* ── Nodes ─────────────────────────────────────────────────── */

function WorkflowNode({ data }: NodeProps<WfNode>) {
  const { spec, dim, onHover } = data
  return (
    <div
      className={`transition-opacity duration-300 ${dim ? 'opacity-35' : 'opacity-100'}`}
      style={{ width: NODE_WIDTH }}
      onMouseEnter={() => onHover(spec.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(spec.id)}
      onBlur={() => onHover(null)}
    >
      {(['l', 'r', 't', 'b'] as const).map((side) => (
        <span key={side}>
          <Handle id={`${side}-in`} type="target" position={POSITION[side]} className="wf-handle" />
          <Handle id={`${side}-out`} type="source" position={POSITION[side]} className="wf-handle" />
        </span>
      ))}
      {spec.href ? (
        <RepoLink name={spec.name} href={spec.href} role={spec.role} tag={spec.tag} />
      ) : (
        <ExternalCard name={spec.name} role={spec.role} tag={spec.tag} />
      )}
    </div>
  )
}

function Tag({ children }: { children: string }) {
  return (
    <span className="mb-2 inline-block rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold">
      {children}
    </span>
  )
}

function RepoLink({ name, href, role, tag }: { name: string; href: string; role: string; tag?: string }) {
  const onPointerMove = useSpotlight<HTMLAnchorElement>()
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={onPointerMove}
      className="glass spotlight group block rounded-2xl p-4"
    >
      {tag && <Tag>{tag}</Tag>}
      <p className="flex items-center justify-between gap-2 text-sm font-semibold text-white transition-colors duration-200 group-hover:text-gold">
        {name}
        <svg
          viewBox="0 0 12 12"
          className="h-3 w-3 flex-shrink-0 -translate-x-1 text-gold opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 9l6-6M4 3h5v5" />
        </svg>
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{role}</p>
    </a>
  )
}

function ExternalCard({ name, role, tag }: { name: string; role: string; tag: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/25 bg-ink-900/90 p-4">
      <Tag>{tag}</Tag>
      <div className="flex items-start gap-3">
        <svg
          viewBox="0 0 20 20"
          className="mt-0.5 h-5 w-5 flex-shrink-0 text-mint"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <ellipse cx="10" cy="5" rx="6.5" ry="2.5" />
          <path d="M3.5 5v10c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5V5M3.5 10c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-slate-100">{name}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">{role}</p>
        </div>
      </div>
    </div>
  )
}

/* ── Edges ─────────────────────────────────────────────────── */

function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
}: EdgeProps<WfEdge>) {
  const geometry = { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }
  const [path, labelX, labelY] = data?.bypass
    ? getSmoothStepPath({ ...geometry, borderRadius: 18, offset: 38 })
    : getBezierPath(geometry)

  const state = data?.state ?? 'idle'
  const opacity = state === 'dim' ? 0.15 : state === 'active' ? 1 : 0.75

  return (
    <>
      <g style={{ opacity, transition: 'opacity 0.3s ease' }}>
        <BaseEdge
          id={id}
          path={path}
          markerEnd={markerEnd}
          className="wf-edge"
          style={{ stroke: GOLD, strokeWidth: state === 'active' ? 2.4 : 1.6 }}
        />
        <circle r="3.2" fill="#f3ddae" className="wf-edge-dot">
          <animateMotion dur="3.4s" begin={`${data?.delay ?? 0}s`} repeatCount="indefinite" path={path} />
        </circle>
      </g>
      {data?.label && !data.bypass && (
        <EdgeLabelRenderer>
          <span
            className="wf-edge-label pointer-events-none absolute whitespace-nowrap rounded-full border border-white/10 bg-ink-900/95 px-2.5 py-1 text-[11px] text-slate-300"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              opacity: state === 'dim' ? 0.3 : 1,
              borderColor: state === 'active' ? 'rgba(231,196,126,0.5)' : undefined,
              color: state === 'active' ? '#f3ddae' : undefined,
            }}
          >
            {data.label}
          </span>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

const nodeTypes = { repo: WorkflowNode }
const edgeTypes = { flow: FlowEdge }
