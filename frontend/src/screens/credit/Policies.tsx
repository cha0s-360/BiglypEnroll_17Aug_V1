'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";
import { CreditLayout } from "@/components/CreditLayout";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { Save, SlidersHorizontal, Gauge, Landmark } from "lucide-react";

const POLICY_FIELDS = [
  ["min_cibil", "Min CIBIL"], ["max_foir", "Max FOIR %"], ["min_income", "Min income ₹"],
  ["min_age", "Min age"], ["max_age", "Max age"], ["min_ticket", "Min ticket ₹"],
  ["max_ticket", "Max ticket ₹"], ["min_tenure", "Min tenure (m)"], ["max_tenure", "Max tenure (m)"],
  ["interest_rate", "Interest rate %"], ["processing_fee_pct", "Processing fee %"],
];
const WEIGHT_KEYS = ["cibil", "foir", "income_stability", "employment_stability", "banking_behaviour", "credit_utilization", "repayment_history"];

export default function Policies() {
  const [lenders, setLenders] = useState([]);
  const [config, setConfig] = useState(null);

  const load = () => {
    api.get("/credit/lenders").then(({ data }) => setLenders(data));
    api.get("/credit/config").then(({ data }) => setConfig(data));
  };
  useEffect(() => { load(); }, []);

  const setPolicy = (lid, key, val) =>
    setLenders((ls) => ls.map((l) => l.id === lid ? { ...l, policy: { ...l.policy, [key]: Number(val) } } : l));

  const saveLender = async (l) => {
    try { await api.put(`/credit/lenders/${l.id}`, l); toast.success(`${l.name} policy saved`); }
    catch { toast.error("Save failed"); }
  };

  const weightSum = config ? Object.values(config.internal_score_weights).reduce((a, b) => a + Number(b), 0) : 0;

  const setWeight = (k, v) =>
    setConfig((c) => ({ ...c, internal_score_weights: { ...c.internal_score_weights, [k]: Number(v) } }));

  const saveConfig = async () => {
    if (Math.abs(weightSum - 1) > 0.011) return toast.error(`Weights must sum to 1.00 (currently ${weightSum.toFixed(2)})`);
    try {
      await api.put("/credit/config", { internal_score_weights: config.internal_score_weights, biglyp_commission_pct: config.biglyp_commission_pct });
      toast.success("Score model saved");
    } catch { toast.error("Save failed"); }
  };

  return (
    <CreditLayout title="Lender Policies & Score Model" subtitle="Configure credit rules without code — changes apply to new assessments">
      {/* Internal score weights */}
      {config && (
        <Box className="bg-white border border-border rounded-sm p-6 mb-6">
          <Box className="flex items-center justify-between mb-4">
            <Box className="flex items-center gap-2"><Gauge className="h-4 w-4 text-brand-blue" /><Typography variant="inherit" component="h3" className="font-head font-bold text-brand-navy">Biglyp Internal Score weightages</Typography></Box>
            <Badge className={`rounded-sm ${Math.abs(weightSum - 1) < 0.011 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>Σ = {weightSum.toFixed(2)}</Badge>
          </Box>
          <Box className="grid md:grid-cols-4 gap-4">
            {WEIGHT_KEYS.map((k) => (
              <Box key={k}>
                <Label className="capitalize text-xs">{k.replace(/_/g, " ")}</Label>
                <Input type="number" step="0.01" value={config.internal_score_weights[k]} onChange={(e) => setWeight(k, e.target.value)}
                  className="rounded-sm mt-1.5" data-testid={`weight-${k}`} />
              </Box>
            ))}
            <Box>
              <Label className="text-xs">Biglyp commission %</Label>
              <Input type="number" step="0.1" value={config.biglyp_commission_pct} onChange={(e) => setConfig({ ...config, biglyp_commission_pct: Number(e.target.value) })}
                className="rounded-sm mt-1.5" data-testid="commission" />
            </Box>
          </Box>
          <Button onClick={saveConfig} className="rounded-sm bg-brand-blue hover:bg-brand-navy mt-4" data-testid="save-config-btn"><Save className="h-4 w-4 mr-2" /> Save score model</Button>
        </Box>
      )}

      {/* Lender policies */}
      <Box className="flex items-center gap-2 mb-3"><SlidersHorizontal className="h-4 w-4 text-brand-blue" /><Typography variant="inherit" component="h3" className="font-head font-bold text-brand-navy">Lender credit policies</Typography></Box>
      <Accordion type="single" collapsible className="space-y-3">
        {lenders.map((l) => (
          <AccordionItem key={l.id} value={l.id} className="bg-white border border-border rounded-sm px-4" data-testid={`policy-${l.id}`}>
            <AccordionTrigger className="hover:no-underline">
              <Box className="flex items-center gap-3">
                <Box className="h-8 w-8 rounded-sm flex items-center justify-center" style={{ background: l.color }}><Landmark className="h-4 w-4 text-white" /></Box>
                <Box component="span" className="font-medium text-brand-navy">{l.name}</Box>
                <Badge variant="secondary" className="rounded-sm">{l.type}</Badge>
              </Box>
            </AccordionTrigger>
            <AccordionContent>
              <Box className="grid md:grid-cols-4 gap-4 pt-2">
                {POLICY_FIELDS.map(([key, label]) => (
                  <Box key={key}>
                    <Label className="text-xs">{label}</Label>
                    <Input type="number" value={l.policy[key]} onChange={(e) => setPolicy(l.id, key, e.target.value)}
                      className="rounded-sm mt-1.5" data-testid={`pol-${l.id}-${key}`} />
                  </Box>
                ))}
              </Box>
              <Button onClick={() => saveLender(l)} className="rounded-sm bg-brand-blue hover:bg-brand-navy mt-4" data-testid={`save-pol-${l.id}`}><Save className="h-4 w-4 mr-2" /> Save {l.name}</Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </CreditLayout>
  );
}
