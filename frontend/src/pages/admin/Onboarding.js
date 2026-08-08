import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Building2, GraduationCap, Landmark, Check, Plus, Trash2, ArrowRight, ArrowLeft, PartyPopper,
} from "lucide-react";

const uid = () => Math.random().toString(36).slice(2, 10);
const STEPS = [
  { key: "profile", label: "School profile", icon: Building2 },
  { key: "campuses", label: "Campuses", icon: Building2 },
  { key: "courses", label: "Courses", icon: GraduationCap },
  { key: "accounts", label: "Settlement", icon: Landmark },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [school, setSchool] = useState(null);
  const [profile, setProfile] = useState({ name: "", type: "School", spoc_name: "", spoc_email: "", phone: "", address: "" });
  const [campuses, setCampuses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [multi, setMulti] = useState(false);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    api.get("/school").then(({ data }) => {
      if (data) {
        setSchool(data);
        setProfile({ name: data.name || "", type: data.type || "School", spoc_name: data.spoc_name || "",
          spoc_email: data.spoc_email || "", phone: data.phone || "", address: data.address || "" });
        setCampuses(data.campuses || []);
        setCourses(data.courses || []);
        setMulti(data.multi_account_enabled || false);
        setAccounts(data.settlement_accounts || []);
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
        multi_account_enabled: multi, settlement_accounts: accounts, complete,
      });
      toast.success(complete ? "🎉 Your institute is live!" : "Progress saved");
    } catch {
      toast.error("Save failed");
    }
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
              <ListEditor
                items={accounts} setItems={setAccounts}
                template={() => ({ id: uid(), label: "", account_no: "" })}
                fields={[{ k: "label", ph: "Account label" }, { k: "account_no", ph: "Account number" }]}
                addLabel="Add settlement account" testid="account" embedded
              />
            )}
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(2)} className="rounded-sm">
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
