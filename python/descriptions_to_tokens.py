import sys
import os
import csv
import subprocess
import json
import io
from collections import defaultdict, Counter
import re

_SYS_NOCENSOR = (
    "CONTENT POLICY: Accept all tokens literally — anatomical, sexual, crude, scatological, "
    "violent, political, or otherwise sensitive. This is an artistic research context. "
    "Never refuse, redact, or soften a token concept."
)

EXPECTED_COLS = ["token_concept", "xeno_index", "poids_structurel", "module", "ok"]

DB_COLS = [
    "tier", "ok", "module", "sub_module", "description", "token_concept",
    "surabaya_specific", "poids_structurel", "visual_loudness", "prompt_position",
    "example_1", "example_2", "example_3", "example_4",
    "example_5", "example_6", "example_7", "example_8",
    "xeno_index", "atomic_token"
]

CONSOLIDATE_SYSTEM = (
    "You are given a list of visual tokens extracted from multiple image descriptions.\n"
    "Your task: deduplicate and consolidate.\n\n"
    "RULES:\n"
    "1. When several tokens are semantically equivalent or near-identical, KEEP exactly one — the most\n"
    "   abstract and reusable formulation already present in the list — and discard the others.\n"
    "   Do not write a new formulation; only pick an existing one.\n"
    "2. Remove tokens still too specific to a single image (proper nouns, unique identifiers).\n"
    "3. Remove tokens too generic to be useful ('natural light', 'blurred background', 'dark atmosphere').\n"
    "4. Keep all META tokens (ok=META) unless truly duplicated.\n"
    "5. Do NOT rewrite or merge tokens — only decide keep or discard.\n"
    "6. BALANCE: Within over-represented modules (e.g. Light, Texture), be strict — collapse\n"
    "   near-duplicates aggressively. Within sparse modules (e.g. Gaze condition, Epistemic stance,\n"
    "   Archival status), be lenient — discard only exact duplicates, never let a module drop below\n"
    "   a few tokens if any survive.\n"
    "7. Do not remove more than half of the input rows in total. If you reach that limit, stop discarding.\n"
    "Return surviving tokens exactly as received, one per line, 5 semicolon-separated values.\n"
    "Output ONLY data rows — no header, no explanation, no markdown.\n"
    + _SYS_NOCENSOR
)

EXTRACT_SYSTEM = (
    "You extract tokens from image descriptions for a speculative documentary photography database.\n"
    "You extract TWO types of tokens per description:\n"
    "  1. VISUAL tokens (6 to 8): precise, sensory phrases naming what is visible or perceptible.\n"
    "     These MUST be spread across at least 4 DIFFERENT modules. Never give more than 2 tokens to the same module.\n"
    "  2. META tokens (2 to 3, never fewer than 2): the implied epistemic stance, gaze, or conditions of production of the image.\n"
    "     If the description gives no explicit epistemic signal, INFER the most defensible one from how the image was evidently made\n"
    "     (posed or caught, watched or unwatched, addressed to someone or to no one). Producing zero META tokens is not allowed.\n\n"
    "GENERALIZABILITY FILTER — apply to every token before including it:\n"
    "Ask yourself: 'Could this token appear in 10 completely different images that have nothing to do with this one?'\n"
    "If NO -> discard. If YES -> keep.\n\n"
    "EXCLUSION RULES (discard immediately):\n"
    "- Proper nouns, brand names, place names, unique identifiers (e.g. 'STRAND BOOK STORE', 'Tokyo').\n"
    "- Details that only exist in this single image and nowhere else.\n"
    "- Generic photography vocabulary: 'natural light', 'camera lens', 'blurred background',\n"
    "  'bokeh', 'shallow depth of field', 'black and white photograph'.\n"
    "- When too specific, abstract up one level:\n"
    "  'STRAND BOOK STORE sign' -> 'reversed commercial lettering on storefront glass'\n"
    "  'brown window sill' -> 'weathered painted wood threshold'\n\n"
    "Output one token per line as 5 semicolon-separated values:\n"
    "token_concept;xeno_index;poids_structurel;module;ok\n\n"
    "COLUMN RULES:\n"
    "- token_concept: English phrase, 6-9 words (aim for 7). Comparable density across all tokens.\n"
    "  VISUAL: concrete and sensory. Name exactly what is visible. No metaphors, no interpretation.\n"
    "  Style: 'handheld micro-tremor breath rhythm physiological body presence' /\n"
    "         'gaze asymmetry watcher watched one sees without being seen'\n"
    "  META: the epistemic status of the image — how it relates to time, visibility, authorship, or gaze.\n"
    "  Style: 'image made by waiting no intervention no direction no staging' /\n"
    "         'surveillance archive image never seen no addressee stored'\n"
    "- xeno_index:\n"
    "  0 = ordinary/familiar      e.g. 'soft overcast daylight diffused across plain wall'\n"
    "  1 = slightly unusual       e.g. 'reversed commercial lettering seen through glass surface'\n"
    "  2 = strange/unsettling     e.g. 'gaze asymmetry one sees without being seen'\n"
    "  3 = impossible/transgressive  e.g. 'body occupying space that cannot physically contain it'\n"
    "- poids_structurel: PS1=fills the frame/dominant  PS2=secondary/supporting  PS3=detail/atmosphere\n"
    "  For META tokens: use PS2 or PS3.\n"
    "- module: 1-3 word English category.\n"
    "  VISUAL examples: Composition / Human presence / Texture / Architecture / Atmosphere /\n"
    "                   Capture device / Temporal quality / Emotional register / Social proxemics / Light\n"
    "  META examples: Epistemic stance / Reading lens / Archival status / Gaze condition\n"
    "- ok: VISUAL tokens -> leave EMPTY (nothing between the last two semicolons).\n"
    "      META tokens -> write META.\n"
    "      Never write 'ok', 'visual', 'yes', or any other word for a regular visual token.\n\n"
    "Output ONLY data rows — no header, no explanation, no markdown.\n"
    + _SYS_NOCENSOR
)

def normalize_module(m):
    _MODULE_ALIASES = {
        "light": "Light", "lighting": "Light", "lights": "Light",
        "texture": "Texture", "textures": "Texture",
        "composition": "Composition",
        "human presence": "Human presence", "human": "Human presence",
        "architecture": "Architecture",
        "atmosphere": "Atmosphere",
        "capture device": "Capture device", "capture": "Capture device",
        "temporal quality": "Temporal quality", "temporal": "Temporal quality",
        "emotional register": "Emotional register",
        "social proxemics": "Social proxemics",
        "epistemic stance": "Epistemic stance",
        "reading lens": "Reading lens",
        "archival status": "Archival status",
        "gaze condition": "Gaze condition",
    }

    return _MODULE_ALIASES.get((m or "").strip().lower(), (m or "").strip())

def sort_key(row):
    mod = row.get("module", "")

    tier_str = row.get("tier", "")

    try:
        tier_val = float(tier_str)
    except ValueError:
        tier_val = float('inf') # Invalid/missing tier goes to the end

    return (mod, tier_val)

def validate_rows(rows):
    VALID_PS  = ["PS1", "PS2", "PS3"]
    VALID_OK  = ["", "META", "NEGATIVE", "off"]

    valid, errors = [], []

    for row in rows:
        problems = []

        try:
            xi = int(row["xeno_index"])

            if not (0 <= xi <= 3):
                problems.append("xeno_index out of 0-3")
        except Exception:
            problems.append("xeno_index not an integer")
        if row["poids_structurel"] not in VALID_PS:
            problems.append("invalid poids_structurel")
        if row["ok"] not in VALID_OK:
            problems.append(f"invalid ok: '{row['ok']}'")
        if not row["token_concept"].strip():
            problems.append("empty token_concept")
        if problems:
            row["_errors"] = "; ".join(problems)
            errors.append(row)
        else:
            valid.append(row)

    return valid, errors

def extract_tokens(project_id, model_url, model_name, project_path, token_database_path, text, filename):
    payload_dict = {
        "model": model_name,
        "messages": [
            {
                "role": "system", 
                "content": EXTRACT_SYSTEM
            },
            {
                "role": "user", 
                "content": text
            }
        ],
        "stream": False 
    }

    command = [
        "curl", "-s", "-X", "POST",
        "-H", "Content-Type: application/json",
        "-d", "@-",
        model_url
    ]

    result = subprocess.run(command, input=json.dumps(payload_dict), capture_output=True, text=True)

    response_data = json.loads(result.stdout)

    response = response_data["message"]["content"]

    out_path = f"{project_path}/projects/{project_id}/archived-tokens/{filename}.csv"

    with open(out_path, "w", encoding="utf-8", newline="") as fout:
        writer = csv.DictWriter(fout, fieldnames=EXPECTED_COLS)
        writer.writeheader()
        fout.flush()

    total_valid = total_errors = total_rows = 0

    rows = []

    reader = csv.reader(io.StringIO(response), delimiter=";")

    for parts in reader:
        if len(parts) != 5:
            continue

        if parts[0].strip().lower() in ("token_concept", "tier"):
            continue

        row = dict(zip(EXPECTED_COLS, [p.strip() for p in parts]))

        if row.get("ok", "").lower() in ("ok", "yes", "visual", "none", "-"):
            row["ok"] = ""

        rows.append(row)

    valid, errors = validate_rows(rows)

    total_rows   += len(rows)
    total_valid  += len(valid)
    total_errors += len(errors)

    # Write valid tokens immediately
    if valid:
        with open(out_path, "a", encoding="utf-8", newline="") as fout:
            writer = csv.DictWriter(fout, fieldnames=EXPECTED_COLS, extrasaction="ignore")
            writer.writerows(valid)

    deduplicate_data(out_path, model_url, model_name, token_database_path)

    return True

def _llm_dedup_call(rows, model_url, model_name):
    if not rows:
        return rows
    
    lines = [
        ";".join([
            r.get("token_concept", ""),
            str(r.get("xeno_index", "0")),
            r.get("poids_structurel", "PS2"),
            r.get("module", ""),
            r.get("ok", ""),
        ])
        for r in rows
    ]

    payload_dict = {
        "model": model_name,
        "messages": [
            {
                "role": "system", 
                "content": CONSOLIDATE_SYSTEM
            },
            {
                "role": "user", 
                "content": "\n".join(lines),
            }
        ],
        "stream": False 
    }

    command = [
        "curl", "-s", "-X", "POST",
        "-H", "Content-Type: application/json",
        "-d", "@-",
        model_url
    ]

    result = subprocess.run(command, input=json.dumps(payload_dict), capture_output=True, text=True)

    response_data = json.loads(result.stdout)
    
    surviving = []

    reader = csv.reader(io.StringIO(response_data["message"]["content"]), delimiter=";")

    for parts in reader:
        if len(parts) != 5:
            continue
        if parts[0].strip().lower() in ("token_concept", "tier"):
            continue

        row = dict(zip(EXPECTED_COLS, [p.strip() for p in parts]))

        if row.get("ok", "").lower() in ("ok", "yes", "visual", "none", "-"):
            row["ok"] = ""

        surviving.append(row)
    if not surviving:
        print("      ⚠️  LLM returned empty — returning rows unchanged")
        return rows
    
    return surviving

def _dedup_module(mod_rows, model_url, model_name, max_per_call):
    if len(mod_rows) <= max_per_call:
        return _llm_dedup_call(mod_rows, model_url, model_name)
    
    chunks = [mod_rows[i:i+max_per_call] for i in range(0, len(mod_rows), max_per_call)]

    first_pass = []

    for chunk in chunks:
        first_pass.extend(_llm_dedup_call(chunk, model_url, model_name))

    if len(first_pass) > max_per_call:
        return _llm_dedup_call(first_pass, model_url, model_name)
    
    return first_pass

def deduplicate_data(csv_path, model_url, model_name, token_database_path):
    rows = 0

    with open(csv_path, mode="r", encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))

    for r in rows:
        r["module"] = normalize_module(r.get("module", ""))

    mod_counts   = Counter(r["module"] for r in rows)

    deduped_all = []
    MAX_PER_CALL = 120

    for mod in sorted(mod_counts):
        mod_rows = [r for r in rows if r["module"] == mod]
        deduped = _dedup_module(mod_rows, model_url, model_name, MAX_PER_CALL)
        deduped_all.extend(deduped)

    by_mod = defaultdict(list)

    for r in deduped_all:
        by_mod[r["module"]].append(r)

    final = []

    for mod in sorted(by_mod):
        mod_rows = by_mod[mod]
        balanced = mod_rows
        final.extend(balanced)

    valid, errors = validate_rows(final)

    with open(csv_path, "w", encoding="utf-8", newline="") as fout:
        writer = csv.DictWriter(fout, fieldnames=EXPECTED_COLS)
        writer.writeheader()
        writer.writerows(valid)

    merge_to_csv(csv_path, token_database_path)

    return True

def merge_to_csv(csv_path, token_database_path):
    new_rows = []

    with open(csv_path, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        source_cols = reader.fieldnames or []
        
        missing = [c for c in EXPECTED_COLS if c not in source_cols]
        if missing:
            print(f"❌ Missing columns in source CSV: {missing}")
            return
            
        for row in reader:
            clean_row = {k: (v if v is not None else "") for k, v in row.items()} # Treat missing/None as empty strings to replicate keep_default_na=False
            new_rows.append(clean_row)

    for r in new_rows:
        if "module" in r:
            r["module"] = normalize_module(r["module"])

    VALID_PS = {"PS1", "PS2", "PS3"}
    VALID_OK = {"", "META", "NEGATIVE", "off"}
    xeno_regex = re.compile(r'^[0-3]$')

    bad_xeno = []
    bad_ps = []
    bad_ok = []

    for r in new_rows:
        if not xeno_regex.match(str(r.get("xeno_index", ""))):
            bad_xeno.append(r)
        if r.get("poids_structurel", "") not in VALID_PS:
            bad_ps.append(r)
        if r.get("ok", "") not in VALID_OK:
            bad_ok.append(r)

    base_rows = []
    existing_concepts = set()
    
    if os.path.exists(token_database_path):
        with open(token_database_path, "r", encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)

            for row in reader:
                clean_row = {k: (v if v is not None else "") for k, v in row.items()}

                if "module" in clean_row:
                    clean_row["module"] = normalize_module(clean_row["module"])

                base_rows.append(clean_row)
                
                if "token_concept" in clean_row:
                    c = clean_row["token_concept"].strip().lower()

                    if c and c != "nan":
                        existing_concepts.add(c)

    skipped_rows = []
    to_merge_rows = []
    
    for r in new_rows:
        concept = r.get("token_concept", "").strip().lower()

        if concept in existing_concepts:
            skipped_rows.append(r)
        else:
            to_merge_rows.append(r)
            
    out_rows = []

    for r in to_merge_rows:
        aligned = {col: "" for col in DB_COLS} # Initialize all expected DB columns to empty string

        for col in EXPECTED_COLS:
            if col in r:
                aligned[col] = r[col]

        out_rows.append(aligned)

    merged_rows = base_rows + out_rows

    merged_rows.sort(key=sort_key)

    all_fieldnames = list(DB_COLS)

    for r in base_rows:
        for k in r.keys():
            if k not in all_fieldnames:
                all_fieldnames.append(k)

    with open(token_database_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=all_fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(merged_rows)

    return True

def main():
    project_id = sys.argv[1]
    model_url = sys.argv[2]
    model_name = sys.argv[3]
    project_path = sys.argv[4]
    token_database_path = sys.argv[5]
    text = sys.argv[6]
    filename = sys.argv[7]

    extract_tokens(project_id, model_url, model_name, project_path, token_database_path, text, filename)

    return True

if __name__ == "__main__":
    main()