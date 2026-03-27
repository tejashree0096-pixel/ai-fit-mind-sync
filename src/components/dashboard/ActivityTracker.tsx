import { useActivityTracker } from "@/hooks/useActivityTracker";
import { Button } from "@/components/ui/button";
import { Flame, Footprints, Droplets, Moon, Activity, Plus, Minus } from "lucide-react";

export const ActivityTracker = () => {
  const { activity, loading, incrementField, updateActivity } = useActivityTracker();

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-2xl animate-pulse">
        <div className="h-6 bg-secondary rounded w-40 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-secondary rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const metrics = [
    {
      icon: Footprints,
      label: "Steps",
      value: activity.steps,
      target: 10000,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      increment: 500,
      field: "steps" as const,
    },
    {
      icon: Flame,
      label: "Calories",
      value: activity.calories_burned,
      target: 500,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      increment: 50,
      field: "calories_burned" as const,
    },
    {
      icon: Droplets,
      label: "Water",
      value: activity.water_glasses,
      target: 8,
      unit: "glasses",
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      increment: 1,
      field: "water_glasses" as const,
    },
    {
      icon: Activity,
      label: "Active Min",
      value: activity.active_minutes,
      target: 60,
      unit: "min",
      color: "text-violet-400",
      bg: "bg-violet-400/10",
      increment: 10,
      field: "active_minutes" as const,
    },
  ];

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        Daily Activity
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m, i) => {
          const progress = Math.min((m.value / m.target) * 100, 100);
          return (
            <div key={i} className="glass-card p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${m.bg}`}>
                  <m.icon className={`w-4 h-4 ${m.color}`} />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateActivity(m.field, Math.max(0, m.value - m.increment))}
                    className="p-1 rounded-md hover:bg-secondary transition-colors"
                  >
                    <Minus className="w-3 h-3 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => incrementField(m.field, m.increment)}
                    className="p-1 rounded-md hover:bg-secondary transition-colors"
                  >
                    <Plus className="w-3 h-3 text-primary" />
                  </button>
                </div>
              </div>
              <div className="font-display font-bold text-xl tabular-nums">
                {m.value.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {m.label} • {m.target.toLocaleString()} {m.unit || ""}
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${m.color.replace("text-", "bg-")}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
