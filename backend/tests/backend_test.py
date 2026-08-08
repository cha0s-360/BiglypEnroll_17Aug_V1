"""BiglypEnroll backend test suite (pytest)."""
import io
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://enroll-modern.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

DEMO = {
    "super_admin": ("admin@biglyp.com", "admin123"),
    "school_admin": ("school@biglyp.com", "school123"),
    "finance": ("finance@biglyp.com", "finance123"),
    "parent": ("parent@biglyp.com", "parent123"),
}


def _login(email, password):
    r = requests.post(f"{API}/auth/login", json={"email": email, "password": password}, timeout=20)
    assert r.status_code == 200, f"login failed {email}: {r.status_code} {r.text}"
    return r.json()


def _hdr(token):
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="session")
def tokens():
    return {role: _login(e, p)["token"] for role, (e, p) in DEMO.items()}


# ---- Auth ----
class TestAuth:
    def test_login_each_demo(self):
        for role, (e, p) in DEMO.items():
            data = _login(e, p)
            assert data["user"]["role"] == role, f"{e} expected {role}, got {data['user']['role']}"
            assert data["token"]

    def test_login_bad_password(self):
        r = requests.post(f"{API}/auth/login", json={"email": "admin@biglyp.com", "password": "wrong"})
        assert r.status_code == 401

    def test_me(self, tokens):
        r = requests.get(f"{API}/auth/me", headers=_hdr(tokens["parent"]))
        assert r.status_code == 200
        assert r.json()["email"] == "parent@biglyp.com"
        assert r.json()["role"] == "parent"

    def test_me_no_auth(self):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_register_new_user(self):
        import uuid as _u
        email = f"TEST_{_u.uuid4().hex[:8]}@example.com"
        r = requests.post(f"{API}/auth/register", json={"name": "T", "email": email, "password": "pass1234"})
        assert r.status_code == 200
        data = r.json()
        assert data["user"]["email"] == email.lower()
        assert data["user"]["role"] == "parent"
        # duplicate should fail
        r2 = requests.post(f"{API}/auth/register", json={"name": "T", "email": email, "password": "pass1234"})
        assert r2.status_code == 400


# ---- RBAC ----
class TestRBAC:
    def test_parent_cannot_access_analytics(self, tokens):
        r = requests.get(f"{API}/analytics/overview", headers=_hdr(tokens["parent"]))
        assert r.status_code == 403

    def test_parent_cannot_list_students(self, tokens):
        r = requests.get(f"{API}/students", headers=_hdr(tokens["parent"]))
        assert r.status_code == 403

    def test_school_admin_can_analytics(self, tokens):
        r = requests.get(f"{API}/analytics/overview", headers=_hdr(tokens["school_admin"]))
        assert r.status_code == 200


# ---- Analytics ----
class TestAnalytics:
    def test_overview_shape(self, tokens):
        r = requests.get(f"{API}/analytics/overview", headers=_hdr(tokens["school_admin"]))
        assert r.status_code == 200
        d = r.json()
        for k in ["kpis", "mode_split", "monthly_trend", "aging", "funnel"]:
            assert k in d
        for k in ["total_collected", "financed_disbursals", "outstanding", "overdue_count", "total_students", "transactions"]:
            assert k in d["kpis"]
        assert len(d["monthly_trend"]) == 6


# ---- Fee Structure ----
class TestFeeStructure:
    def test_get_structure_published(self, tokens):
        r = requests.get(f"{API}/fees/structure", headers=_hdr(tokens["school_admin"]))
        assert r.status_code == 200
        d = r.json()
        assert d["published"] is True
        assert len(d["fee_heads"]) >= 3

    def test_save_and_persist(self, tokens):
        # Load current
        r = requests.get(f"{API}/fees/structure", headers=_hdr(tokens["school_admin"]))
        cur = r.json()
        new_head = {"id": "test-head-1", "name": "TEST_Extra", "amount": 999,
                    "frequency": "Yearly", "grades": ["Grade 10"], "account_id": None}
        payload = {
            "fee_heads": cur["fee_heads"] + [new_head],
            "scholarships": cur.get("scholarships", []),
            "early_bird_discount": cur.get("early_bird_discount", 0),
            "late_fee": cur.get("late_fee", 0),
            "published": True,
        }
        r2 = requests.post(f"{API}/fees/structure", json=payload, headers=_hdr(tokens["school_admin"]))
        assert r2.status_code == 200
        # Verify persistence
        r3 = requests.get(f"{API}/fees/structure", headers=_hdr(tokens["school_admin"]))
        names = [h["name"] for h in r3.json()["fee_heads"]]
        assert "TEST_Extra" in names
        # Cleanup - remove test head
        cleaned = [h for h in r3.json()["fee_heads"] if h["name"] != "TEST_Extra"]
        payload["fee_heads"] = cleaned
        requests.post(f"{API}/fees/structure", json=payload, headers=_hdr(tokens["school_admin"]))


# ---- AI parse-excel ----
class TestFeeParse:
    def test_parse_csv(self, tokens):
        csv_content = "Fee Name,Amount,Frequency,Grades\nTuition Fee,100000,Yearly,Grade 9;Grade 10\nLab Fee,5000,Yearly,Grade 10\nTransport,20000,Quarterly,Grade 10\n"
        files = {"file": ("fees.csv", csv_content.encode(), "text/csv")}
        r = requests.post(f"{API}/fees/parse-excel", files=files, headers=_hdr(tokens["school_admin"]), timeout=90)
        assert r.status_code == 200, r.text
        d = r.json()
        assert "fee_heads" in d
        assert isinstance(d["fee_heads"], list)
        assert len(d["fee_heads"]) >= 1
        # spot check first fee head shape
        h0 = d["fee_heads"][0]
        assert "name" in h0 and "amount" in h0


# ---- Students ----
class TestStudents:
    def test_list_students(self, tokens):
        r = requests.get(f"{API}/students", headers=_hdr(tokens["school_admin"]))
        assert r.status_code == 200
        arr = r.json()
        assert any(s["name"] == "Aarav Sharma" for s in arr)

    def test_add_student(self, tokens):
        import uuid as _u
        payload = {"name": f"TEST_Student_{_u.uuid4().hex[:5]}", "grade": "Grade 9",
                   "program": "", "parent_email": "", "roll_no": "T-9999"}
        r = requests.post(f"{API}/students", json=payload, headers=_hdr(tokens["school_admin"]))
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["name"] == payload["name"]
        assert "id" in d


# ---- School onboarding ----
class TestOnboarding:
    def test_get_school(self, tokens):
        r = requests.get(f"{API}/school", headers=_hdr(tokens["school_admin"]))
        assert r.status_code == 200
        d = r.json()
        assert d["name"] == "Horizon International School"

    def test_upsert_and_onboarding(self, tokens):
        r = requests.post(f"{API}/school",
                          json={"name": "Horizon International School", "type": "School",
                                "spoc_name": "Meera Iyer", "spoc_email": "meera@horizon.edu",
                                "phone": "+91 98765 43210", "address": "Bandra West, Mumbai"},
                          headers=_hdr(tokens["school_admin"]))
        assert r.status_code == 200
        r2 = requests.post(f"{API}/school/onboarding",
                           json={"campuses": [{"id": "c1", "name": "Main", "city": "Mumbai"}],
                                 "courses": [{"id": "co1", "name": "Grade 10", "duration": "1 yr"}],
                                 "team": [], "multi_account_enabled": False,
                                 "settlement_accounts": [], "complete": True},
                           headers=_hdr(tokens["school_admin"]))
        assert r2.status_code == 200
        assert r2.json()["onboarding_complete"] is True


# ---- Parent journey ----
class TestParent:
    def test_children(self, tokens):
        r = requests.get(f"{API}/parent/children", headers=_hdr(tokens["parent"]))
        assert r.status_code == 200
        arr = r.json()
        assert any(s["name"] == "Aarav Sharma" for s in arr), f"got {arr}"

    def _aarav_id(self, tokens):
        r = requests.get(f"{API}/parent/children", headers=_hdr(tokens["parent"]))
        return next(s["id"] for s in r.json() if s["name"] == "Aarav Sharma")

    def test_fees_and_pay(self, tokens):
        sid = self._aarav_id(tokens)
        r = requests.get(f"{API}/parent/fees/{sid}", headers=_hdr(tokens["parent"]))
        assert r.status_code == 200
        d = r.json()
        assert d["academic_year"]
        items = d["items"]
        assert len(items) > 0
        # pick one unpaid
        unpaid = [i for i in items if not i["paid"]]
        assert unpaid, "no unpaid items"
        pay = requests.post(f"{API}/parent/pay",
                            json={"student_id": sid, "fee_head_ids": [unpaid[0]["fee_head_id"]], "mode": "UPI"},
                            headers=_hdr(tokens["parent"]))
        assert pay.status_code == 200, pay.text
        p = pay.json()
        assert p["status"] == "success"
        assert p["receipt_no"].startswith("BLP-")
        assert p["gst"] > 0
        # refresh -> that item now paid
        r2 = requests.get(f"{API}/parent/fees/{sid}", headers=_hdr(tokens["parent"]))
        items2 = r2.json()["items"]
        assert any(i["fee_head_id"] == unpaid[0]["fee_head_id"] and i["paid"] for i in items2)

    def test_financing_preview_and_pay(self, tokens):
        r = requests.post(f"{API}/parent/financing/preview",
                          json={"amount": 60000, "down_payment": 6000, "tenure": 6},
                          headers=_hdr(tokens["parent"]))
        assert r.status_code == 200
        d = r.json()
        assert d["tenure"] == 6
        assert len(d["schedule"]) == 6
        assert d["emi"] > 0

        sid = self._aarav_id(tokens)
        fees = requests.get(f"{API}/parent/fees/{sid}", headers=_hdr(tokens["parent"])).json()
        unpaid = [i for i in fees["items"] if not i["paid"]]
        if unpaid:
            r2 = requests.post(f"{API}/parent/pay-financing",
                               json={"student_id": sid, "fee_head_ids": [unpaid[0]["fee_head_id"]], "mode": "Financing (EMI)"},
                               headers=_hdr(tokens["parent"]))
            assert r2.status_code == 200, r2.text
            assert r2.json()["financing"] is True

    def test_payment_history(self, tokens):
        sid = self._aarav_id(tokens)
        r = requests.get(f"{API}/parent/payments/{sid}", headers=_hdr(tokens["parent"]))
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_parent_cannot_access_other_student(self, tokens):
        # get any student that isn't parent's
        r = requests.get(f"{API}/students", headers=_hdr(tokens["school_admin"]))
        others = [s for s in r.json() if s.get("parent_id") is None]
        if others:
            r2 = requests.get(f"{API}/parent/fees/{others[0]['id']}", headers=_hdr(tokens["parent"]))
            assert r2.status_code == 403
