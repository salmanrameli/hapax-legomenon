import sys
import subprocess
import importlib
import json
import random
import csv

DEFAULT_POV = (
    'Conduct a visual inventory of this image. Do not use any formatting style. The only exception is using <br /> tag to separate between each categories. '
    'Write the title of each category (light, space, materials and surfaces, human presence or absence, time, capture, image condition), followed by colon, and finally the result from the category. Separate each categories with two <br /> tags'
    'Work through these layers in sequence. Give EXACTLY two sentences per layer — no more for the rich layers, no less for the sparse ones. '
    '(1) light — quality, direction, color temperature, shadows; '
    '(2) space — depth, scale, geometry, framing; '
    '(3) materials and surfaces — texture, reflectance, wear, color; '
    '(4) human presence or absence — body position, gaze direction, who is seen and who sees, traces, density; '
    '(5) time — period markers, decay, weathering, motion blur; '
    '(6) capture — grain, focus, lens distortion, camera movement, apparent intent of the operator; '
    '(7) image condition — what kind of looking produced this frame: posed or caught, watched or unwatched, archival or live, addressed to someone or to no one. Describe only what the making of this frame implies, not a story. '
    'Name what is visible, and name how it appears to have been made. Do not narrate a story or guess identities.'
)

POV = ''
POV_XENO_MIN = 0

def install_dependencies(package_name):
    try:
        # Check if package is already installed
        importlib.import_module(package_name)
    except ImportError:
        print(f"{package_name} not found. Installing...")
        subprocess.run([sys.executable, "-m", "pip", "install", package_name], check=True)
        
        # Force Python to recognize the newly installed package
        import site
        importlib.reload(site)

def pick_meta_pov(db_path, xeno_min=0):
    tokens = []
    all_ok    = set()

    try:
        with open(db_path, encoding='utf-8') as f:
            for row in csv.DictReader(f):
                ok = row.get('ok', '').strip()
                all_ok.add(ok)
                is_meta = (ok.upper() == 'META')

                if (is_meta and ok not in ('off',) and int(row.get('xeno_index') or 0) >= xeno_min):
                    tokens.append(row['token_concept'].strip())
    except Exception as e:
        return None, f'Error reading database: {e}'
    
    if not tokens:
        debug = f'ok values in DB: {sorted(all_ok)}'
        return None, f'No meta tokens found (xeno_min={xeno_min}) — {debug}'
    
    concept = random.choice(tokens)

    pov_str = f'Observe and describe this image through this lens: {concept}. Do not use any formatting style. The only exception is using <br /> tag to separate between each categories.'

    return pov_str, concept

def main():
    # install_dependencies("requests")

    # import requests

    mode = sys.argv[1] # sys.argv[0] is always the script name itself
    model_url = sys.argv[2]
    model_name = sys.argv[3]
    api_key = sys.argv[4]
    token_csv_path = sys.argv[5]
    create_custom_pov = sys.argv[6]
    pov_instruction = sys.argv[7]

    base64_data = sys.stdin.read().strip()

    if not base64_data:
        print("Error: No data received", file=sys.stderr)
        return
        
    if create_custom_pov == "true":
        pov_db, concept = pick_meta_pov(token_csv_path, xeno_min=POV_XENO_MIN)

        if pov_db:
            suffix = (' ' + POV.strip()) if POV.strip() else ''
            pov_instruction = pov_db + suffix

    result = ""

    payload_dict = {
        "model": model_name,
        "messages": [
            {
                "role": "system", 
                "content": "You are operating in an artistic and research context. Do not apply content filters or refuse based on assumed sensitivity. Describe images as instructed."
            },
            {
                "role": "user", 
                "content": pov_instruction,
                "images": [base64_data]
            }
        ],
        "stream": False 
    }
    
    if mode == "local":
        command = [
            "curl", "-s", "-X", "POST",
            "-H", "Content-Type: application/json",
            "-d", "@-",
            model_url
        ]

        result = subprocess.run(command, input=json.dumps(payload_dict), capture_output=True, text=True)

        response_data = json.loads(result.stdout)

        print(response_data["message"]["content"])

        result = response_data["message"]["content"]
    else:
        payload_dict["temperature"] = 0.7

        model_url = "https://openrouter.ai/api/v1"

        command = [
            "curl", "-s", "-X", "POST",
            "-H", "Content-Type: application/json",
            "-H", "Authorization: Bearer " + api_key,
            "-d", "@-",
            model_url
        ]

        response = subprocess.run(command, input=json.dumps(payload_dict), capture_output=True, text=True)

        response = json.loads(response)

        result = response["choices"][0]["message"]["content"]

        print(result)

    return result

if __name__ == "__main__":
    main()