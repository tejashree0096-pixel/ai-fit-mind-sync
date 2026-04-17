import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Scale, Target, TrendingDown, TrendingUp, Minus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface WeightData {
  weight: number | null;
  goal_weight: number | null;
  starting_weight: number | null;
}

export const WeightTracker = ({ onUpdate }: { onUpdate?: (d: WeightData) => void }) => {
  const [data, setData] = useState<WeightData>({ weight: null, goal_weight: null, starting_weight: null });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ weight: "", goal_weight: "" });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setLoading(false);
      const { data: p } = await supabase
        .from("profiles")
        .select("weight, goal_weight")
        .eq("user_id", user.id)
        .maybeSingle();
      const next: WeightData = {
        weight: p?.weight ?? null,
        goal_weight: (p as any)?.goal_weight ?? null,
        starting_weight: p?.weight ?? null,
      };
      setData(next);
      setForm({
        weight: next.weight?.toString() ?? "",
        goal_weight: next.goal_weight?.toString() ?? "",
      });
      onUpdate?.(next);
      setLoading(false);
      if (!next.weight || !next.goal_weight) setEditing(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    const w = parseFloat(form.weight);
    const g = parseFloat(form.goal_weight);
    if (!w || !g || w <= 0 || g <= 0) {
      toast.error("Enter valid current and goal weight in kg");
      return;
    }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }
    const { error } = await supabase
      .from("profiles")
      .update({ weight: w, goal_weight: g } as any)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) { toast.error("Could not save weight"); return; }
    const next = { weight: w, goal_weight: g, starting_weight: data.starting_weight ?? w };
    setData(next);
    onUpdate?.(next);
    setEditing(false);
    toast.success("Weight goals updated");
  };

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-2xl flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (editing || !data.weight || !data.goal_weight) {
    return (
      <div className="glass-card-elevated p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
            <Scale className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg">Weight Goals</h3>
            <p className="text-xs text-muted-foreground">Set your current & target weight</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="space-y-1.5">
            <Label htmlFor="cw" className="text-xs">Current (kg)</Label>
            <Input
              id="cw" type="number" step="0.1" placeholder="70"
              value={form.weight}
              onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gw" className="text-xs">Goal (kg)</Label>
            <Input
              id="gw" type="number" step="0.1" placeholder="65"
              value={form.goal_weight}
              onChange={(e) => setForm((f) => ({ ...f, goal_weight: e.target.value }))}
              className="bg-secondary/50"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {data.weight && data.goal_weight && (
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          )}
          <Button variant="gradient" size="sm" className="flex-1" onClick={save} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>
    );
  }

  const diff = data.weight - data.goal_weight;
  const direction: "lose" | "gain" | "maintain" =
    Math.abs(diff) < 0.5 ? "maintain" : diff > 0 ? "lose" : "gain";
  const totalDelta = Math.abs(diff);
  const progressPct = direction === "maintain" ? 100 : Math.min(100, Math.max(0, 100 - (totalDelta / Math.max(data.weight, data.goal_weight)) * 100));

  const dirMeta = {
    lose: { icon: TrendingDown, label: "To lose", color: "from-orange-400 to-red-500" },
    gain: { icon: TrendingUp, label: "To gain", color: "from-cyan-400 to-blue-500" },
    maintain: { icon: Minus, label: "On target", color: "from-green-400 to-teal-500" },
  }[direction];
  const Icon = dirMeta.icon;

  return (
    <div className="glass-card-elevated p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
            <Scale className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg">Weight Tracker</h3>
            <p className="text-xs text-muted-foreground">Current vs goal</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-secondary/40 text-center">
          <div className="text-xs text-muted-foreground mb-1">Current</div>
          <div className="font-display font-bold text-2xl">{data.weight}<span className="text-xs text-muted-foreground ml-1">kg</span></div>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${dirMeta.color} text-white text-center`}>
          <div className="text-xs opacity-90 mb-1 flex items-center justify-center gap-1">
            <Icon className="w-3 h-3" />
            {dirMeta.label}
          </div>
          <div className="font-display font-bold text-2xl">
            {direction === "maintain" ? "✓" : `${totalDelta.toFixed(1)}`}
            {direction !== "maintain" && <span className="text-xs opacity-90 ml-1">kg</span>}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-secondary/40 text-center">
          <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
            <Target className="w-3 h-3" />
            Goal
          </div>
          <div className="font-display font-bold text-2xl">{data.goal_weight}<span className="text-xs text-muted-foreground ml-1">kg</span></div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Progress to goal</span>
          <span className="font-semibold text-primary">{progressPct.toFixed(0)}%</span>
        </div>
        <Progress value={progressPct} className="h-2" />
      </div>
    </div>
  );
};
