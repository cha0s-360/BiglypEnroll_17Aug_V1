'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import api, { formatApiErrorDetail } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Bell, Send, Clock, CalendarClock, AlertTriangle, Loader2 } from "lucide-react";

const BEFORE_CHOICES = [1, 2, 3, 5, 7, 10, 14];
const OVERDUE_CHOICES = [1, 3, 7, 15, 30];

export default function Reminders() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get("/school/reminder-settings").then(({ data }) => setSettings(data));
  }, []);

  if (!settings) {
    return <DashboardLayout title="Fee Reminders"><Box className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-brand-blue" /></Box></DashboardLayout>;
  }

  const toggleDay = (field, day) => {
    setSettings((s) => {
      const arr = s[field].includes(day) ? s[field].filter((d) => d !== day) : [...s[field], day];
      return { ...s, [field]: arr.sort((a, b) => a - b) };
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.post("/school/reminder-settings", settings);
      setSettings({ ...settings, ...data });
      toast.success("Reminder settings saved");
    } catch (e) {
      toast.error(formatApiErrorDetail(e?.response?.data?.detail));
    } finally { setSaving(false); }
  };

  const sendNow = async () => {
    setSending(true);
    try {
      const { data } = await api.post("/reminders/run", { force: true });
      toast.success(`${data.created} reminder${data.created === 1 ? "" : "s"} sent to parents`);
    } catch (e) {
      toast.error(formatApiErrorDetail(e?.response?.data?.detail));
    } finally { setSending(false); }
  };

  const disabled = !settings.enabled;

  return (
    <DashboardLayout title="Fee Reminders">
      <Box className="max-w-3xl space-y-6">
        {/* Master toggle */}
        <Box className="rounded-xl border border-border bg-white p-5 flex items-start justify-between gap-4">
          <Box className="flex items-start gap-3">
            <Box className={`h-10 w-10 rounded-lg flex items-center justify-center ${settings.enabled ? "bg-brand-blue text-white" : "bg-muted text-muted-foreground"}`}>
              <Bell className="h-5 w-5" />
            </Box>
            <Box>
              <Typography variant="inherit" component="p" className="font-semibold text-brand-navy">Automatic fee reminders</Typography>
              <Typography variant="inherit" component="p" className="text-xs text-muted-foreground mt-1 max-w-md">When on, parents automatically get in-app notifications (and queued emails) before due dates and for overdue fees, based on the rules below.</Typography>
            </Box>
          </Box>
          <Switch checked={settings.enabled} onCheckedChange={(v) => setSettings({ ...settings, enabled: v })} data-testid="reminders-enabled" />
        </Box>

        {/* Before due */}
        <Box className={`rounded-xl border border-border bg-white p-5 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
          <Box className="flex items-center gap-2 mb-1">
            <CalendarClock className="h-4 w-4 text-brand-blue" />
            <Typography variant="inherit" component="p" className="font-semibold text-brand-navy">Before the due date</Typography>
          </Box>
          <Typography variant="inherit" component="p" className="text-xs text-muted-foreground mb-3">Select how many days before the due date to nudge parents. Each selected day sends one reminder.</Typography>
          <Box className="flex flex-wrap gap-2" data-testid="before-days">
            {BEFORE_CHOICES.map((d) => {
              const on = settings.before_due_days.includes(d);
              return (
                <Box component="button" key={d} onClick={() => toggleDay("before_due_days", d)} data-testid={`before-${d}`}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${on ? "bg-brand-blue text-white border-brand-blue" : "bg-white text-slate-500 border-border hover:border-brand-blue/50"}`}>
                  {d} day{d > 1 ? "s" : ""}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* On due */}
        <Box className={`rounded-xl border border-border bg-white p-5 flex items-center justify-between ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
          <Box className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand-blue" />
            <Box>
              <Typography variant="inherit" component="p" className="font-semibold text-brand-navy">On the due date</Typography>
              <Typography variant="inherit" component="p" className="text-xs text-muted-foreground">Send a reminder on the exact day fees are due.</Typography>
            </Box>
          </Box>
          <Switch checked={settings.on_due} onCheckedChange={(v) => setSettings({ ...settings, on_due: v })} data-testid="on-due" />
        </Box>

        {/* Overdue */}
        <Box className={`rounded-xl border border-border bg-white p-5 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
          <Box className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <Typography variant="inherit" component="p" className="font-semibold text-brand-navy">After the due date (overdue)</Typography>
          </Box>
          <Typography variant="inherit" component="p" className="text-xs text-muted-foreground mb-3">Select how many days after the due date to follow up on unpaid fees.</Typography>
          <Box className="flex flex-wrap gap-2" data-testid="overdue-days">
            {OVERDUE_CHOICES.map((d) => {
              const on = settings.overdue_days.includes(d);
              return (
                <Box component="button" key={d} onClick={() => toggleDay("overdue_days", d)} data-testid={`overdue-${d}`}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${on ? "bg-amber-500 text-white border-amber-500" : "bg-white text-slate-500 border-border hover:border-amber-400"}`}>
                  {d} day{d > 1 ? "s" : ""}
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box className="flex items-center justify-between gap-3">
          <Button variant="outline" onClick={sendNow} disabled={sending || disabled} data-testid="send-now"
            className="rounded-lg border-brand-blue text-brand-blue hover:bg-brand-tint">
            {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Send reminders now
          </Button>
          <Button onClick={save} disabled={saving} data-testid="save-reminders" className="rounded-lg bg-brand-blue hover:bg-brand-navy">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} Save settings
          </Button>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
