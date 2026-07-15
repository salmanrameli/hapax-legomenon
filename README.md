# About
This is basically a wrapper for Python scripts that I got during Suradaya Photography Workshop 2026. The Python scripts are used to analyze images feed by the user, then extract the result to be stored in a csv file as tokens. These tokens are picked randomly also by LLM to be used as the basis for generating prompt to generate images. 

### Training data
User uploads images -> LLM analyze the images -> LLM processes the result -> application stores the data in CSV file

### Generating image
LLM reads the data in csv -> LLM creates a prompt -> LLM creates the image based on the prompt

At the time of this writing (15 July 2026), this program can only utilize LLM that runs locally using Ollama. In the future hopefully the program can connect to other servers via curl to process the data instead of only relying on local models.
