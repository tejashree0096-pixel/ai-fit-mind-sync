import { useState } from "react";
import { useReminders } from "@/hooks/useReminders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bell, BellOff, Plus, Trash2, Clock, Dumbbell, Apple, Brain } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const typeIcons: Record<string, typeof Dumbbell> = {
  workout: Dumbbell,
  nutrition: Apple,
  wellness: Brain,
};

const typeColors: Record<string, string> = {
  workout: "text-cyan-400",
  nutrition: "text-orange-400",
  wellness: "text-violet-400",
};

export const ReminderManager = () => {
  const {
    reminders,
    loading,
    notificationPermission,
    requestPermission,
    addReminder,
    toggleReminder,
    deleteReminder,
  } = useReminders();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: "",
    message: "",
    reminder_type: "workout",
    reminder_time: "08:00",
    days_of_week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  });

  const handleAdd = async () => {
    if (!newReminder.title.trim()) return;
    await addReminder(newReminder);
    setDialogOpen(false);
    setNewReminder({
      title: "",
      message: "",
      reminder_type: "workout",
      reminder_time: "08:00",
      days_of_week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    });
  };

  const toggleDay = (day: string) => {
    setNewReminder(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(day)
        ? prev.days_of_week.filter(d => d !== day)
        : [...prev.days_of_week, day],
    }));
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Reminders
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setDialogOpen(true)} className="gap-1">
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>

      {notificationPermission !== "granted" && (
        <button
          onClick={requestPermission}
          className="w-full mb-4 p-3 rounded-xl bg-primary/10 text-primary text-sm font-medium flex items-center gap-2 hover:bg-primary/20 transition-colors"
        >
          <BellOff className="w-4 h-4" />
          Enable notifications for reminders
        </button>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map(i => <div key={i} className="h-16 bg-secondary rounded-xl animate-pulse" />)}
        </div>
      ) : reminders.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No reminders yet. Add one to stay on track!
        </p>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {reminders.map(r => {
            const Icon = typeIcons[r.reminder_type] || Bell;
            const color = typeColors[r.reminder_type] || "text-primary";
            return (
              <div key={r.id} className={`flex items-center gap-3 p-3 rounded-xl bg-secondary/50 ${!r.is_active ? "opacity-50" : ""}`}>
                <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{r.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {r.reminder_time.slice(0, 5)} • {r.days_of_week.join(", ")}
                  </div>
                </div>
                <Switch checked={r.is_active} onCheckedChange={v => toggleReminder(r.id, v)} />
                <button onClick={() => deleteReminder(r.id)} className="p-1 hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-card border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display">Add Reminder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input
                placeholder="Morning workout"
                value={newReminder.title}
                onChange={e => setNewReminder(p => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Message (optional)</label>
              <Input
                placeholder="Time to crush your workout! 💪"
                value={newReminder.message}
                onChange={e => setNewReminder(p => ({ ...p, message: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Type</label>
                <select
                  value={newReminder.reminder_type}
                  onChange={e => setNewReminder(p => ({ ...p, reminder_type: e.target.value }))}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="workout">Workout</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="wellness">Wellness</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Time</label>
                <Input
                  type="time"
                  value={newReminder.reminder_time}
                  onChange={e => setNewReminder(p => ({ ...p, reminder_time: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Days</label>
              <div className="flex gap-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                      newReminder.days_of_week.includes(day)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <Button variant="gradient" className="w-full" onClick={handleAdd}>
              Add Reminder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
