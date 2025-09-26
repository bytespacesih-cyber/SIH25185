import google.generativeai as genai

genai.configure(api_key="AIzaSyAwqHR38Sxpaf01ouX43smUKuMzE7RGcTI")

# Convert generator to list
available_models = list(genai.list_models())

# Print model names
for m in available_models:
    print(m.name)
