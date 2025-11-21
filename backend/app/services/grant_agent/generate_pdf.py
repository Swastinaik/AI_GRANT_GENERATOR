from typing import List
from pydantic import BaseModel
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph
import os
def generate_pdf(content_list, output_filename):
    """
    Generates a PDF document from a list of dictionaries containing 'section' and 'content'.
    
    :param content_list: List of dictionaries with 'section' and 'content' keys.
    :param output_filename: The filename or file-like object for the output PDF.
    """
    # Create a PDF document with A4 size and 1-inch margins
    doc = SimpleDocTemplate(output_filename, pagesize=A4,
                            leftMargin=30, rightMargin=30,
                            topMargin=30, bottomMargin=30)
    
    # Define styles for headings and content
    heading_style = ParagraphStyle('Heading',
                                   fontSize=16,
                                   leading=18,
                                   spaceBefore=18,
                                   spaceAfter=12,
                                   alignment=TA_LEFT)
    
    content_style = ParagraphStyle('Content',
                                   fontSize=12,
                                   leading=14,
                                   spaceAfter=6,
                                   alignment=TA_LEFT)
    
    # List to hold document elements
    flowables = []
    
    # Process each item in the content list
    for item in content_list:
        section = item['section']
        content = item['answer']
        
        # Add section heading
        heading = Paragraph(section, heading_style)
        flowables.append(heading)
        
        # Split content into paragraphs and add each as a Paragraph object
        paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]
        for para in paragraphs:
            content_para = Paragraph(para, content_style)
            flowables.append(content_para)
    
    # Generate the PDF
    doc.build(flowables)

def delete_file(path: str):
    try:
        os.remove(path)
        print(f"Deleted file: {path}")
    except Exception as e:
        print(f"Error deleting file {path}: {e}")