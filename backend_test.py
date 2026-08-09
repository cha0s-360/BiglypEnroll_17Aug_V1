"""
BiglypEnroll - EMI Tenure Range Testing (3-12 months)
Tests the updated fee financing endpoint after widening tenure from 6-12 to 3-12 months.
"""
import os
import requests
import math

# Use the production URL from frontend/.env
BASE_URL = "https://10db0f4d-d2bd-460a-9c67-4584cd88920f.preview.emergentagent.com"
API = f"{BASE_URL}/api"

# Test credentials from test_credentials.md
PARENT_EMAIL = "parent@biglyp.com"
PARENT_PASSWORD = "parent123"


def login(email, password):
    """Login and return bearer token."""
    r = requests.post(f"{API}/auth/login", json={"email": email, "password": password}, timeout=20)
    if r.status_code != 200:
        raise Exception(f"Login failed for {email}: {r.status_code} {r.text}")
    return r.json()["token"]


def auth_header(token):
    """Return Authorization header with bearer token."""
    return {"Authorization": f"Bearer {token}"}


def test_financing_preview(token, amount, down_payment, tenure, expected_tenure, description):
    """
    Test /api/parent/financing/preview endpoint.
    
    Args:
        token: Bearer token
        amount: Total amount
        down_payment: Down payment amount
        tenure: Requested tenure in months
        expected_tenure: Expected tenure after clamping (3-12)
        description: Test description
    """
    print(f"\n{'='*80}")
    print(f"TEST: {description}")
    print(f"{'='*80}")
    print(f"Input: amount={amount}, down_payment={down_payment}, tenure={tenure}")
    
    r = requests.post(
        f"{API}/parent/financing/preview",
        json={"amount": amount, "down_payment": down_payment, "tenure": tenure},
        headers=auth_header(token),
        timeout=20
    )
    
    if r.status_code != 200:
        print(f"❌ FAILED: HTTP {r.status_code}")
        print(f"Response: {r.text}")
        return False
    
    data = r.json()
    print(f"Response: {data}")
    
    # Calculate expected values
    expected_financed = amount - down_payment
    expected_emi = math.ceil(expected_financed / expected_tenure) if expected_tenure else 0
    expected_schedule_length = expected_tenure
    
    # Validate response
    errors = []
    
    if data.get("tenure") != expected_tenure:
        errors.append(f"tenure: expected {expected_tenure}, got {data.get('tenure')}")
    
    if data.get("financed_amount") != expected_financed:
        errors.append(f"financed_amount: expected {expected_financed}, got {data.get('financed_amount')}")
    
    if data.get("emi") != expected_emi:
        errors.append(f"emi: expected {expected_emi}, got {data.get('emi')}")
    
    if len(data.get("schedule", [])) != expected_schedule_length:
        errors.append(f"schedule length: expected {expected_schedule_length}, got {len(data.get('schedule', []))}")
    
    if data.get("interest") != "0%":
        errors.append(f"interest: expected '0%', got {data.get('interest')}")
    
    if data.get("down_payment") != down_payment:
        errors.append(f"down_payment: expected {down_payment}, got {data.get('down_payment')}")
    
    if errors:
        print(f"❌ FAILED:")
        for error in errors:
            print(f"  - {error}")
        return False
    else:
        print(f"✅ PASSED")
        print(f"  - tenure: {data['tenure']} (clamped from {tenure})")
        print(f"  - financed_amount: {data['financed_amount']}")
        print(f"  - emi: {data['emi']}")
        print(f"  - schedule length: {len(data['schedule'])}")
        print(f"  - interest: {data['interest']}")
        return True


def test_parent_flow(token):
    """
    Smoke test the parent flow:
    1. GET /api/parent/children - should return at least 1 child
    2. GET /api/parent/fees/{student_id} - should return fee items
    3. POST /api/parent/pay-financing - should create financing receipt
    """
    print(f"\n{'='*80}")
    print(f"SMOKE TEST: Parent Flow")
    print(f"{'='*80}")
    
    # 1. Get children
    print("\n1. GET /api/parent/children")
    r = requests.get(f"{API}/parent/children", headers=auth_header(token), timeout=20)
    if r.status_code != 200:
        print(f"❌ FAILED: HTTP {r.status_code}")
        print(f"Response: {r.text}")
        return False
    
    children = r.json()
    if not children:
        print(f"❌ FAILED: No children found for parent")
        return False
    
    print(f"✅ PASSED: Found {len(children)} child(ren)")
    for child in children:
        print(f"  - {child['name']} (ID: {child['id']}, Grade: {child.get('grade', 'N/A')})")
    
    student_id = children[0]["id"]
    
    # 2. Get fees for first child
    print(f"\n2. GET /api/parent/fees/{student_id}")
    r = requests.get(f"{API}/parent/fees/{student_id}", headers=auth_header(token), timeout=20)
    if r.status_code != 200:
        print(f"❌ FAILED: HTTP {r.status_code}")
        print(f"Response: {r.text}")
        return False
    
    fees_data = r.json()
    items = fees_data.get("items", [])
    if not items:
        print(f"❌ FAILED: No fee items found")
        return False
    
    print(f"✅ PASSED: Found {len(items)} fee item(s)")
    for item in items:
        status = "PAID" if item.get("paid") else "UNPAID"
        print(f"  - {item['name']}: ₹{item['amount']} ({item['frequency']}) [{status}]")
    
    # Find an unpaid fee head
    unpaid_items = [item for item in items if not item.get("paid")]
    if not unpaid_items:
        print(f"⚠️  WARNING: All fees already paid, skipping pay-financing test")
        return True
    
    fee_head_id = unpaid_items[0]["fee_head_id"]
    
    # 3. Pay with financing
    print(f"\n3. POST /api/parent/pay-financing")
    print(f"   Paying fee_head_id: {fee_head_id} ({unpaid_items[0]['name']})")
    r = requests.post(
        f"{API}/parent/pay-financing",
        json={"student_id": student_id, "fee_head_ids": [fee_head_id]},
        headers=auth_header(token),
        timeout=20
    )
    
    if r.status_code != 200:
        print(f"❌ FAILED: HTTP {r.status_code}")
        print(f"Response: {r.text}")
        return False
    
    receipt = r.json()
    
    # Validate receipt
    errors = []
    if receipt.get("mode") != "Financing (EMI)":
        errors.append(f"mode: expected 'Financing (EMI)', got {receipt.get('mode')}")
    
    if receipt.get("financing") != True:
        errors.append(f"financing: expected True, got {receipt.get('financing')}")
    
    if not receipt.get("receipt_no"):
        errors.append(f"receipt_no: missing")
    
    if receipt.get("status") != "success":
        errors.append(f"status: expected 'success', got {receipt.get('status')}")
    
    if errors:
        print(f"❌ FAILED:")
        for error in errors:
            print(f"  - {error}")
        return False
    else:
        print(f"✅ PASSED")
        print(f"  - receipt_no: {receipt['receipt_no']}")
        print(f"  - mode: {receipt['mode']}")
        print(f"  - financing: {receipt['financing']}")
        print(f"  - amount: ₹{receipt['amount']}")
        print(f"  - status: {receipt['status']}")
        return True


def main():
    """Run all tests."""
    print("="*80)
    print("BiglypEnroll - EMI Tenure Range Testing (3-12 months)")
    print("="*80)
    
    # Login
    print("\nAuthenticating as parent@biglyp.com...")
    try:
        token = login(PARENT_EMAIL, PARENT_PASSWORD)
        print("✅ Authentication successful")
    except Exception as e:
        print(f"❌ Authentication failed: {e}")
        return
    
    # Test cases for financing preview
    test_cases = [
        {
            "amount": 100000,
            "down_payment": 0,
            "tenure": 3,
            "expected_tenure": 3,
            "description": "tenure=3, amount=100000, down_payment=0 (minimum tenure)"
        },
        {
            "amount": 100000,
            "down_payment": 0,
            "tenure": 2,
            "expected_tenure": 3,
            "description": "tenure=2 (should clamp to minimum 3)"
        },
        {
            "amount": 120000,
            "down_payment": 20000,
            "tenure": 12,
            "expected_tenure": 12,
            "description": "tenure=12, amount=120000, down_payment=20000 (maximum tenure)"
        },
        {
            "amount": 120000,
            "down_payment": 20000,
            "tenure": 13,
            "expected_tenure": 12,
            "description": "tenure=13 (should clamp to maximum 12)"
        },
        {
            "amount": 90000,
            "down_payment": 10000,
            "tenure": 6,
            "expected_tenure": 6,
            "description": "tenure=6, amount=90000, down_payment=10000 (mid-range tenure)"
        }
    ]
    
    results = []
    
    # Run financing preview tests
    for test_case in test_cases:
        result = test_financing_preview(
            token,
            test_case["amount"],
            test_case["down_payment"],
            test_case["tenure"],
            test_case["expected_tenure"],
            test_case["description"]
        )
        results.append((test_case["description"], result))
    
    # Run parent flow smoke test
    parent_flow_result = test_parent_flow(token)
    results.append(("Parent flow smoke test", parent_flow_result))
    
    # Summary
    print(f"\n{'='*80}")
    print("TEST SUMMARY")
    print(f"{'='*80}")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for description, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {description}")
    
    print(f"\n{passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")


if __name__ == "__main__":
    main()
