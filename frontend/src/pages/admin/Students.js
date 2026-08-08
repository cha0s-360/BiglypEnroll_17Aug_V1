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
import { toast } from "sonner";
import { Plus, UserPlus } from "lucide-react";

const GRADES = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];

export default function Students() {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", grade: "Grade 9", roll_no: "", parent_email: "" });

  const load = () => api.get("/students").then(({ data }) => setStudents(data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name) return toast.error("Name is required");
    try {
      await api.post("/students", form);
      toast.success("Student added");
      setOpen(false);
      setForm({ name: "", grade: "Grade 9", roll_no: "", parent_email: "" });
      load();
    } catch {
      toast.error("Could not add student");
    }
  };

  return (
    <DashboardLayout title="Students">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">{students.length} enrolled students</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-sm bg-brand-blue hover:bg-brand-navy" data-testid="add-student-btn">
              <Plus className="h-4 w-4 mr-2" /> Add student
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-sm">
            <DialogHeader>
              <DialogTitle className="font-head flex items-center gap-2"><UserPlus className="h-5 w-5" /> Add student</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Full name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-sm mt-1.5" data-testid="student-name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Grade</Label>
                  <Select value={form.grade} onValueChange={(v) => setForm({ ...form, grade: v })}>
                    <SelectTrigger className="rounded-sm mt-1.5" data-testid="student-grade"><SelectValue /></SelectTrigger>
                    <SelectContent>{GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Roll no.</Label>
                  <Input value={form.roll_no} onChange={(e) => setForm({ ...form, roll_no: e.target.value })} className="rounded-sm mt-1.5" data-testid="student-roll" />
                </div>
              </div>
              <div>
                <Label>Parent email (optional)</Label>
                <Input value={form.parent_email} onChange={(e) => setForm({ ...form, parent_email: e.target.value })}
                  placeholder="Links fees to their account" className="rounded-sm mt-1.5" data-testid="student-parent" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={add} className="rounded-sm bg-brand-blue hover:bg-brand-navy" data-testid="save-student-btn">Add student</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white border border-border rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
              <th className="p-4 font-medium">Student</th>
              <th className="p-4 font-medium">Grade</th>
              <th className="p-4 font-medium">Roll no.</th>
              <th className="p-4 font-medium">Parent linked</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30" data-testid={`student-${s.id}`}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-sm bg-brand-tint text-brand-navy flex items-center justify-center text-xs font-bold">
                      {s.name[0]}
                    </div>
                    <span className="font-medium text-brand-navy">{s.name}</span>
                  </div>
                </td>
                <td className="p-4"><Badge variant="secondary" className="rounded-sm">{s.grade}</Badge></td>
                <td className="p-4 text-muted-foreground">{s.roll_no || "—"}</td>
                <td className="p-4">
                  {s.parent_id ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100 rounded-sm">Linked</Badge>
                    : <span className="text-muted-foreground text-xs">Not linked</span>}
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr><td colSpan={4} className="p-10 text-center text-muted-foreground">No students yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
