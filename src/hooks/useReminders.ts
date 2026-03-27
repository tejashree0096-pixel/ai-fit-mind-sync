import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Reminder {
  id: string;
  title: string;
  message: string | null;
  reminder_type: string;
  reminder_time: string;
  days_of_week: string[];
  is_active: boolean;
}

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchReminders = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", user.id)
      .order("reminder_time");

    if (data) setReminders(data as Reminder[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReminders();
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, [fetchReminders]);

  const requestPermission = useCallback(async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === "granted") {
        toast.success("Notifications enabled!");
      }
      return perm;
    }
    return "denied" as NotificationPermission;
  }, []);

  const addReminder = useCallback(async (reminder: Omit<Reminder, "id" | "is_active">) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("reminders").insert({
      user_id: user.id,
      ...reminder,
      is_active: true,
    });

    if (error) {
      toast.error("Failed to add reminder");
    } else {
      toast.success("Reminder added!");
      fetchReminders();
    }
  }, [fetchReminders]);

  const toggleReminder = useCallback(async (id: string, is_active: boolean) => {
    const { error } = await supabase
      .from("reminders")
      .update({ is_active })
      .eq("id", id);

    if (!error) {
      setReminders(prev => prev.map(r => r.id === id ? { ...r, is_active } : r));
    }
  }, []);

  const deleteReminder = useCallback(async (id: string) => {
    const { error } = await supabase.from("reminders").delete().eq("id", id);
    if (!error) {
      setReminders(prev => prev.filter(r => r.id !== id));
      toast.success("Reminder deleted");
    }
  }, []);

  // Check reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      if (notificationPermission !== "granted") return;

      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const today = dayNames[now.getDay()];

      reminders.forEach(r => {
        if (!r.is_active) return;
        const reminderHHMM = r.reminder_time.slice(0, 5);
        if (reminderHHMM === currentTime && r.days_of_week.includes(today)) {
          new Notification(r.title, {
            body: r.message || "Time for your fitness routine! 💪",
            icon: "/placeholder.svg",
          });
        }
      });
    };

    timerRef.current = setInterval(checkReminders, 60000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [reminders, notificationPermission]);

  return {
    reminders,
    loading,
    notificationPermission,
    requestPermission,
    addReminder,
    toggleReminder,
    deleteReminder,
    refresh: fetchReminders,
  };
}
