rem Set the API key value
if not defined CIVITAI_API_KEY (
  set CIVITAI_API_KEY=your_api_key_here
)

call venv\Scripts\activate

rem Start the Python application
python app.py