import { useEffect, useState } from "react";
import { ParentLayout } from "@/components/ParentLayout";
import api, { inr } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Wallet, CheckCircle2, Sparkles, CreditCard, ShieldCheck, Download, Calendar, GraduationCap,
} from "lucide-react";

const MODES = ["UPI", "Cards", "Net Banking", "Wallets", "AutoPay/eNACH"];

export default function ParentDashboard() {
  const [children, setChildren] = useState([]);
  const [activeChild, setActiveChild] = useState(null);
  const [feeData, setFeeData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [payOpen, setPayOpen] = useState(false);
  const [mode, setMode] = useState("UPI");
  const [receipt, setReceipt] = useState(null);
  const [processing, setProcessing] = useState(false);

  // financing
  const [finOpen, setFinOpen] = useState(false);
  const [down, setDown] = useState(0);
  const [tenure, setTenure] = useState(6);
  const [finPreview, setFinPreview] = useState(null);

  useEffect(() => {
    api.get("/parent/children").then(({ data }) => {
      setChildren(data);
      if (data[0]) setActiveChild(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!activeChild) return;
    setSelected([]);
    api.get(`/parent/fees/${activeChild}`).then(({ data }) => setFeeData(data));
  }, [activeChild]);

  const items = feeData?.items || [];
  const pending = items.filter((i) => !i.paid);
  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const selectedItems = pending.filter((i) => selected.includes(i.fee_head_id));
  const total = selectedItems.reduce((a, i) => a + i.amount, 0);
  const gst = Math.round(total * 0.18);

  const refresh = () => api.get(`/parent/fees/${activeChild}`).then(({ data }) => setFeeData(data));

  const pay = async () => {
    setProcessing(true);
    try {
      const { data } = await api.post("/parent/pay", { student_id: activeChild, fee_head_ids: selected, mode });
      setReceipt(data);
      setPayOpen(false);
      setSelected([]);
      refresh();
      toast.success("Payment successful");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  const openFinancing = async () => {
    setFinOpen(true);
    const { data } = await api.post("/parent/financing/preview", { amount: total, down_payment: down, tenure });
    setFinPreview(data);
  };

  useEffect(() => {
    if (!finOpen) return;
    api.post("/parent/financing/preview", { amount: total, down_payment: down, tenure })
      .then(({ data }) => setFinPreview(data));
  }, [down, tenure, finOpen]); // eslint-disable-line

  const payFinancing = async () => {
    setProcessing(true);
    try {
      const { data } = await api.post("/parent/pay-financing", { student_id: activeChild, fee_head_ids: selected });
      setReceipt(data);
      setFinOpen(false);
      setSelected([]);
      refresh();
      toast.success("Financing approved — school paid in full");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Financing failed");
    } finally {
      setProcessing(false);
    }
  };

  const child = children.find((c) => c.id === activeChild);

  return (
    <ParentLayout>
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-brand-blue font-semibold">Fee Payment</p>
          <h1 className="font-head text-3xl font-black tracking-tight text-brand-navy mt-1">
            Hi{child ? `, ${child.name.split(" ")[0]}'s parent` : ""} 👋
          </h1>
        </div>
        {children.length > 1 && (
          <Select value={activeChild || ""} onValueChange={setActiveChild}>
            <SelectTrigger className="w-56 rounded-sm" data-testid="child-select"><SelectValue /></SelectTrigger>
            <SelectContent>
              {children.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} · {c.grade}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      {children.length === 0 && (
        <div className="bg-white border border-border rounded-sm p-12 text-center">
          <GraduationCap className="h-10 w-10 text-brand-blue mx-auto" />
          <p className="mt-4 font-head font-bold text-brand-navy text-lg">No students linked yet</p>
          <p className="text-sm text-muted-foreground mt-1">Ask your school to link your child to this email.</p>
        </div>
      )}

      {child && (
        <div className="grid lg:grid-cols-3 gap-4">
          {/* fee list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-border rounded-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-sm bg-brand-tint text-brand-navy flex items-center justify-center text-sm font-bold">{child.name[0]}</div>
                  <div>
                    <p className="font-semibold text-brand-navy text-sm">{child.name}</p>
                    <p className="text-xs text-muted-foreground">{child.grade} · {feeData?.academic_year}</p>
                  </div>
                </div>
                <Wallet className="h-5 w-5 text-brand-blue" />
              </div>
              <div className="divide-y divide-border">
                {items.map((i) => (
                  <label key={i.fee_head_id} className={`flex items-center gap-3 p-4 ${i.paid ? "opacity-60" : "cursor-pointer hover:bg-muted/30"}`} data-testid={`fee-item-${i.fee_head_id}`}>
                    {i.paid ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    ) : (
                      <Checkbox checked={selected.includes(i.fee_head_id)} onCheckedChange={() => toggle(i.fee_head_id)} data-testid={`check-${i.fee_head_id}`} />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-brand-navy text-sm">{i.name}</p>
                      <p className="text-xs text-muted-foreground">{i.frequency}</p>
                    </div>
                    {i.paid ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100 rounded-sm">Paid</Badge>
                      : <span className="font-head font-bold text-brand-navy">{inr(i.amount)}</span>}
                  </label>
                ))}
                {items.length === 0 && <p className="p-10 text-center text-muted-foreground text-sm">No fees published yet.</p>}
              </div>
            </div>

            {feeData?.scholarships?.length > 0 && (
              <div className="bg-brand-tint border border-brand-blue/20 rounded-sm p-4 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-brand-navy">Scholarships available</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {feeData.scholarships.map((s) => `${s.name} (${s.type === "percentage" ? s.value + "%" : inr(s.value)})`).join(" · ")}. Contact your counsellor to apply.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-border rounded-sm p-6 sticky top-24 hard-shadow-sm">
              <h3 className="font-head font-bold text-brand-navy">Payment summary</h3>
              <div className="mt-4 space-y-2 text-sm">
                {selectedItems.map((i) => (
                  <div key={i.fee_head_id} className="flex justify-between">
                    <span className="text-muted-foreground truncate pr-2">{i.name}</span>
                    <span className="text-brand-navy">{inr(i.amount)}</span>
                  </div>
                ))}
                {selectedItems.length === 0 && <p className="text-muted-foreground text-sm">Select fees to pay.</p>}
              </div>
              <div className="border-t border-border mt-4 pt-4 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{inr(total)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>{inr(gst)}</span></div>
                <div className="flex justify-between font-head font-bold text-lg text-brand-navy pt-1"><span>Total</span><span>{inr(total + gst)}</span></div>
              </div>
              <Button disabled={total === 0} onClick={() => setPayOpen(true)} data-testid="pay-now-btn"
                className="w-full mt-5 h-11 rounded-sm bg-brand-blue hover:bg-brand-navy font-semibold">
                <CreditCard className="h-4 w-4 mr-2" /> Pay {total > 0 ? inr(total + gst) : "now"}
              </Button>
              <Button disabled={total === 0} onClick={openFinancing} variant="outline" data-testid="finance-btn"
                className="w-full mt-2 h-11 rounded-sm border-brand-navy text-brand-navy font-semibold">
                <ShieldCheck className="h-4 w-4 mr-2" /> Split into 0% EMI
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pay dialog */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="rounded-sm">
          <DialogHeader><DialogTitle className="font-head">Choose payment method</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">Paying <span className="font-bold text-brand-navy">{inr(total + gst)}</span> for {child?.name}</p>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="rounded-sm" data-testid="mode-select"><SelectValue /></SelectTrigger>
              <SelectContent>{MODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
            <div className="bg-muted/40 rounded-sm p-3 text-xs text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-blue" /> Simulated gateway — no real charge is made.
            </div>
            <Button onClick={pay} disabled={processing} data-testid="confirm-pay-btn"
              className="w-full h-11 rounded-sm bg-brand-blue hover:bg-brand-navy font-semibold">
              {processing ? "Processing..." : `Pay ${inr(total + gst)}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Financing dialog */}
      <Dialog open={finOpen} onOpenChange={setFinOpen}>
        <DialogContent className="rounded-sm">
          <DialogHeader><DialogTitle className="font-head flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-brand-blue" /> 0% Fee Financing</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">Pay a portion now, finance the rest at <b>0% interest</b>. Your school is paid in full upfront.</p>
            <div>
              <label className="text-sm font-medium text-brand-navy">Down payment</label>
              <Input type="number" value={down} onChange={(e) => setDown(Math.max(0, Math.min(total, Number(e.target.value))))}
                className="rounded-sm mt-1.5" data-testid="down-input" />
            </div>
            <div>
              <label className="text-sm font-medium text-brand-navy flex justify-between"><span>Tenure</span><span>{tenure} months</span></label>
              <Slider value={[tenure]} min={6} max={12} step={1} onValueChange={(v) => setTenure(v[0])} className="mt-3" data-testid="tenure-slider" />
            </div>
            {finPreview && (
              <div className="bg-brand-tint rounded-sm p-4 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Financed amount</span><span className="font-semibold">{inr(finPreview.financed_amount)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Monthly EMI</span><span className="font-head font-bold text-brand-navy text-lg">{inr(finPreview.emi)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Interest</span><span className="font-semibold text-green-600">0%</span></div>
              </div>
            )}
            {finPreview && (
              <div className="max-h-32 overflow-y-auto border border-border rounded-sm divide-y divide-border">
                {finPreview.schedule.map((s) => (
                  <div key={s.month} className="flex items-center justify-between px-3 py-2 text-xs">
                    <span className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-3 w-3" /> {s.due_date}</span>
                    <span className="font-semibold text-brand-navy">{inr(s.amount)}</span>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={payFinancing} disabled={processing} data-testid="confirm-finance-btn"
              className="w-full h-11 rounded-sm bg-brand-blue hover:bg-brand-navy font-semibold">
              {processing ? "Setting up..." : "Confirm plan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt dialog */}
      <Dialog open={!!receipt} onOpenChange={() => setReceipt(null)}>
        <DialogContent className="rounded-sm">
          <div className="text-center py-4">
            <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-head font-bold text-brand-navy text-xl mt-4">Payment successful</h3>
            <p className="text-sm text-muted-foreground mt-1">Receipt {receipt?.receipt_no}</p>
            <div className="bg-muted/40 rounded-sm p-4 mt-5 text-left text-sm space-y-1.5">
              <div className="flex justify-between"><span className="text-muted-foreground">Student</span><span className="font-medium">{receipt?.student_name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Mode</span><span className="font-medium">{receipt?.mode}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-medium">{inr(receipt?.amount)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span className="font-medium">{inr(receipt?.gst)}</span></div>
            </div>
            <Button onClick={() => setReceipt(null)} className="w-full mt-5 h-11 rounded-sm bg-brand-blue hover:bg-brand-navy" data-testid="receipt-close">
              <Download className="h-4 w-4 mr-2" /> Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ParentLayout>
  );
}
