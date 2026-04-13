import { useCallback, useEffect, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";

const COLORS = {
  bg: "#050914",
  panel: "#161f33",
  border: "#2a3653",
  text: "#e7edf7",
  textDim: "#95a3bb",
  green: "#10b981",
  greenBg: "#08291e",
  yellow: "#f59e0b",
  yellowBg: "#3a2b0f",
  orange: "#f97316",
  orangeBg: "#3b1f10",
  red: "#ef4444",
  redBg: "#3b1115",
  blue: "#3b82f6",
  blueBg: "#0e1f42",
  cyan: "#06b6d4",
  white: "#ffffff"
} as const;

const LEGEND_ITEMS = [
  { label: "Economic pressure", color: COLORS.green },
  { label: "Gray-zone disruption", color: COLORS.yellow },
  { label: "Blockade / closure", color: COLORS.orange },
  { label: "Kinetic war", color: COLORS.red },
  { label: "Impact channel", color: COLORS.blue }
] as const;

const KEY_STATS = [
  { value: "90%+", label: "TSMC share of advanced chips" },
  { value: "$2.45T", label: "Annual trade through the strait" },
  { value: "48%", label: "Global container fleet using route" },
  { value: "95%", label: "Japan crude imports via strait" }
] as const;

type TreeNode = {
  id: string;
  label: string;
  sublabel: string;
  detail: string;
  color: string;
  bg: string;
  children?: TreeNode[];
  terminal?: boolean;
  effects?: string;
  impact?: string;
};

const treeData: TreeNode = {
  id: "root",
  label: "TAIWAN STRAIT",
  sublabel: "Effects Flow Chart",
  detail:
    "The documents point to four transmission channels whenever the Taiwan Strait destabilizes: advanced chips, shipping, energy, and market confidence. This chart starts with escalation scenarios and follows them into concrete downstream effects.",
  color: COLORS.cyan,
  bg: "#0a2a3b",
  children: [
    {
      id: "A",
      label: "A: ECONOMIC PRESSURE",
      sublabel: "No shooting / lower-severity base case",
      detail:
        "China applies pressure without direct military action through export controls, rare earth restrictions, and diplomatic coercion. It is the least destructive branch, but it still raises costs and speeds up decoupling.",
      color: COLORS.green,
      bg: COLORS.greenBg,
      children: [
        {
          id: "A1",
          label: "Input Controls",
          sublabel: "Rare earths + tech restrictions",
          detail:
            "China can squeeze key inputs and trade flows without crossing into visible warfare, forcing global manufacturers to pay more and hold more inventory.",
          color: COLORS.blue,
          bg: COLORS.blueBg,
          children: [
            {
              id: "A1a",
              label: "Industrial Cost Squeeze",
              sublabel: "Slow-burn supply shock",
              detail:
                "Semiconductor and hardware margins compress as inputs get more expensive and governments accelerate strategic stockpiles.",
              color: COLORS.green,
              bg: COLORS.greenBg,
              terminal: true,
              impact: "Semis -5% to -12%",
              effects:
                "Advanced-chip supply chains weaken first, while reshoring and rare-earth processing get a policy boost."
            }
          ]
        },
        {
          id: "A2",
          label: "Capital + Diplomatic Split",
          sublabel: "Decoupling without missiles",
          detail:
            "Even without a war, firms diversify manufacturing, widen supplier lists, and price in a structurally higher China/Taiwan risk premium.",
          color: COLORS.blue,
          bg: COLORS.blueBg,
          children: [
            {
              id: "A2a",
              label: "Reshoring + China Risk",
              sublabel: "Higher capex / lower trust",
              detail:
                "Taiwan stays open, but supply chains become more redundant and more expensive because boards and governments no longer trust a single chokepoint.",
              color: COLORS.green,
              bg: COLORS.greenBg,
              terminal: true,
              impact: "Higher costs, slower growth",
              effects:
                "The main effect is a wider geopolitical discount on China-exposed assets and a permanent increase in supply-chain spending."
            }
          ]
        },
        {
          id: "A3",
          label: "Strategic Reinvestment",
          sublabel: "Alternative fabs repriced",
          detail:
            "The documents repeatedly stress that there is still no real short-term Plan B for TSMC scale, so even mild pressure redirects capital into resilience projects.",
          color: COLORS.blue,
          bg: COLORS.blueBg,
          children: [
            {
              id: "A3a",
              label: "Resilience Buildout",
              sublabel: "Capacity spending accelerates",
              detail:
                "US, Japanese, and European foundry projects gain urgency, but new capacity still takes years to matter at leading-edge nodes.",
              color: COLORS.green,
              bg: COLORS.greenBg,
              terminal: true,
              impact: "Long build cycle",
              effects:
                "The system spends more to become safer, but near-term dependence on Taiwan remains largely intact."
            }
          ]
        }
      ]
    },
    {
      id: "B",
      label: "B: GRAY-ZONE DISRUPTION",
      sublabel: "Highest-probability military path",
      detail:
        "The source material treats quarantine, cyber operations, and outlying-island probes as the most plausible first military-adjacent moves because they test resolve without immediately forcing a full war.",
      color: COLORS.yellow,
      bg: COLORS.yellowBg,
      children: [
        {
          id: "B1",
          label: "Shipping Friction",
          sublabel: "Quarantine / inspections",
          detail:
            "Coast guard inspections and commercial pressure raise insurance costs, slow port throughput, and degrade Taiwan trade without an overt naval battle.",
          color: COLORS.blue,
          bg: COLORS.blueBg,
          children: [
            {
              id: "B1a",
              label: "Insurance + Delay Shock",
              sublabel: "Commercial routes slow fast",
              detail:
                "Taiwan output may still exist, but shipping friction alone is enough to disrupt just-in-time electronics and industrial deliveries within days to weeks.",
              color: COLORS.yellow,
              bg: COLORS.yellowBg,
              terminal: true,
              impact: "Semis -10% to -20%",
              effects:
                "Freight slows, insurance spikes, and the market starts pricing a broader blockade before one has formally happened."
            }
          ]
        },
        {
          id: "B2",
          label: "Cyber / Power Outage",
          sublabel: "Grid, ports, finance",
          detail:
            "A sustained cyber campaign can halt power, logistics, and finance without missiles. The docs treat this as especially dangerous because attribution can lag the damage.",
          color: COLORS.blue,
          bg: COLORS.blueBg,
          children: [
            {
              id: "B2a",
              label: "TSMC Wafer Loss",
              sublabel: "Brief outages, long recovery",
              detail:
                "Even short disruptions can destroy wafer batches and keep advanced fabs below normal output for weeks.",
              color: COLORS.orange,
              bg: COLORS.orangeBg,
              terminal: true,
              impact: "Semis -15% to -25%",
              effects:
                "Chip supply drops immediately while cybersecurity demand and digital defense spending jump globally."
            }
          ]
        },
        {
          id: "B3",
          label: "Outlying Island Probe",
          sublabel: "Kinmen / Matsu test",
          detail:
            "A limited island grab is less about territory than about reading allied resolve and normalizing a larger escalation ladder later.",
          color: COLORS.blue,
          bg: COLORS.blueBg,
          children: [
            {
              id: "B3a",
              label: "Stress Signal",
              sublabel: "Markets fall, odds worsen",
              detail:
                "The first drawdown may partially recover, but the deeper consequence is a higher probability of blockade and closure branches afterwards.",
              color: COLORS.yellow,
              bg: COLORS.yellowBg,
              terminal: true,
              impact: "Markets -8% to -15%",
              effects:
                "This branch acts like a warning flare: limited immediate damage, much larger medium-term risk."
            }
          ]
        }
      ]
    },
    {
      id: "C",
      label: "C: SELECTIVE BLOCKADE",
      sublabel: "Taiwan ports targeted / high severity",
      detail:
        "China blocks Taiwan-facing shipping while trying to keep the wider strait nominally open. This isolates Taiwan first and then spreads disruption through chips, freight, and alliance commitments.",
      color: COLORS.orange,
      bg: COLORS.orangeBg,
      children: [
        {
          id: "C1",
          label: "Taiwan Port Closure",
          sublabel: "Keelung, Kaohsiung, Taichung",
          detail:
            "The fabs may still physically exist, but exports stall because vessels and insurers will not reliably service a blockaded island.",
          color: COLORS.blue,
          bg: COLORS.blueBg,
          children: [
            {
              id: "C1a",
              label: "Chip Export Stall",
              sublabel: "Production exists, delivery fails",
              detail:
                "Just-in-time electronics supply breaks faster than most downstream buyers can adjust because there is no spare advanced-node capacity elsewhere.",
              color: COLORS.orange,
              bg: COLORS.orangeBg,
              terminal: true,
              impact: "Semis -15% to -35%",
              effects:
                "The first-order effect is a direct electronics shortage; the second-order effect is panic inventory building across tech and industry."
            }
          ]
        },
        {
          id: "C2",
          label: "Japan / Korea Rerouting",
          sublabel: "Longer routes + energy strain",
          detail:
            "Japan and South Korea reroute shipping east of Taiwan, adding time, fuel, insurance, and strategic exposure to every cargo movement.",
          color: COLORS.blue,
          bg: COLORS.blueBg,
          children: [
            {
              id: "C2a",
              label: "Freight + Energy Spike",
              sublabel: "Northeast Asia cost shock",
              detail:
                "Manufacturing costs rise across the region as trade routes lengthen and energy deliveries become harder to secure.",
              color: COLORS.orange,
              bg: COLORS.orangeBg,
              terminal: true,
              impact: "Oil +$15 to $25/bbl",
              effects:
                "Industrial margins tighten first in Japan and South Korea, then bleed outward through autos, electronics, and shipping."
            }
          ]
        },
        {
          id: "C3",
          label: "Alliance Repricing",
          sublabel: "Sanctions, defense, safe havens",
          detail:
            "Even without immediate great-power combat, investors reprice defense spending, sanctions risk, and safe-haven demand across global markets.",
          color: COLORS.blue,
          bg: COLORS.blueBg,
          children: [
            {
              id: "C3a",
              label: "Risk Asset Selloff",
              sublabel: "Confidence breaks before war",
              detail:
                "Tech and cyclicals sell off while defense, oil, and gold strengthen as markets begin to treat the strait as an active geopolitical fracture line.",
              color: COLORS.orange,
              bg: COLORS.orangeBg,
              terminal: true,
              impact: "Defense up / gold up",
              effects:
                "The system shifts from growth pricing to resilience pricing, with capital moving toward safety, energy, and state capacity."
            }
          ]
        }
      ]
    },
    {
      id: "D",
      label: "D: FULL STRAIT CLOSURE",
      sublabel: "21%+ maritime trade at risk",
      detail:
        "At full closure, the Taiwan issue stops being regional and becomes a global systems shock. The documents treat this as a near-bridge into a wider military crisis.",
      color: COLORS.red,
      bg: COLORS.redBg,
      children: [
        {
          id: "D1",
          label: "Shipping Chokepoint",
          sublabel: "$2.45T annual trade exposed",
          detail:
            "The Taiwan Strait acts like an arterial route for global container flows, so a total closure freezes throughput far beyond Taiwan itself.",
          color: COLORS.blue,
          bg: COLORS.blueBg,
          children: [
            {
              id: "D1a",
              label: "Container System Seizes",
              sublabel: "Fleet reroutes or stops",
              detail:
                "Factory schedules slip, inventories gap out, and global freight costs jump because a major share of shipping can no longer move on its normal timetable.",
              color: COLORS.red,
              bg: COLORS.redBg,
              terminal: true,
              impact: "48% fleet disrupted",
              effects:
                "What starts as a shipping problem quickly becomes a production problem for electronics, machinery, retail, and raw materials."
            }
          ]
        },
        {
          id: "D2",
          label: "Energy Shock",
          sublabel: "Japan 95% crude / Korea 30% imports",
          detail:
            "Japan and South Korea face an energy-security problem, not just a shipping inconvenience, while Middle East-to-Asia routes become slower and more exposed.",
          color: COLORS.blue,
          bg: COLORS.blueBg,
          children: [
            {
              id: "D2a",
              label: "Oil Spike + Industrial Stress",
              sublabel: "Energy becomes the next constraint",
              detail:
                "Oil and LNG costs rise sharply, recession pressure builds, and Asia manufacturing margins compress under fuel, freight, and uncertainty at the same time.",
              color: COLORS.red,
              bg: COLORS.redBg,
              terminal: true,
              impact: "Oil $130 to $180",
              effects:
                "This branch transmits into airlines, heavy industry, shipping, chemicals, and household inflation almost immediately."
            }
          ]
        },
        {
          id: "D3",
          label: "China Self-Harm + Contagion",
          sublabel: "China's own coastal trade hit",
          detail:
            "More than half of strait voyages are China's own coastal trade, so closure is also a major self-inflicted wound on Chinese manufacturing and logistics.",
          color: COLORS.blue,
          bg: COLORS.blueBg,
          children: [
            {
              id: "D3a",
              label: "Regional Recession Risk",
              sublabel: "Simultaneous Asia-wide pain",
              detail:
                "China, Taiwan, Japan, and South Korea all take hits at once, which means the wider world loses multiple production hubs together.",
              color: COLORS.red,
              bg: COLORS.redBg,
              terminal: true,
              impact: "Asia growth shock",
              effects:
                "The macro effect is synchronized regional weakness rather than a contained bilateral dispute."
            }
          ]
        }
      ]
    },
    {
      id: "E",
      label: "E: KINETIC WAR",
      sublabel: "Missile campaign or invasion / systemic crisis",
      detail:
        "Once sustained combat begins, the key question becomes whether fabs are merely offline or physically destroyed. That distinction changes the duration and scale of the global shock.",
      color: COLORS.red,
      bg: COLORS.redBg,
      children: [
        {
          id: "E1",
          label: "War-Zone Shutdown",
          sublabel: "Fabs intact but offline",
          detail:
            "Even if fabrication plants survive structurally, no commercial ecosystem functions normally inside an active missile and naval battlespace.",
          color: COLORS.blue,
          bg: COLORS.blueBg,
          children: [
            {
              id: "E1a",
              label: "Advanced Chips Vanish",
              sublabel: "Output collapses anyway",
              detail:
                "Technology production stalls, emergency inventory hoarding begins, and alternate fabs are nowhere near enough to absorb the shock.",
              color: COLORS.red,
              bg: COLORS.redBg,
              terminal: true,
              impact: "Semis -35% to -50%",
              effects:
                "Consumer tech, data centers, autos, and industrial electronics all start competing for a suddenly much smaller chip supply."
            }
          ]
        },
        {
          id: "E2",
          label: "Fabs Destroyed",
          sublabel: "Multi-year capacity loss",
          detail:
            "Destroying leading-edge TSMC capacity removes the core supply source for global advanced chips and takes years rather than months to rebuild.",
          color: COLORS.blue,
          bg: COLORS.blueBg,
          children: [
            {
              id: "E2a",
              label: "Permanent Supply Gap",
              sublabel: "The worst semiconductor branch",
              detail:
                "The shock spills into consumer electronics, cloud infrastructure, autos, industrials, and national-security planning all at once.",
              color: COLORS.red,
              bg: COLORS.redBg,
              terminal: true,
              impact: "Semis -50% to -70%",
              effects:
                "This is the branch where the world is forced to live with a multi-year advanced-chip shortage and much lower growth."
            }
          ]
        },
        {
          id: "E3",
          label: "Full Invasion",
          sublabel: "Occupation attempt + allied response",
          detail:
            "A true amphibious invasion is the maximum branch: blockade, air war, beach landings, likely US/Japan intervention, and non-trivial nuclear risk.",
          color: COLORS.blue,
          bg: COLORS.blueBg,
          children: [
            {
              id: "E3a",
              label: "Systemic Crisis",
              sublabel: "From market event to emergency",
              detail:
                "Markets gap lower globally, safe havens surge, and policy shifts from pricing risk to managing an outright economic emergency.",
              color: COLORS.red,
              bg: COLORS.redBg,
              terminal: true,
              impact: "Global GDP -5% to -10%",
              effects:
                "The effects stop being sector-specific and become macroeconomic: recession, capital controls risk, rationing, and prolonged instability."
            }
          ]
        }
      ]
    }
  ]
};

type PositionedNode = {
  x: number;
  y: number;
  node: TreeNode;
};

function computeLayout(
  node: TreeNode,
  x = 0,
  y = 0,
  level = 0,
  positions: Record<string, PositionedNode> = {},
  parentPositions: Record<string, string> = {}
) {
  const hGap = level === 0 ? 230 : level === 1 ? 215 : 195;
  const vGap = level < 2 ? 138 : 118;

  positions[node.id] = { x, y, node };

  if (node.children) {
    const totalWidth = (node.children.length - 1) * hGap;
    const startX = x - totalWidth / 2;

    node.children.forEach((child, index) => {
      const childX = startX + index * hGap;
      const childY = y + vGap;
      parentPositions[child.id] = node.id;
      computeLayout(child, childX, childY, level + 1, positions, parentPositions);
    });
  }

  return { positions, parentPositions };
}

const { positions, parentPositions } = computeLayout(treeData);
const positionArray = Object.values(positions);
const minX = Math.min(...positionArray.map((entry) => entry.x)) - 120;
const maxX = Math.max(...positionArray.map((entry) => entry.x)) + 120;
const minY = Math.min(...positionArray.map((entry) => entry.y)) - 40;
const maxY = Math.max(...positionArray.map((entry) => entry.y)) + 100;
const centerX = (minX + maxX) / 2;

type NodeCardProps = {
  node: TreeNode;
  isSelected: boolean;
  onClick: (id: string) => void;
  style: CSSProperties;
};

function NodeCard({ node, isSelected, onClick, style }: NodeCardProps) {
  const isTerminal = Boolean(node.terminal);
  const borderColor = node.color;

  return (
    <div
      data-node="true"
      onClick={() => onClick(node.id)}
      style={{
        position: "absolute",
        ...style,
        background: isSelected ? node.bg : COLORS.panel,
        border: `2px solid ${isSelected ? borderColor : COLORS.border}`,
        borderRadius: 14,
        padding: "12px 14px",
        cursor: "pointer",
        transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",
        boxShadow: isSelected ? `0 0 22px ${borderColor}3d` : "0 8px 18px rgba(0, 0, 0, 0.28)",
        zIndex: isSelected ? 10 : 1,
        minWidth: 154,
        maxWidth: 194
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: borderColor,
          letterSpacing: "0.08em",
          marginBottom: 3
        }}
      >
        {node.label}
      </div>
      <div style={{ fontSize: 10, color: COLORS.textDim, marginBottom: isTerminal ? 6 : 0 }}>{node.sublabel}</div>
      {isTerminal ? (
        <div
          style={{
            fontSize: 9,
            color: COLORS.text,
            background: `${borderColor}20`,
            borderRadius: 6,
            padding: "4px 6px",
            marginTop: 4,
            lineHeight: 1.3,
            borderLeft: `2px solid ${borderColor}`
          }}
        >
          {node.impact ? <span style={{ fontWeight: 700 }}>{node.impact}</span> : null}
        </div>
      ) : null}
    </div>
  );
}

type DetailPanelProps = {
  node: TreeNode | null;
  onClose: () => void;
};

function DetailPanel({ node, onClose }: DetailPanelProps) {
  if (!node) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(10, 16, 30, 0.96)",
        borderTop: `2px solid ${node.color}`,
        padding: "16px 20px 18px",
        zIndex: 100,
        maxHeight: "45vh",
        overflowY: "auto",
        boxShadow: "0 -12px 40px rgba(0, 0, 0, 0.46)",
        backdropFilter: "blur(18px)"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          marginBottom: 8
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: node.color }}>{node.label}</div>
          <div style={{ fontSize: 12, color: COLORS.textDim }}>{node.sublabel}</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: COLORS.textDim,
            fontSize: 22,
            cursor: "pointer",
            padding: "0 4px"
          }}
          aria-label="Close node details"
        >
          x
        </button>
      </div>
      <p style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.55, margin: "8px 0" }}>{node.detail}</p>
      {node.terminal && node.effects ? (
        <div
          style={{
            background: `${node.color}15`,
            border: `1px solid ${node.color}40`,
            borderRadius: 10,
            padding: "10px 12px",
            marginTop: 8
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: node.color, marginBottom: 4, letterSpacing: "0.08em" }}>
            EFFECTS
          </div>
          <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.45 }}>{node.effects}</div>
        </div>
      ) : null}
    </div>
  );
}

type PointerLikeEvent =
  | ReactMouseEvent<HTMLDivElement>
  | ReactTouchEvent<HTMLDivElement>
  | globalThis.MouseEvent
  | globalThis.TouchEvent;

function getClientPos(event: PointerLikeEvent) {
  if ("touches" in event && event.touches.length > 0) {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }

  if ("changedTouches" in event && event.changedTouches.length > 0) {
    return { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
  }

  if ("clientX" in event && "clientY" in event) {
    return { x: event.clientX, y: event.clientY };
  }

  return { x: 0, y: 0 };
}

function getInitialPan(zoom: number) {
  return { x: -centerX * zoom + window.innerWidth / 2, y: 18 };
}

const CHART_TOP = 174;

export default function App() {
  const [selected, setSelected] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.56);
  const [pan, setPan] = useState(() => getInitialPan(0.56));
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      setPan((currentPan) => {
        const centered = getInitialPan(zoom);
        if (Math.abs(currentPan.x - centered.x) < 8 && Math.abs(currentPan.y - centered.y) < 8) {
          return centered;
        }

        return currentPan;
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [zoom]);

  const handleStart = (event: ReactMouseEvent<HTMLDivElement> | ReactTouchEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement | null)?.closest("[data-node='true']")) {
      return;
    }

    const nextPosition = getClientPos(event);
    setDragging(true);
    setDragStart(nextPosition);
    setPanStart(pan);
  };

  const handleMove = useCallback(
    (event: globalThis.MouseEvent | globalThis.TouchEvent) => {
      if (!dragging) {
        return;
      }

      if ("touches" in event) {
        event.preventDefault();
      }

      const nextPosition = getClientPos(event);
      setPan({
        x: panStart.x + (nextPosition.x - dragStart.x),
        y: panStart.y + (nextPosition.y - dragStart.y)
      });
    },
    [dragging, dragStart, panStart]
  );

  useEffect(() => {
    const handleEnd = () => setDragging(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [handleMove]);

  const selectedNode = selected ? positions[selected]?.node ?? null : null;

  const edges = Object.entries(parentPositions)
    .map(([childId, parentId]) => {
      const parent = positions[parentId];
      const child = positions[childId];

      if (!parent || !child) {
        return null;
      }

      return { from: parent, to: child, childNode: child.node };
    })
    .filter((edge): edge is { from: PositionedNode; to: PositionedNode; childNode: TreeNode } => edge !== null);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background:
          "radial-gradient(circle at top, rgba(14, 31, 66, 0.55), transparent 32%), linear-gradient(180deg, #07111f 0%, #040812 100%)",
        overflow: "hidden",
        color: COLORS.text,
        position: "relative",
        touchAction: "none",
        userSelect: "none"
      }}
    >
      <div className="grain-overlay" />

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          background: "rgba(5, 9, 20, 0.84)",
          backdropFilter: "blur(14px)",
          borderBottom: `1px solid ${COLORS.border}`,
          padding: "12px 16px",
          zIndex: 50,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.white, letterSpacing: "0.08em" }}>
            TAIWAN STRAIT - EFFECTS FLOW CHART
          </div>
          <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 2 }}>
            Scenario -&gt; impact channel -&gt; downstream effect
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            onClick={() => setZoom((currentZoom) => Math.min(currentZoom + 0.1, 1.2))}
            className="control-button"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setZoom((currentZoom) => Math.max(currentZoom - 0.1, 0.24))}
            className="control-button"
            aria-label="Zoom out"
          >
            -
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(0.56);
              setPan(getInitialPan(0.56));
            }}
            className="control-button reset-button"
          >
            Reset
          </button>
        </div>
      </header>

      <div
        style={{
          position: "fixed",
          top: 60,
          left: 8,
          right: 8,
          zIndex: 50
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 8,
            maxWidth: 980,
            margin: "0 auto 8px"
          }}
        >
          {KEY_STATS.map((item) => (
            <div
              key={item.label}
              style={{
                background: "rgba(14, 31, 66, 0.45)",
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: "8px 10px",
                backdropFilter: "blur(8px)"
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.white }}>{item.value}</div>
              <div style={{ fontSize: 10, color: COLORS.textDim, lineHeight: 1.35 }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            justifyContent: "center",
            padding: "2px 0"
          }}
        >
          {LEGEND_ITEMS.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: `${item.color}15`,
                border: `1px solid ${item.color}40`,
                borderRadius: 999,
                padding: "3px 10px"
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: item.color, letterSpacing: "0.05em" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        style={{
          position: "absolute",
          inset: 0,
          cursor: dragging ? "grabbing" : "grab"
        }}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            position: "absolute",
            top: CHART_TOP,
            left: 0
          }}
        >
          <svg
            style={{
              position: "absolute",
              top: minY - 50,
              left: minX - 150,
              width: maxX - minX + 300,
              height: maxY - minY + 200,
              pointerEvents: "none"
            }}
          >
            {edges.map((edge, index) => {
              const x1 = edge.from.x - minX + 150 + 82;
              const y1 = edge.from.y - minY + 50 + 62;
              const x2 = edge.to.x - minX + 150 + 82;
              const y2 = edge.to.y - minY + 50;
              const midY = (y1 + y2) / 2;
              const edgeColor = edge.childNode.color;

              return (
                <path
                  key={`${edge.from.node.id}-${edge.to.node.id}-${index}`}
                  d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                  stroke={selected === edge.childNode.id ? edgeColor : `${edgeColor}58`}
                  strokeWidth={selected === edge.childNode.id ? 2.8 : 1.6}
                  fill="none"
                />
              );
            })}
          </svg>

          {Object.entries(positions).map(([id, position]) => (
            <NodeCard
              key={id}
              node={position.node}
              isSelected={selected === id}
              onClick={(nodeId) => setSelected((current) => (current === nodeId ? null : nodeId))}
              style={{
                left: position.x,
                top: position.y,
                transform: "translate(-50%, 0)"
              }}
            />
          ))}
        </div>
      </div>

      <DetailPanel node={selectedNode} onClose={() => setSelected(null)} />
    </div>
  );
}
