import sys

def main():
    # sys.argv[0] is always the script name itself
    print(f"Script name: {sys.argv[0]}")
    
    # Access individual arguments passed from Go
    for idx, arg in enumerate(sys.argv[1:], start=1):
        print(f"Argument {idx}: {arg}")

if __name__ == "__main__":
    main()