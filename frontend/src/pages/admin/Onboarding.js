import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Building2, GraduationCap, Landmark, Check, Plus, Trash2, ArrowRight, ArrowLeft, PartyPopper, BadgeCheck, Loader2,
  Wallet, Zap, RefreshCw, CreditCard,
} from "lucide-react";

const uid = () => Math.random().toString(36).slice(2, 10);
const STEPS = [
  { key: "profile", label: "School profile", icon: Building2 },
  { key: "campuses", label: "Campuses", icon: Building2 },
  { key: "courses", label: "Courses", icon: GraduationCap },
  { key: "accounts", label: "Settlement", icon: Landmark },
  { key: "fees", label: "Fee Collection", icon: Wallet },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [school, setSchool] = useState(null);
  const [profile, setProfile] = useState({ name: "", type: "School", spoc_name: "", spoc_email: "", phone: "", address: "" });
  const [campuses, setCampuses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [multi, setMulti] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [feeHeads, setFeeHeads] = useState([]);
  const [paymentOptions, setPaymentOptions] = useState({ emi: true, auto_debit: true, full: true });

  useEffect(() => {
    api.get("/fees/structure").then(({ data }) => setFeeHeads(data?.fee_heads || [])).catch(() => {});
    api.get("/school").then(({ data }) => {
      if (data) {
        setSchool(data);
        setProfile({ name: data.name || "", type: data.type || "School", spoc_name: data.spoc_name || "",
          spoc_email: data.spoc_email || "", phone: data.phone || "", address: data.address || "" });
        setCampuses(data.campuses || []);
        setCourses(data.courses || []);
        setMulti(data.multi_account_enabled || false);
        setAccounts(data.settlement_accounts || []);
        if (data.payment_options) setPaymentOptions({ emi: true, auto_debit: true, full: true, ...data.payment_options });
      }
    }).catch(() => {});
  }, []);

  const saveProfile = async () => {
    if (!profile.name) return toast.error("School name required");
    const { data } = await api.post("/school", profile);
    setSchool(data);
    toast.success("Profile saved");
    setStep(1);
  };

  const saveRest = async (complete) => {
    try {
      await api.post("/school/onboarding", {
        campuses, courses, team: school?.team || [],
        multi_account_enabled: multi, settlement_accounts: accounts,
        payment_options: paymentOptions, complete,
      });
      toast.success(complete ? "🎉 Your institute is live!" : "Progress saved");
    } catch {
      toast.error("Save failed");
    }
  };

  const enabledCount = Object.values(paymentOptions).filter(Boolean).length;
  const togglePaymentOption = (key) => {
    setPaymentOptions((po) => {
      const next = { ...po, [key]: !po[key] };
      if (!Object.values(next).some(Boolean)) {
        toast.error("At least one payment option must stay enabled");
        return po;
      }
      return next;
    });
  };

  const StepIcon = STEPS[step].icon;

  return (
    <DashboardLayout title="School Setup">
      {/* stepper */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < step;
          const active = i === step;
          return (
            <div key={s.key} className="flex items-center gap-2 shrink-0">
              <button onClick={() => (school || i === 0) && setStep(i)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-sm border text-sm font-medium transition-colors ${
                  active ? "bg-brand-navy text-white border-brand-navy"
                  : done ? "bg-brand-tint text-brand-navy border-brand-tint"
                  : "bg-white text-muted-foreground border-border"
                }`} data-testid={`step-${s.key}`}>
                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                {s.label}
              </button>
              {i < STEPS.length - 1 && <div className="h-px w-6 bg-border" />}
            </div>
          );
        })}
      </div>

      <div className="max-w-3xl bg-white border border-border rounded-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-sm bg-brand-blue flex items-center justify-center">
            <StepIcon className="h-5 w-5 text-white" />
          </div>
          <h2 className="font-head text-xl font-bold text-brand-navy">{STEPS[step].label}</h2>
        </div>

        {/* Step 0: profile */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <Label>School / Institute name</Label>
              <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="rounded-sm mt-1.5" data-testid="onb-name" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>SPOC name</Label>
                <Input value={profile.spoc_name} onChange={(e) => setProfile({ ...profile, spoc_name: e.target.value })} className="rounded-sm mt-1.5" data-testid="onb-spoc" />
              </div>
              <div>
                <Label>SPOC email</Label>
                <Input value={profile.spoc_email} onChange={(e) => setProfile({ ...profile, spoc_email: e.target.value })} className="rounded-sm mt-1.5" data-testid="onb-spoc-email" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="rounded-sm mt-1.5" />
              </div>
              <div>
                <Label>Address</Label>
                <Input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className="rounded-sm mt-1.5" />
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <Button onClick={saveProfile} className="rounded-sm bg-brand-blue hover:bg-brand-navy" data-testid="onb-save-profile">
                Continue <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 1: campuses */}
        {step === 1 && (
          <ListEditor
            items={campuses} setItems={setCampuses}
            template={() => ({ id: uid(), name: "", city: "" })}
            fields={[{ k: "name", ph: "Campus name" }, { k: "city", ph: "City" }]}
            addLabel="Add campus" testid="campus"
            onNext={() => { saveRest(false); setStep(2); }} onBack={() => setStep(0)}
          />
        )}

        {/* Step 2: courses */}
        {step === 2 && (
          <ListEditor
            items={courses} setItems={setCourses}
            template={() => ({ id: uid(), name: "", duration: "1 yr" })}
            fields={[{ k: "name", ph: "Course / grade name" }, { k: "duration", ph: "Duration" }]}
            addLabel="Add course" testid="course"
            onNext={() => { saveRest(false); setStep(3); }} onBack={() => setStep(1)}
          />
        )}

        {/* Step 3: settlement */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border border-border rounded-sm p-4">
              <div>
                <p className="font-medium text-brand-navy">Multi-account settlement</p>
                <p className="text-xs text-muted-foreground">Route different fee heads to different bank accounts.</p>
              </div>
              <Switch checked={multi} onCheckedChange={setMulti} data-testid="multi-account-switch" />
            </div>
            {multi && (
              <AccountsEditor accounts={accounts} setAccounts={setAccounts} feeHeads={feeHeads} />
            )}
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(2)} className="rounded-sm">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={() => { saveRest(false); setStep(4); }} className="rounded-sm bg-brand-blue hover:bg-brand-navy" data-testid="onb-to-fees">
                Continue <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: fee collection (parent payment options) */}
        {step === 4 && (
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground -mt-2">
              Choose which payment options parents can use to clear academic fees. At least one must stay on.
            </p>
            {[
              { key: "emi", tag: "Option A", icon: Zap, title: "Pay full-year fees in EMIs",
                desc: "Zero-cost monthly EMIs via our RBI-regulated lending partner. School is paid 100% upfront." },
              { key: "auto_debit", tag: "Option B", icon: RefreshCw, title: "Auto-Debit (Quarterly / Half-Yearly)",
                desc: "Parents set up an e-mandate and fees are auto-debited each term — no more late fees." },
              { key: "full", tag: "Option C", icon: CreditCard, title: "Pay full amount instantly",
                desc: "One-time full payment via UPI, Credit/Debit Card or Net Banking." },
            ].map((o) => {
              const Icon = o.icon;
              const on = !!paymentOptions[o.key];
              const isLastOn = on && enabledCount === 1;
              return (
                <div key={o.key} className="flex items-start justify-between gap-4 border border-border rounded-sm p-4" data-testid={`payopt-${o.key}`}>
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-sm flex items-center justify-center shrink-0 ${on ? "bg-brand-blue text-white" : "bg-muted text-muted-foreground"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-brand-blue">{o.tag}</p>
                      <p className="font-medium text-brand-navy leading-tight">{o.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-md">{o.desc}</p>
                    </div>
                  </div>
                  <Switch checked={on} disabled={isLastOn} onCheckedChange={() => togglePaymentOption(o.key)} data-testid={`payopt-switch-${o.key}`} />
                </div>
              );
            })}
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(3)} className="rounded-sm">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={() => saveRest(true)} className="rounded-sm bg-brand-blue hover:bg-brand-navy" data-testid="onb-golive">
                <PartyPopper className="h-4 w-4 mr-2" /> Go live
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function ListEditor({ items, setItems, template, fields, addLabel, testid, onNext, onBack, embedded }) {
  const add = () => setItems([...items, template()]);
  const edit = (id, k, v) => setItems(items.map((it) => (it.id === id ? { ...it, [k]: v } : it)));
  const remove = (id) => setItems(items.filter((it) => it.id !== id));

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.id} className="flex items-center gap-2" data-testid={`${testid}-row`}>
            {fields.map((f) => (
              <Input key={f.k} value={it[f.k]} placeholder={f.ph}
                onChange={(e) => edit(it.id, f.k, e.target.value)} className="rounded-sm h-10" />
            ))}
            <button onClick={() => remove(it.id)} className="text-muted-foreground hover:text-destructive shrink-0">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground py-3">Nothing added yet.</p>}
      </div>
      <Button variant="outline" onClick={add} className="rounded-sm border-dashed" data-testid={`add-${testid}`}>
        <Plus className="h-4 w-4 mr-2" /> {addLabel}
      </Button>
      {!embedded && (
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack} className="rounded-sm"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
          <Button onClick={onNext} className="rounded-sm bg-brand-blue hover:bg-brand-navy">Continue <ArrowRight className="h-4 w-4 ml-2" /></Button>
        </div>
      )}
    </div>
  );
}

function AccountsEditor({ accounts, setAccounts, feeHeads }) {
  const [verifying, setVerifying] = useState(null);
  const add = () => setAccounts([...accounts, { id: uid(), account_number: "", ifsc: "", account_name: "", fee_head_id: "" }]);
  const edit = (id, patch) => setAccounts(accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const remove = (id) => setAccounts(accounts.filter((a) => a.id !== id));

  const verify = async (a) => {
    if (!a.account_number || !a.ifsc) return toast.error("Enter account number and IFSC first");
    setVerifying(a.id);
    try {
      const { data } = await api.post("/school/verify-account", { account_number: a.account_number, ifsc: a.ifsc });
      edit(a.id, { account_name: data.account_name });
      toast.success(`Account verified: ${data.account_name}`);
    } catch (err) {
      edit(a.id, { account_name: "" });
      toast.error(err.response?.data?.detail || "Could not verify account");
    } finally {
      setVerifying(null);
    }
  };

  const linkedElsewhere = (headId, selfId) => accounts.some((a) => a.id !== selfId && a.fee_head_id === headId);

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {accounts.map((a) => (
          <div key={a.id} className="border border-border rounded-sm p-4 space-y-3" data-testid="account-row">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-brand-navy flex items-center gap-2"><Landmark className="h-4 w-4 text-brand-blue" /> Settlement account</p>
              <button onClick={() => remove(a.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Bank account number</Label>
                <Input value={a.account_number} placeholder="Account number"
                  onChange={(e) => edit(a.id, { account_number: e.target.value.replace(/[^0-9]/g, ""), account_name: "" })}
                  className="rounded-sm mt-1.5 h-10" data-testid="acc-number" />
              </div>
              <div>
                <Label className="text-xs">IFSC code</Label>
                <Input value={a.ifsc} placeholder="HDFC0001234"
                  onChange={(e) => edit(a.id, { ifsc: e.target.value.toUpperCase(), account_name: "" })}
                  className="rounded-sm mt-1.5 h-10" data-testid="acc-ifsc" />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Label className="text-xs">Account holder name {a.account_name && <span className="text-green-600 ml-1">(auto-fetched)</span>}</Label>
                <Input value={a.account_name} readOnly placeholder="Verify to auto-fetch name"
                  className="rounded-sm mt-1.5 h-10 bg-muted/40" data-testid="acc-name" />
              </div>
              <Button variant="outline" onClick={() => verify(a)} disabled={verifying === a.id}
                className="rounded-sm h-10 border-brand-blue text-brand-blue" data-testid="acc-verify">
                {verifying === a.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><BadgeCheck className="h-4 w-4 mr-1.5" /> Verify</>}
              </Button>
            </div>
            <div>
              <Label className="text-xs">Linked fee header</Label>
              <Select value={a.fee_head_id || ""} onValueChange={(v) => edit(a.id, { fee_head_id: v })}>
                <SelectTrigger className="rounded-sm mt-1.5 h-10" data-testid="acc-feehead"><SelectValue placeholder="Select fee header" /></SelectTrigger>
                <SelectContent>
                  {feeHeads.length === 0 && <div className="px-3 py-2 text-xs text-muted-foreground">Add fee heads first</div>}
                  {feeHeads.map((h) => (
                    <SelectItem key={h.id} value={h.id} disabled={linkedElsewhere(h.id, a.id)}>
                      {h.name}{linkedElsewhere(h.id, a.id) ? " (linked)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
        {accounts.length === 0 && <p className="text-sm text-muted-foreground py-3">No settlement accounts yet. Add one to route a fee header to its own bank account.</p>}
      </div>
      <Button variant="outline" onClick={add} className="rounded-sm border-dashed" data-testid="add-account">
        <Plus className="h-4 w-4 mr-2" /> Add settlement account
      </Button>
    </div>
  );
}
