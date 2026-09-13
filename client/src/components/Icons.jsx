import React from "react";

export function Icon({ d, size = 18, color = "currentColor", strokeWidth = 2, className = "", style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
    >
      {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
    </svg>
  );
}

export const Icons = {
  Logo: (props) => (
    <svg width={props.size || 22} height={props.size || 22} viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#logoGrad)" />
      <path d="M7 8l-3 4 3 4M17 8l3 4-3 4M14 7l-4 10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  Code: (p) => <Icon d={["M16 18l6-6-6-6", "M8 6l-6 6 6 6"]} {...p} />,
  Sparkles: (p) => <Icon d={["M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1"]} {...p} />,
  Play: (p) => <Icon d="M5 3l14 9-14 9V3z" {...p} />,
  Bug: (p) => <Icon d={["M8 2v4m8-4v4", "M12 7c-4 0-7 3-7 7v6h14v-6c0-4-3-7-7-7z", "M2 13h3m14 0h3", "M4 19l3-2m10 2l3-2"]} {...p} />,
  Shield: (p) => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...p} />,
  Zap: (p) => <Icon d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" {...p} />,
  CheckCircle: (p) => <Icon d={["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M22 4L12 14.01l-3-3"]} {...p} />,
  AlertOctagon: (p) => <Icon d={["M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z", "M12 8v4", "M12 16h.01"]} {...p} />,
  AlertTriangle: (p) => <Icon d={["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4", "M12 17h.01"]} {...p} />,
  Info: (p) => <Icon d={["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 16v-4", "M12 8h.01"]} {...p} />,
  Check: (p) => <Icon d="M20 6L9 17l-5-5" {...p} />,
  Copy: (p) => <Icon d={["M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2", "M16 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-2"]} {...p} />,
  Trash: (p) => <Icon d={["M3 6h18", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]} {...p} />,
  Sun: (p) => <Icon d={["M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42", "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"]} {...p} />,
  Moon: (p) => <Icon d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" {...p} />,
  LogOut: (p) => <Icon d={["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"]} {...p} />,
  ArrowRight: (p) => <Icon d={["M5 12h14", "M12 5l7 7-7 7"]} {...p} />,
  FileText: (p) => <Icon d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"]} {...p} />,
  User: (p) => <Icon d={["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"]} {...p} />,
  History: (p) => <Icon d={["M12 8v4l3 3", "M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"]} {...p} />,
  Layers: (p) => <Icon d={["M12 2L2 7l10 5 10-5-10-5z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"]} {...p} />,
  Lock: (p) => <Icon d={["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"]} {...p} />,
  Terminal: (p) => <Icon d={["M4 17l6-6-6-6", "M12 19h8"]} {...p} />,
  Sliders: (p) => <Icon d={["M4 21v-7", "M4 10V3", "M12 21v-9", "M12 8V3", "M20 21v-5", "M20 12V3", "M1 14h6", "M9 8h6", "M17 16h6"]} {...p} />,
};
