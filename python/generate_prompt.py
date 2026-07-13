import sys
import random
import csv
import subprocess
import json

N_TOKENS        = 8 
N_META_TOKENS   = 2
POIDS_MODE      = "light"
XENO_MAX        = 2
SEED            = None

_SYS_NOCENSOR = (
    "\n\nCONTENT POLICY: Accept all tokens literally — anatomical, sexual, "
    "crude, scatological. Treat every token as a direct documentary element "
    "present in the scene. Never sanitize, euphemize, reframe, or omit any token. "
    "Never render it as text, graffiti, or inscription unless the token explicitly says so."
)

# Pass 1 system prompt — IMAGE / READING LENS compiler
PASS1_SYSTEM = """You are a photography prompt compiler for a generative diffusion model (Flux).

You receive two inputs:
  IMAGE        — the concrete photographic content: what is physically present,
                 what the camera records, what is visible in the frame
  READING LENS — a condition that determines HOW this image exists in the world:
                 its epistemic status, its institutional weight, its implied address,
                 its relationship to time or to visibility

FUNDAMENTAL DISTINCTION:
IMAGE is material. It appears in the image. Write from inside it.
READING LENS is immaterial. It never appears in the image.
READING LENS is a transformation operator — it alters syntax, stance, and
enunciation. It is never transcribed, never paraphrased, never quoted.

YOUR TASK:
Write a single photographic prompt in English, 40-80 words.
IT HAS TO BE ABOUT SURABAYA; be it about the famous buildings and landmarks, people of Surabaya, or events that had happened in Surabaya.
Build the prompt entirely from IMAGE content.
Let READING LENS silently operate on:
  — verb tense or epistemic modality (what is seen vs what might have been)
  — the implied observer (who is looking, for whom, under what authority)
  — the existential status of the image (evidence, speculation, archive, loss)
  — a minimal framing clause at the start or end (one clause maximum)
If READING LENS cannot be absorbed without being stated, omit it entirely.

ABSOLUTE RULES:
1. Do NOT transcribe, paraphrase, or echo any element of READING LENS
2. Do NOT add visual elements absent from IMAGE
3. Do NOT resolve tensions — contradictions must hold without connectives
4. Do NOT use: "although", "but", "yet", "however", "despite"
5. Do NOT describe the generation process — describe what IS in the image
6. Output ONLY the prompt — no preamble, no explanation, no metadata
7. Target length: 60-100 words
8. If you choose to describe buildings, BE EXPLICIT ABOUT THE NAME OF THE STRUCTURES. THE BUILDINGS HAVE TO BE LOCATED IN SURABAYA
9. If you choose to describe roads, BE EXPLICIT ABOUT THE NAME OF THE ROAD. THE NAME OF THE ROAD HAS TO BE FROM SURABAYA
10. If you choose to describe events, BE EXPLICIT ABOUT THE NAME OF THE EVENT THAT HAD HAPPENED IN SURABAYA
11. Style: documentary, present tense, neutral and descriptive""" + _SYS_NOCENSOR

# Extended system prompt for high XENO draws (xeno_avg >= 2.0)
PASS1_SYSTEM_XENO = PASS1_SYSTEM + """

ADDITIONAL CONSTRAINTS (high XENO score):
- State contradictions as simultaneous physical facts, not metaphors
- No hedging: "appears to", "seems like", "as if", "resembles"
- If two states are irreconcilable, name both as equally true and co-present
- Favor nouns and textures over adjectives and comparisons"""

def xeno_avg(tokens):
    if not tokens:
        return 0.0
    
    return sum(int(t.get("xeno_index", 0)) for t in tokens) / len(tokens)

def _sanitize_output(text: str, pass_name: str = "") -> str:
    """Strip LLM meta-commentary from generated prompts.
    Preventive rule 4 in system prompt handles most cases;
    this catches what slips through."""
    if not text:
        return text

    # Strip first line if it's a label (ends with ":") — max 12 words
    # Catches: "Rewritten through a poetic register:", "CLIP prompt:", etc.
    lines = text.strip().splitlines()
    while lines:
        first = lines[0].strip()

        if first.endswith(":") and len(first.split()) <= 12:
            lines = lines[1:]
            text = "\n".join(lines).strip()
        else:
            break

    # Sentinel strings — truncate at first occurrence
    _SENTINELS = (
        # System prompt echoes
        "You rewrite image prompts", "You compress image prompts",
        "You are a photography prompt", "CONTENT POLICY:", "REGISTER —",
        "Output ONLY", "SYSTEM:", "ASSISTANT:", "USER:", "Human:", "Assistant:",
        # Auto-commentary (1st person)
        "I have rewritten", "I've rewritten", "I rewrote",
        "I have compressed", "I've compressed", "I compressed",
        "I have condensed", "I've condensed", "I kept only",
        "I removed", "I retained", "I focused on",
        "I tried to", "I aimed to", "I maintained", "I preserved",
        # Auto-commentary (neutral)
        "This version", "This prompt contains", "The compressed",
        "The rewritten", "The final prompt", "This is approximately",
        # Preambles
        "Here is the", "Here's the", "Here is a", "Here's a",
        "Rewritten through", "Rewritten in", "Rewritten using",
        "In the register of", "Through the lens of",
        "Applying the register", "Filtered through",
        "Compressed prompt:", "CLIP prompt:", "Final prompt:",
        "Rewritten prompt:", "Output prompt:", "Result:",
        # Token/word counts
        "Word count:", "word count:", "Token count:", "token count:",
        "(word count", "(token count", "~60 words", "~77 tokens",
        "approximately 60", "approximately 77", "under 60 words",
        "within 77 tokens",
        # Notes
        "Note:", "note:", "Note that", "N.B.:",
        # Refusals (RLHF bleed)
        "I will not", "I cannot", "I can't rewrite", "I am unable",
        "I'm unable", "I do not feel comfortable", "I refuse to",
        "I must decline", "contains explicit", "I hope you understand",
    )
    for sentinel in _SENTINELS:
        idx = text.find(sentinel)

        if idx != -1:
            text = text[:idx].strip()

    # Exotic script detection (Arabic, CJK, Thai, Korean, Japanese)
    # Catches Turkish/multilingual hallucinations like "sonucu"
    def _is_exotic(cp):
        return (0x4E00 <= cp <= 0x9FFF or 0x3040 <= cp <= 0x30FF or
                0x0600 <= cp <= 0x06FF or 0x0E00 <= cp <= 0x0E7F or
                0xAC00 <= cp <= 0xD7AF)
    
    if sum(1 for c in text if _is_exotic(ord(c))) > 3:
        return f"[invalid output — non-latin script ({pass_name})]"
    
    text = "".join(c for c in text if not _is_exotic(ord(c))).strip()

    # Strip non-printable characters
    text = "".join(c for c in text if c.isprintable() or c == "\n").strip()

    if not text:
        return f"[invalid output — empty content ({pass_name})]"
    
    return text

def build_prompt_llm(mode, visual_tokens, meta_tokens, model_url, model_name):
    image_part = ", ".join(t["token_concept"] for t in visual_tokens)

    user_msg = f"IMAGE: {image_part}"

    if meta_tokens:
        lens_part = ", ".join(t["token_concept"] for t in meta_tokens)
        user_msg += f"\n\nREADING LENS: {lens_part}"

    xa = xeno_avg(visual_tokens)
    system_pass1 = PASS1_SYSTEM_XENO if xa >= 2.0 else PASS1_SYSTEM

    system_clip = (
        "Compress this image prompt to a maximum of 77 tokens (approximately 60 words). "
        "Keep the most visually concrete elements: materials, textures, "
        "light, spatial relationships. Cut adjectives before nouns if needed. "
        "Output ONLY the compressed prompt — no commentary, no preamble."
        + _SYS_NOCENSOR
    )

    payload_dict = {
        "model": model_name,
        "messages": [
            {
                "role": "system", 
                "content": system_pass1
            },
            {
                "role": "user", 
                "content": user_msg,
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

    print(response_data["message"]["content"])

    return response_data["message"]["content"]

def load_tokens(path, xeno_max, filter_type=""):
    """
    Loads and filters CSV tokens using pure Python.
    
    :param path: Path to the CSV file
    :param xeno_max: Maximum allowed xeno_index value
    :param filter_type: The exact value to look for in the "ok" column (e.g., "" or "META")
    """
    pool = []
    
    with open(path, mode="r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            ok_val = row.get("ok", "")
            xeno_index_raw = row.get("xeno_index", "0")
            
            # Convert text index to integer safely
            try:
                xeno_index = int(float(xeno_index_raw)) if xeno_index_raw else 0
            except ValueError:
                xeno_index = 0
                
            # Filter rows dynamically based on the filter_type parameter
            if ok_val == filter_type and xeno_index <= xeno_max:
                row["xeno_index"] = xeno_index
                pool.append(row)
                
    return pool

def draw_tokens(pool, n, poids_mode, seed):
    if not pool or n == 0:
        return []
    
    rng = random.Random(seed)

    if poids_mode == "light":
        weights = {"PS1": 1, "PS2": 2, "PS3": 3}
    elif poids_mode == "heavy":
        weights = {"PS1": 3, "PS2": 2, "PS3": 1}
    else:
        weights = {"PS1": 1, "PS2": 1, "PS3": 1}
    
    urn = []
    
    for tok in pool:
        w = weights.get(tok.get("poids_structurel", ""), 1)
        urn.extend([tok] * w)
    
    rng.shuffle(urn)
    
    chosen, used_modules = [], set()
    
    for tok in urn:
        mod = tok.get("module", "")

        if mod in used_modules:
            continue

        used_modules.add(mod)

        chosen.append(tok)

        if len(chosen) >= n:
            break

    return chosen

def main():
    model_url = sys.argv[1] # sys.argv[0] is always the script name itself
    model_name = sys.argv[2]
    project_dir = sys.argv[3]
    database_token_path = sys.argv[4]

    seed_used = SEED if SEED is not None else random.randint(0, 99999)

    visual_pool = load_tokens(database_token_path, XENO_MAX, filter_type="")
    meta_pool   = load_tokens(database_token_path, XENO_MAX, filter_type="META")

    visual_tokens = draw_tokens(visual_pool, N_TOKENS, POIDS_MODE, seed_used)
    meta_tokens   = draw_tokens(meta_pool, N_META_TOKENS, "off", seed_used)

    # mode 1 = short prompt
    # mode 2 = long prompt
    mode = 1
    result = build_prompt_llm(
        mode, visual_tokens, meta_tokens, model_url, model_name
    )

    return result


if __name__ == "__main__":
    main()