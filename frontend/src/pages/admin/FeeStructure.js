import { useEffect, useRef, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import api, { inr } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Plus, Trash2, Sparkles, Upload, Save, Send, Loader2, Award,
} from "lucide-react";

const FREQ = ["Yearly", "Half-Yearly", "Quarterly", "Monthly", "One-Time"];
const GRADES = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const uid = () => Math.random().toString(36).slice(2, 10);

export default function FeeStructure() {
  const [fs, setFs] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    api.get("/fees/structure").then(({ data }) => setFs(data)).catch(() => {});
  }, []);

  const update = (patch) => setFs((s) => ({ ...s, ...patch }));

  const addHead = () =>
    update({ fee_heads: [...fs.fee_heads, { id: uid(), name: "New Fee", amount: 0, frequency: "Yearly", grades: [], account_id: null }] });

  const editHead = (id, patch) =>
    update({ fee_heads: fs.fee_heads.map((h) => (h.id === id ? { ...h, ...patch } : h)) });

  const removeHead = (id) =>
    update({ fee_heads: fs.fee_heads.filter((h) => h.id !== id) });

  const toggleGrade = (id, grade) => {
    const h = fs.fee_heads.find((x) => x.id === id);
    const grades = h.grades.includes(grade) ? h.grades.filter((g) => g !== grade) : [...h.grades, grade];
    editHead(id, { grades });
  };

  const addScholarship = () =>
    update({ scholarships: [...fs.scholarships, { id: uid(), name: "New Scholarship", type: "percentage", value: 10 }] });

  const editSch = (id, patch) =>
    update({ scholarships: fs.scholarships.map((s) => (s.id === id ? { ...s, ...patch } : s)) });

  const removeSch = (id) =>
    update({ scholarships: fs.scholarships.filter((s) => s.id !== id) });

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsing(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const { data } = await api.post("/fees/parse-excel", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      update({ fee_heads: [...fs.fee_heads, ...data.fee_heads] });
      toast.success(`AI parsed ${data.fee_heads.length} fee heads from your file`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not parse file");
    } finally {
      setParsing(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = async (publish) => {
    setSaving(true);
    try {
      const payload = { ...fs, published: publish ? true : fs.published };
      const { data } = await api.post("/fees/structure", payload);
      setFs(data);
      toast.success(publish ? "Fee structure published to parents" : "Draft saved");
    } catch (err) {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!fs) {
    return (
      <DashboardLayout title="Fee Structure">
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Fee Structure">
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          {fs.published ? (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 rounded-sm">Published</Badge>
          ) : (
            <Badge variant="secondary" className="rounded-sm">Draft</Badge>
          )}
          <span className="text-sm text-muted-foreground">{fs.fee_heads.length} fee heads</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" hidden onChange={onUpload} data-testid="fee-file-input" />
          <Button variant="outline" className="rounded-sm border-brand-navy text-brand-navy"
            disabled={parsing} onClick={() => fileRef.current?.click()} data-testid="ai-upload-btn">
            {parsing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {parsing ? "AI parsing..." : "Upload Excel (AI)"}
          </Button>
          <Button variant="outline" className="rounded-sm" disabled={saving} onClick={() => save(false)} data-testid="save-draft-btn">
            <Save className="h-4 w-4 mr-2" /> Save
          </Button>
          <Button className="rounded-sm bg-brand-blue hover:bg-brand-navy" disabled={saving} onClick={() => save(true)} data-testid="publish-btn">
            <Send className="h-4 w-4 mr-2" /> Publish
          </Button>
        </div>
      </div>

      {/* fee heads table */}
      <div className="bg-white border border-border rounded-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <h3 className="font-head font-bold text-brand-navy">Fee heads</h3>
          <Button size="sm" variant="ghost" onClick={addHead} className="text-brand-blue" data-testid="add-head-btn">
            <Plus className="h-4 w-4 mr-1" /> Add head
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="p-4 font-medium">Fee name</th>
                <th className="p-4 font-medium">Amount (₹)</th>
                <th className="p-4 font-medium">Frequency</th>
                <th className="p-4 font-medium">Applicable grades</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {fs.fee_heads.map((h) => (
                <tr key={h.id} className="border-b border-border last:border-0" data-testid={`fee-row-${h.id}`}>
                  <td className="p-3">
                    <Input value={h.name} onChange={(e) => editHead(h.id, { name: e.target.value })}
                      className="rounded-sm h-9 border-transparent hover:border-border focus:border-brand-blue" />
                  </td>
                  <td className="p-3 w-36">
                    <Input type="number" value={h.amount} onChange={(e) => editHead(h.id, { amount: Number(e.target.value) })}
                      className="rounded-sm h-9" />
                  </td>
                  <td className="p-3 w-40">
                    <Select value={h.frequency} onValueChange={(v) => editHead(h.id, { frequency: v })}>
                      <SelectTrigger className="rounded-sm h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>{FREQ.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {GRADES.map((g) => (
                        <button key={g} onClick={() => toggleGrade(h.id, g)}
                          className={`text-[11px] px-2 py-1 rounded-sm border transition-colors ${
                            h.grades.includes(g) ? "bg-brand-blue text-white border-brand-blue" : "border-border text-muted-foreground hover:border-brand-blue"
                          }`}>
                          {g.replace("Grade ", "G")}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <button onClick={() => removeHead(h.id)} className="text-muted-foreground hover:text-destructive" data-testid={`del-head-${h.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {fs.fee_heads.length === 0 && (
                <tr><td colSpan={5} className="p-10 text-center text-muted-foreground">No fee heads yet. Add one or upload an Excel sheet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* scholarships + rules */}
      <div className="mt-4 grid lg:grid-cols-2 gap-4">
        <div className="bg-white border border-border rounded-sm">
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <h3 className="font-head font-bold text-brand-navy flex items-center gap-2"><Award className="h-4 w-4" /> Scholarships</h3>
            <Button size="sm" variant="ghost" onClick={addScholarship} className="text-brand-blue" data-testid="add-scholarship-btn">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          <div className="p-4 space-y-3">
            {fs.scholarships.map((s) => (
              <div key={s.id} className="flex items-center gap-2" data-testid={`sch-row-${s.id}`}>
                <Input value={s.name} onChange={(e) => editSch(s.id, { name: e.target.value })} className="rounded-sm h-9 flex-1" />
                <Select value={s.type} onValueChange={(v) => editSch(s.id, { type: v })}>
                  <SelectTrigger className="rounded-sm h-9 w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percent %</SelectItem>
                    <SelectItem value="fixed">Fixed ₹</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" value={s.value} onChange={(e) => editSch(s.id, { value: Number(e.target.value) })} className="rounded-sm h-9 w-24" />
                <button onClick={() => removeSch(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            {fs.scholarships.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No scholarships configured.</p>}
          </div>
        </div>

        <div className="bg-white border border-border rounded-sm">
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="font-head font-bold text-brand-navy">Discount & late-fee rules</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <Label>Early-bird discount (%)</Label>
              <Input type="number" value={fs.early_bird_discount} onChange={(e) => update({ early_bird_discount: Number(e.target.value) })}
                className="rounded-sm h-10 mt-1.5" data-testid="early-bird-input" />
            </div>
            <div>
              <Label>Late fee per cycle (₹)</Label>
              <Input type="number" value={fs.late_fee} onChange={(e) => update({ late_fee: Number(e.target.value) })}
                className="rounded-sm h-10 mt-1.5" data-testid="late-fee-input" />
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly frequency fees are available to parents only via 0% Fee Financing.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
