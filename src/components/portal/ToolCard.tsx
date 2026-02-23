"use client";

interface Feature {
  label: string;
}

interface ToolCardProps {
  href: string;
  external?: boolean;
  variant: "indigo" | "cyan";
  icon: React.ReactNode;
  name: string;
  tagline: string;
  description: string;
  features: Feature[];
  cta: string;
}

export function ToolCard({
  href,
  external = false,
  variant,
  icon,
  name,
  tagline,
  description,
  features,
  cta,
}: ToolCardProps) {
  const colors = {
    indigo: {
      glow: "rgba(99,102,241,0.18)",
      badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/20",
      btn: "from-indigo-500 to-purple-600 shadow-indigo-500/30",
      iconBg: "bg-indigo-500/20",
      iconColor: "text-indigo-400",
      border: "hover:border-indigo-500/40",
      glowHover: "group-hover:opacity-100",
    },
    cyan: {
      glow: "rgba(6,182,212,0.18)",
      badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",
      btn: "from-cyan-500 to-teal-500 shadow-cyan-500/30",
      iconBg: "bg-cyan-500/20",
      iconColor: "text-cyan-400",
      border: "hover:border-cyan-500/40",
      glowHover: "group-hover:opacity-100",
    },
  }[variant];

  const linkProps = external
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  return (
    <a
      {...linkProps}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-surface-border bg-surface p-8 backdrop-blur-xl transition-all duration-500 ${colors.border} hover:-translate-y-2`}
      style={{
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.05) inset, 0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at 50% 0%, ${colors.glow}, transparent 60%)`,
        }}
      />

      {/* Icon */}
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${colors.iconBg}`}
      >
        <span className={`${colors.iconColor}`}>{icon}</span>
      </div>

      {/* Name + tagline */}
      <h3 className="font-heading text-2xl font-bold text-white">{name}</h3>
      <p className="mt-1 text-sm font-medium text-gray-400">{tagline}</p>

      {/* Description */}
      <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-400">
        {description}
      </p>

      {/* Feature badges */}
      <div className="mt-6 flex flex-wrap gap-2">
        {features.map((f) => (
          <span
            key={f.label}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${colors.badge}`}
          >
            {f.label}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-6">
        <span
          className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 group-hover:shadow-xl ${colors.btn}`}
        >
          {cta}
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </span>
      </div>
    </a>
  );
}
