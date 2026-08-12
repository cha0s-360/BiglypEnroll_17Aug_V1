'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { CreditLayout } from "@/components/CreditLayout";
import api, { inr } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";

const DECISION_STYLE = {
  Approved: "bg-green-100 text-green-700",
  "Conditional Approval": "bg-blue-100 text-blue-700",
  Refer: "bg-amber-100 text-amber-700",
  Reject: "bg-red-100 text-red-700",
};

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [q, setQ] = useState("");
  const router = useRouter();

  useEffect(() => { api.get("/credit/applications").then(({ data }) => setApps(data)).catch(() => {}); }, []);

  const filtered = apps.filter((a) =>
    [a.app_no, a.applicant?.name, a.student?.name].join(" ").toLowerCase().includes(q.toLowerCase()));

  return (
    <CreditLayout title="Loan Applications" subtitle={`${apps.length} applications`}>
      <Box className="relative mb-4 max-w-sm">
        <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or app no."
          className="pl-9 rounded-sm" data-testid="app-search" />
      </Box>
      <Box className="bg-white border border-border rounded-sm overflow-hidden">
        <Box component="table" className="w-full text-sm">
          <Box component="thead">
            <Box component="tr" className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
              <Box component="th" className="p-4 font-medium">Application</Box>
              <Box component="th" className="p-4 font-medium">Applicant / Student</Box>
              <Box component="th" className="p-4 font-medium">Loan</Box>
              <Box component="th" className="p-4 font-medium">Score</Box>
              <Box component="th" className="p-4 font-medium">Decision</Box>
              <Box component="th" className="p-4 font-medium">Status</Box>
              <Box component="th" className="p-4"></Box>
            </Box>
          </Box>
          <Box component="tbody">
            {filtered.map((a) => (
              <Box component="tr" key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer"
                onClick={() => router.push(`/credit/app/${a.id}`)} data-testid={`app-row-${a.id}`}>
                <Box component="td" className="p-4"><Box component="span" className="font-mono text-xs font-semibold text-brand-navy">{a.app_no}</Box></Box>
                <Box component="td" className="p-4">
                  <Typography variant="inherit" component="p" className="font-medium text-brand-navy">{a.applicant?.name || "—"}</Typography>
                  <Typography variant="inherit" component="p" className="text-xs text-muted-foreground">{a.student?.name} {a.student?.grade && `· ${a.student.grade}`}</Typography>
                </Box>
                <Box component="td" className="p-4 font-semibold text-brand-navy">{inr(a.fee?.loan_amount)}</Box>
                <Box component="td" className="p-4">{a.internal_score?.score ? <Box component="span" className="font-head font-bold text-brand-navy">{a.internal_score.score}</Box> : <Box component="span" className="text-muted-foreground text-xs">—</Box>}</Box>
                <Box component="td" className="p-4">
                  {a.decision?.status ? <Badge className={`rounded-sm ${DECISION_STYLE[a.decision.status] || "bg-muted"}`}>{a.decision.status}</Badge>
                    : <Box component="span" className="text-muted-foreground text-xs">Pending</Box>}
                </Box>
                <Box component="td" className="p-4"><Box component="span" className="text-xs capitalize text-muted-foreground">{(a.status || "").replace(/_/g, " ")}</Box></Box>
                <Box component="td" className="p-4"><ChevronRight className="h-4 w-4 text-muted-foreground" /></Box>
              </Box>
            ))}
            {filtered.length === 0 && <Box component="tr"><td colSpan={7} className="p-10 text-center text-muted-foreground">No applications found.</Box></Box>}
          </Box>
        </Box>
      </Box>
    </CreditLayout>
  );
}
