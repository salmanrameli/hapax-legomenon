import random
import csv
import sys

def main():
    csv_path = sys.argv[1]
    xeno_min = sys.argv[2]

    tokens = []
    all_ok = set()

    concept = ""

    try:
        with open(csv_path, encoding='utf-8') as f:
            for row in csv.DictReader(f):
                ok = row.get('ok', '').strip()
                all_ok.add(ok)
                is_meta = (ok.upper() == 'META')

                if (is_meta and ok not in ('off',) and int(row.get('xeno_index') or 0) >= int(xeno_min)):
                    tokens.append(row['token_concept'].strip())
    except Exception as e:
        return concept
    
    if tokens:
        concept = random.choice(tokens)

    print(concept)

    return concept

if __name__ == "__main__":
    main()