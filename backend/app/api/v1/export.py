import os
from fastapi import FastAPI, Response, APIRouter
from weasyprint import HTML, CSS
from pathlib import Path

router = APIRouter(prefix='/export')

# Helper to find the absolute path of your files
# This is critical for deployments (like Render) to find the 'static' folder

path = Path(__file__)
BASE_DIR = path.parents[3]
css_file_path = BASE_DIR / "static" / "styles.css"

print(css_file_path)
@router.post("/pdf")
async def export_pdf(data: dict):
    html_content = data.get('html', '')
    
    # 1. Locate your styles.css file

    # 2. Build the HTML Wrapper
    # Note: We do NOT link the CSS here. We inject it via Python later.
    template = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    </head>
    <body style="font-family: 'Roboto', sans-serif;">
        <div class="tiptap">
            {{CONTENT}}
        </div>
    </body>
    </html>
    """
    full_html = template.replace("{{CONTENT}}", html_content)

    # 3. Generate PDF with the external CSS
    # base_url is required if your CSS references images/fonts via relative paths
    html_obj = HTML(
        string=full_html, 
        base_url=os.path.dirname(css_file_path),
    )

    # 2. write_pdf only takes stylesheets and destination options
    pdf_bytes = html_obj.write_pdf(
        stylesheets=[CSS(filename=css_file_path)]
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=document.pdf"}
    )