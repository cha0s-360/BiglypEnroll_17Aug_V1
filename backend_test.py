#!/usr/bin/env python3
"""
BiglypEnroll Backend Testing - verify-account, grade migration, settlement persistence
"""
import requests
import json

# Backend URL from frontend/.env
BASE_URL = "https://enroll-system-21.preview.emergentagent.com/api"

# Test credentials from test_credentials.md
SCHOOL_EMAIL = "school@biglyp.com"
SCHOOL_PASSWORD = "school123"
PARENT_EMAIL = "parent@biglyp.com"
PARENT_PASSWORD = "parent123"

def login(email: str, password: str) -> str:
    """Login and return access token"""
    resp = requests.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
    if resp.status_code != 200:
        raise Exception(f"Login failed for {email}: {resp.status_code} {resp.text}")
    data = resp.json()
    return data.get("token")

def test_verify_account_valid():
    """A1: POST /api/school/verify-account with valid account -> 200 with account_name, bank, verified"""
    print("\n[TEST A1] POST /api/school/verify-account - Valid account")
    token = login(SCHOOL_EMAIL, SCHOOL_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    payload = {"account_number": "912010012345678", "ifsc": "HDFC0001234"}
    resp = requests.post(f"{BASE_URL}/school/verify-account", json=payload, headers=headers)
    
    print(f"  Status: {resp.status_code}")
    print(f"  Response: {resp.text}")
    
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    assert "account_name" in data, "Missing account_name"
    assert isinstance(data["account_name"], str) and len(data["account_name"]) > 0, "account_name must be non-empty string"
    assert "bank" in data, "Missing bank"
    assert "verified" in data, "Missing verified"
    assert data["verified"] is True, "verified must be True"
    
    print(f"  ✅ PASS: account_name='{data['account_name']}', bank='{data['bank']}', verified={data['verified']}")
    return data["account_name"]

def test_verify_account_deterministic():
    """A2: Same input returns SAME account_name (deterministic)"""
    print("\n[TEST A2] POST /api/school/verify-account - Deterministic check")
    token = login(SCHOOL_EMAIL, SCHOOL_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    payload = {"account_number": "912010012345678", "ifsc": "HDFC0001234"}
    
    # First call
    resp1 = requests.post(f"{BASE_URL}/school/verify-account", json=payload, headers=headers)
    assert resp1.status_code == 200
    name1 = resp1.json()["account_name"]
    
    # Second call
    resp2 = requests.post(f"{BASE_URL}/school/verify-account", json=payload, headers=headers)
    assert resp2.status_code == 200
    name2 = resp2.json()["account_name"]
    
    print(f"  First call: account_name='{name1}'")
    print(f"  Second call: account_name='{name2}'")
    
    assert name1 == name2, f"Not deterministic: '{name1}' != '{name2}'"
    print(f"  ✅ PASS: Deterministic - same account_name returned")

def test_verify_account_invalid():
    """A3: Invalid account (short acc/ifsc) -> 400"""
    print("\n[TEST A3] POST /api/school/verify-account - Invalid account")
    token = login(SCHOOL_EMAIL, SCHOOL_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    payload = {"account_number": "123", "ifsc": "HD"}
    resp = requests.post(f"{BASE_URL}/school/verify-account", json=payload, headers=headers)
    
    print(f"  Status: {resp.status_code}")
    print(f"  Response: {resp.text}")
    
    assert resp.status_code == 400, f"Expected 400, got {resp.status_code}"
    print(f"  ✅ PASS: Invalid account correctly rejected with 400")

def test_grade_migration_children():
    """B1: GET /api/parent/children - each child's grade must be 'Class N' format, NOT 'Grade N'"""
    print("\n[TEST B1] GET /api/parent/children - Grade format check")
    token = login(PARENT_EMAIL, PARENT_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    resp = requests.get(f"{BASE_URL}/parent/children", headers=headers)
    print(f"  Status: {resp.status_code}")
    
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    children = resp.json()
    
    print(f"  Found {len(children)} children")
    
    for child in children:
        grade = child.get("grade", "")
        print(f"    - {child.get('name')}: grade='{grade}'")
        
        # Check that grade is NOT in "Grade N" format
        assert not grade.startswith("Grade "), f"Child {child.get('name')} has old format 'Grade N': {grade}"
        
        # Check that grade is in "Class N" format (or LKG/UKG)
        if grade not in ["LKG", "UKG"]:
            assert grade.startswith("Class "), f"Child {child.get('name')} has invalid format: {grade}"
    
    print(f"  ✅ PASS: All children have correct grade format (Class N, not Grade N)")
    return children

def test_grade_migration_fees():
    """B2: GET /api/parent/fees/{child_id} for Sara Sharma - items list non-empty"""
    print("\n[TEST B2] GET /api/parent/fees/{child_id} - Sara Sharma has fee items")
    token = login(PARENT_EMAIL, PARENT_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    # First get children to find Sara Sharma
    resp = requests.get(f"{BASE_URL}/parent/children", headers=headers)
    assert resp.status_code == 200
    children = resp.json()
    
    sara = None
    for child in children:
        if child.get("name") == "Sara Sharma":
            sara = child
            break
    
    assert sara is not None, "Sara Sharma not found in children list"
    print(f"  Found Sara Sharma: id={sara['id']}, grade={sara['grade']}")
    
    # Get fees for Sara
    resp = requests.get(f"{BASE_URL}/parent/fees/{sara['id']}", headers=headers)
    print(f"  Status: {resp.status_code}")
    
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    items = data.get("items", [])
    
    print(f"  Items count: {len(items)}")
    for item in items:
        print(f"    - {item.get('name')}: {item.get('amount')} ({item.get('frequency')}), paid={item.get('paid')}")
    
    assert len(items) > 0, "Sara Sharma should have fee items (compute_pending should work with migrated grades)"
    print(f"  ✅ PASS: Sara Sharma has {len(items)} fee items (compute_pending works with migrated grades)")

def test_grade_migration_courses():
    """B3: GET /api/school - courses list should have LKG, UKG, Class 1..12 (14 entries)"""
    print("\n[TEST B3] GET /api/school - Courses list check")
    token = login(SCHOOL_EMAIL, SCHOOL_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    resp = requests.get(f"{BASE_URL}/school", headers=headers)
    print(f"  Status: {resp.status_code}")
    
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    school = resp.json()
    courses = school.get("courses", [])
    
    print(f"  Courses count: {len(courses)}")
    course_names = [c.get("name") for c in courses]
    print(f"  Course names: {course_names}")
    
    # Expected: LKG, UKG, Class 1, Class 2, ..., Class 12 (14 total)
    expected_courses = ["LKG", "UKG"] + [f"Class {i}" for i in range(1, 13)]
    print(f"  Expected: {expected_courses}")
    
    assert len(courses) == 14, f"Expected 14 courses, got {len(courses)}"
    
    for expected in expected_courses:
        assert expected in course_names, f"Missing course: {expected}"
    
    print(f"  ✅ PASS: All 14 courses present (LKG, UKG, Class 1..12)")

def test_settlement_persistence():
    """C: POST /api/school/onboarding with settlement_accounts, then GET to confirm persistence"""
    print("\n[TEST C] Settlement persistence - POST onboarding + GET school")
    token = login(SCHOOL_EMAIL, SCHOOL_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    # First, get a fee_head_id from /api/fees/structure
    resp = requests.get(f"{BASE_URL}/fees/structure", headers=headers)
    assert resp.status_code == 200, f"Failed to get fee structure: {resp.status_code}"
    fee_structure = resp.json()
    fee_heads = fee_structure.get("fee_heads", [])
    assert len(fee_heads) > 0, "No fee heads found"
    
    fee_head_id = fee_heads[0]["id"]
    print(f"  Using fee_head_id: {fee_head_id} ({fee_heads[0]['name']})")
    
    # POST /api/school/onboarding with settlement_accounts
    onboarding_payload = {
        "multi_account_enabled": True,
        "settlement_accounts": [
            {
                "id": "a1",
                "account_number": "912010012345678",
                "ifsc": "HDFC0001234",
                "account_name": "Horizon International School Trust",
                "fee_head_id": fee_head_id
            }
        ],
        "complete": False
    }
    
    resp = requests.post(f"{BASE_URL}/school/onboarding", json=onboarding_payload, headers=headers)
    print(f"  POST /api/school/onboarding status: {resp.status_code}")
    
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    
    # GET /api/school to confirm persistence
    resp = requests.get(f"{BASE_URL}/school", headers=headers)
    print(f"  GET /api/school status: {resp.status_code}")
    
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    school = resp.json()
    
    settlement_accounts = school.get("settlement_accounts", [])
    print(f"  settlement_accounts count: {len(settlement_accounts)}")
    
    assert len(settlement_accounts) > 0, "settlement_accounts not persisted"
    
    # Check that the account we added is present
    found = False
    for acc in settlement_accounts:
        print(f"    - id={acc.get('id')}, account_number={acc.get('account_number')}, "
              f"ifsc={acc.get('ifsc')}, account_name={acc.get('account_name')}, "
              f"fee_head_id={acc.get('fee_head_id')}")
        
        if acc.get("fee_head_id") == fee_head_id and acc.get("account_name") == "Horizon International School Trust":
            found = True
    
    assert found, f"Settlement account with fee_head_id={fee_head_id} not found in persisted data"
    
    multi_account_enabled = school.get("multi_account_enabled", False)
    print(f"  multi_account_enabled: {multi_account_enabled}")
    assert multi_account_enabled is True, "multi_account_enabled not persisted"
    
    print(f"  ✅ PASS: Settlement accounts persisted with fee_head_id and account_name")

def main():
    print("=" * 80)
    print("BiglypEnroll Backend Testing - verify-account, grade migration, settlement")
    print("=" * 80)
    
    try:
        # A) verify-account (simulated penny-drop)
        print("\n" + "=" * 80)
        print("SECTION A: POST /api/school/verify-account (simulated penny-drop)")
        print("=" * 80)
        test_verify_account_valid()
        test_verify_account_deterministic()
        test_verify_account_invalid()
        
        # B) Grade migration integrity
        print("\n" + "=" * 80)
        print("SECTION B: Grade migration integrity")
        print("=" * 80)
        test_grade_migration_children()
        test_grade_migration_fees()
        test_grade_migration_courses()
        
        # C) Settlement persistence
        print("\n" + "=" * 80)
        print("SECTION C: Settlement persistence")
        print("=" * 80)
        test_settlement_persistence()
        
        print("\n" + "=" * 80)
        print("ALL TESTS PASSED ✅")
        print("=" * 80)
        
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        return 1
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
