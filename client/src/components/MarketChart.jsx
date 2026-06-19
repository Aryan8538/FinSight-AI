import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { money } from "../lib/api.js";

export default function MarketChart({ data = [], height = 260 }) {
  const rising = data.length < 2 || data.at(-1)?.close >= data[0]?.close;
  const color = rising ? "#18b77b" : "#ee6b62";
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id={`chart-${rising}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dce8e3" />
          <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })} tick={{ fill: "#71817a", fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={28} />
          <YAxis domain={["auto", "auto"]} tickFormatter={(value) => `$${Math.round(value)}`} tick={{ fill: "#71817a", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} formatter={(value) => [money(value), "Close"]} contentStyle={{ border: "1px solid #d9e6e0", borderRadius: 12, boxShadow: "0 10px 30px rgba(6, 35, 27, .09)" }} />
          <Area type="monotone" dataKey="close" stroke={color} strokeWidth={2.5} fill={`url(#chart-${rising})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

