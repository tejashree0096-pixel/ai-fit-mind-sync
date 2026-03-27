import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ActivityData {
  steps: number;
  calories_burned: number;
  water_glasses: number;
  sleep_hours: number;
  active_minutes: number;
}

const defaultActivity: ActivityData = {
  steps: 0,
  calories_burned: 0,
  water_glasses: 0,
  sleep_hours: 0,
  active_minutes: 0,
};

export function useActivityTracker() {
  const [activity, setActivity] = useState<ActivityData>(defaultActivity);
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<Array<ActivityData & { log_date: string }>>([]);

  const fetchToday = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("log_date", today)
      .maybeSingle();

    if (data) {
      setActivity({
        steps: data.steps ?? 0,
        calories_burned: data.calories_burned ?? 0,
        water_glasses: data.water_glasses ?? 0,
        sleep_hours: Number(data.sleep_hours) || 0,
        active_minutes: data.active_minutes ?? 0,
      });
    }
    setLoading(false);
  }, []);

  const fetchWeekly = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("log_date", weekAgo.toISOString().split("T")[0])
      .order("log_date", { ascending: true });

    if (data) {
      setWeeklyData(data.map(d => ({
        log_date: d.log_date,
        steps: d.steps ?? 0,
        calories_burned: d.calories_burned ?? 0,
        water_glasses: d.water_glasses ?? 0,
        sleep_hours: Number(d.sleep_hours) || 0,
        active_minutes: d.active_minutes ?? 0,
      })));
    }
  }, []);

  useEffect(() => {
    fetchToday();
    fetchWeekly();
  }, [fetchToday, fetchWeekly]);

  const updateActivity = useCallback(async (field: keyof ActivityData, value: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const newActivity = { ...activity, [field]: value };

    const { error } = await supabase
      .from("activity_logs")
      .upsert({
        user_id: user.id,
        log_date: today,
        ...newActivity,
      }, { onConflict: "user_id,log_date" });

    if (error) {
      toast.error("Failed to update activity");
      console.error(error);
    } else {
      setActivity(newActivity);
    }
  }, [activity]);

  const incrementField = useCallback(async (field: keyof ActivityData, amount: number = 1) => {
    await updateActivity(field, activity[field] + amount);
  }, [activity, updateActivity]);

  return { activity, loading, weeklyData, updateActivity, incrementField, refresh: fetchToday };
}
