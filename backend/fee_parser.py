import os
import io
import json
import pandas as pd
from emergentintegrations.llm.chat import LlmChat, UserMessage

FREQUENCIES = ["Yearly", "Half-Yearly", "Quarterly", "Monthly", "One-Time"]


async def parse_fee_file(file_bytes: bytes, filename: str):
    """Read an uploaded Excel/CSV fee sheet and use the LLM to normalise it
    into structured fee heads."""
    name = (filename or "").lower()
    if name.endswith(".csv"):
        df = pd.read_csv(io.BytesIO(file_bytes))
    else:
        df = pd.read_excel(io.BytesIO(file_bytes))

    csv_text = df.to_csv(index=False)

    system = (
        "You are a fee-structure parser for a school ERP. You convert messy fee "
        "sheets into clean structured JSON. Only output valid JSON, no prose."
    )
    prompt = (
        "Below is a fee sheet exported to CSV. Convert it into a JSON object with a "
        "single key 'fee_heads' which is an array. Each item must have: "
        "name (string), amount (number, no currency symbols/commas), "
        f"frequency (one of {FREQUENCIES}), and grades (array of grade/class names as strings; "
        "if the sheet applies to all classes use an empty array). "
        "Infer the frequency sensibly (Admission/Registration are usually One-Time, "
        "Tuition usually Yearly). Return ONLY the JSON.\n\nCSV:\n" + csv_text
    )

    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id="fee-parse",
        system_message=system,
    ).with_model("openai", "gpt-5.4")

    resp = await chat.send_message(UserMessage(text=prompt))
    text = resp if isinstance(resp, str) else str(resp)

    # Extract JSON object from the response
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("Could not parse fee structure from file")
    data = json.loads(text[start:end + 1])
    heads = data.get("fee_heads", [])

    cleaned = []
    for h in heads:
        freq = h.get("frequency", "Yearly")
        if freq not in FREQUENCIES:
            freq = "Yearly"
        try:
            amount = float(str(h.get("amount", 0)).replace(",", "").replace("₹", "").strip())
        except (ValueError, TypeError):
            amount = 0.0
        cleaned.append({
            "name": str(h.get("name", "Fee")).strip(),
            "amount": amount,
            "frequency": freq,
            "grades": [str(g).strip() for g in h.get("grades", []) if str(g).strip()],
        })
    return cleaned
