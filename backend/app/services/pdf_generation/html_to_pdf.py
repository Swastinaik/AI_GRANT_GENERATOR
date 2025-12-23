from playwright.async_api import async_playwright
async def generate_pdf_html(content_html: str, css_content: str):
    # Load your CSS file or use a string
    # Tip: Use a specific 'print' version of your CSS
    css_content = """
    /* ... (The CSS logic provided above) ... */
    .tiptap { padding: 0; }
    pre { white-space: pre-wrap; word-wrap: break-word; } /* Ensure code wraps */
    """

    full_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            {css_content}
        </style>
    </head>
    <body>
        <div class="tiptap">
            {content_html}
        </div>
    </body>
    </html>
    """
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_content(full_html, wait_until="networkidle")
        
        pdf_bytes = await page.pdf(
            format="A4",
            print_background=True, # MUST be True for your code block backgrounds
            display_header_footer=True, # Optional: Adds page numbers
            header_template='<div></div>',
            footer_template='''
                <div style="font-size:10px; width:100%; text-align:center;">
                    Page <span class="pageNumber"></span> of <span class="totalPages"></span>
                </div>''',
            margin={"top": "60px", "bottom": "60px", "left": "40px", "right": "40px"}
        )
        await browser.close()
        return pdf_bytes