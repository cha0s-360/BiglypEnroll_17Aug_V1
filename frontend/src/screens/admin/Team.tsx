'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, UserCog, Pencil, Trash2, Mail } from "lucide-react";

const ROLE_OPTS = [
  { v: "manager", l: "Manager" },
  { v: "finance", l: "Finance" },
  { v: "counsellor", l: "Counsellor" },
  { v: "admission", l: "Admission" },
  { v: "legal", l: "Legal" },
  { v: "school_admin", l: "School Admin" },
];
const ROLE_LABEL = Object.fromEntries(ROLE_OPTS.map((r) => [r.v, r.l]));
const ROLE_COLOR = {
  school_admin: "bg-brand-navy text-white",
  manager: "bg-brand-blue text-white",
  finance: "bg-emerald-100 text-emerald-700",
  counsellor: "bg-violet-100 text-violet-700",
  admission: "bg-amber-100 text-amber-700",
  legal: "bg-slate-200 text-slate-700",
};

const EMPTY = { name: "", email: "", role: "counsellor", password: "biglyp123", campus: "" };

export default function Team() {
  const [team, setTeam] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // member being edited
  const [form, setForm] = useState(EMPTY);
  const [toDelete, setToDelete] = useState(null);

  const load = () => api.get("/school/team").then(({ data }) => setTeam(data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (m) => {
    setEditing(m);
    setForm({ name: m.name, email: m.email, role: m.role, password: "", campus: m.campus || "" });
    setOpen(true);
  };

  const save = async () => {
    if (!editing && (!form.name || !form.email)) return toast.error("Name and email are required");
    try {
      if (editing) {
        await api.put(`/school/team/${editing.id}`, { name: form.name, role: form.role, campus: form.campus });
        toast.success("Team member updated");
      } else {
        await api.post("/school/team", form);
        toast.success("Team member added");
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not save member");
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/school/team/${toDelete.id}`);
      toast.success("Team member removed");
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not remove member");
    }
  };

  return (
    <DashboardLayout title="Team">
      <Box className="flex items-center justify-between mb-5">
        <Typography variant="inherit" component="p" className="text-sm text-muted-foreground">{team.length} team members · roles: Manager, Finance, Counsellor, Admission, Legal</Typography>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd} className="rounded-sm bg-brand-blue hover:bg-brand-navy" data-testid="add-member-btn">
              <Plus className="h-4 w-4 mr-2" /> Add member
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-sm">
            <DialogHeader>
              <DialogTitle className="font-head flex items-center gap-2">
                <UserCog className="h-5 w-5" /> {editing ? "Edit team member" : "Add team member"}
              </DialogTitle>
            </DialogHeader>
            <Box className="space-y-4 py-2">
              <Box>
                <Label>Full name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-sm mt-1.5" data-testid="member-name" />
              </Box>
              <Box>
                <Label>Email {editing && <Box component="span" className="text-xs text-muted-foreground">(cannot be changed)</Box>}</Label>
                <Input type="email" value={form.email} disabled={!!editing}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-sm mt-1.5" data-testid="member-email" />
              </Box>
              <Box className="grid grid-cols-2 gap-3">
                <Box>
                  <Label>Role</Label>
                  <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                    <SelectTrigger className="rounded-sm mt-1.5" data-testid="member-role"><SelectValue /></SelectTrigger>
                    <SelectContent>{ROLE_OPTS.map((r) => <SelectItem key={r.v} value={r.v}>{r.l}</SelectItem>)}</SelectContent>
                  </Select>
                </Box>
                <Box>
                  <Label>Campus</Label>
                  <Input value={form.campus} onChange={(e) => setForm({ ...form, campus: e.target.value })} className="rounded-sm mt-1.5" placeholder="Main Campus" data-testid="member-campus" />
                </Box>
              </Box>
              {!editing && (
                <Box>
                  <Label>Temporary password</Label>
                  <Input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="rounded-sm mt-1.5" data-testid="member-password" />
                  <Typography variant="inherit" component="p" className="text-xs text-muted-foreground mt-1">Share this with the member so they can sign in and change it.</Typography>
                </Box>
              )}
            </Box>
            <DialogFooter>
              <Button onClick={save} className="rounded-sm bg-brand-blue hover:bg-brand-navy" data-testid="save-member-btn">
                {editing ? "Save changes" : "Add member"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Box>

      <Box className="bg-white border border-border rounded-sm overflow-hidden">
        <Box component="table" className="w-full text-sm">
          <Box component="thead">
            <Box component="tr" className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
              <Box component="th" className="p-4 font-medium">Member</Box>
              <Box component="th" className="p-4 font-medium">Role</Box>
              <Box component="th" className="p-4 font-medium">Campus</Box>
              <Box component="th" className="p-4"></Box>
            </Box>
          </Box>
          <Box component="tbody">
            {team.map((m) => (
              <Box component="tr" key={m.id} className="border-b border-border last:border-0 hover:bg-muted/30" data-testid={`member-${m.id}`}>
                <Box component="td" className="p-4">
                  <Box className="flex items-center gap-3">
                    <Box className="h-9 w-9 rounded-sm bg-brand-tint text-brand-navy flex items-center justify-center text-xs font-bold">
                      {m.name?.[0] || "?"}
                    </Box>
                    <Box>
                      <Typography variant="inherit" component="p" className="font-medium text-brand-navy flex items-center gap-2">
                        {m.name}
                        {m.is_self && <Box component="span" className="text-[10px] text-brand-blue font-semibold">(You)</Box>}
                      </Typography>
                      <Typography variant="inherit" component="p" className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" /> {m.email}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box component="td" className="p-4">
                  <Badge className={`rounded-sm hover:opacity-100 ${ROLE_COLOR[m.role] || "bg-muted"}`}>{ROLE_LABEL[m.role] || m.role}</Badge>
                </Box>
                <Box component="td" className="p-4 text-muted-foreground">{m.campus || "—"}</Box>
                <Box component="td" className="p-4">
                  <Box className="flex items-center justify-end gap-2">
                    <Box component="button" onClick={() => openEdit(m)} className="text-muted-foreground hover:text-brand-blue" data-testid={`edit-member-${m.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Box>
                    {!m.is_self && (
                      <Box component="button" onClick={() => setToDelete(m)} className="text-muted-foreground hover:text-destructive" data-testid={`del-member-${m.id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
            {team.length === 0 && (
              <Box component="tr"><td colSpan={4} className="p-10 text-center text-muted-foreground">No team members yet.</Box></Box>
            )}
          </Box>
        </Box>
      </Box>

      <AlertDialog open={!!toDelete} onOpenChange={() => setToDelete(null)}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {toDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              They will lose access to this school&apos;s console. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="rounded-sm bg-destructive hover:bg-destructive/90" data-testid="confirm-del-member">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
