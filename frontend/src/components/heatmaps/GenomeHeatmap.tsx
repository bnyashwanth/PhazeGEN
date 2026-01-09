import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Props {
  gcContent?: number;      // overall GC %
  genomeLength?: number;   // bp
}

/**
 * Genome GC Heatmap
 * Simulates sliding GC windows for visualization
 */
const GenomeHeatmap: React.FC<Props> = ({
  gcContent = 0,
  genomeLength = 0,
}) => {
  const data = useMemo(() => {
    if (!genomeLength || !gcContent) return [];

    const WINDOW_COUNT = 30;
    const baseGc = gcContent;

    return Array.from({ length: WINDOW_COUNT }).map((_, i) => ({
      region: `W${i + 1}`,
      gc: Math.max(
        0,
        Math.min(
          100,
          baseGc + (Math.random() * 6 - 3) // ±3% variation
        )
      ),
    }));
  }, [gcContent, genomeLength]);

  if (!data.length) {
    return (
      <div className="empty-state">
        GC heatmap unavailable (insufficient genome data).
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 220 }}>
      <h4 style={{ marginBottom: "0.5rem" }}>
        Genome Heatmap (GC Content)
      </h4>

      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="region" hide />
<YAxis
  domain={[0, Math.max(20, gcContent + 10)]}
  tickFormatter={(v) => `${v}%`}
/>
<Tooltip
  formatter={(value) =>
    typeof value === 'number'
      ? `${value.toFixed(2)}% GC`
      : value
  }
/>
          <Bar
            dataKey="gc"
            fill="#2563eb"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenomeHeatmap;
