from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.lib.units import inch
import os

# To filter out section while generation of pdf
def filter_section(item):
    if(item['section']=='Project Title' or item['section'] == 'Senders Name' or item['section'] == 'Funders Name'):
        return False
    else:
        return True

def generate_pdf(content_list, output_filename, template_style='modern'):
    """
    Generates a PDF document from a list of content items, styled based on the chosen template, with a custom front page including title and sender/receiver info.
    
    :param content_list: List of dictionaries, each with 'section' (str) and 'answer' (str). Supports special sections 'project_title', 'sender', and 'receiver' for front page.
    :param output_filename: The filename or file-like object for the output PDF.
    :param template_style: String indicating the style ('luxury', 'modern', 'aesthetics', 'corporate', 'creative', 'elegant'). Defaults to 'modern'.
    """
    # Validate template_style
    valid_styles = ['luxury', 'modern', 'aesthetics', 'corporate', 'creative', 'elegant']
    if template_style not in valid_styles:
        raise ValueError(f"Invalid template style. Choose from: {', '.join(valid_styles)}")
    
    # Extract special keys
    document_title = None
    sender = None
    receiver = None
    content_items = []
    
    
    # To assign the 
    for item in content_list:
        section = item.get('section')
        answer = item.get('answer')
        if section == 'Project Title':
            document_title = answer
        elif section == 'Senders Name':
            sender = answer
        elif section == 'Funders Name':
            receiver = answer
        
            
    content_list = filter(filter_section,content_list)

    for item in content_list:
        content_items.append(item)
    
    # Default values if not provided
    if document_title is None:
        document_title = "Untitled Document"
    if sender is None:
        sender = "Unknown Sender"
    if receiver is None:
        receiver = "Unknown Receiver"
    
    # Define style configurations
    base_margins = (0.75 * inch, 0.75 * inch, 0.5 * inch, 0.5 * inch)
    if template_style == 'luxury':
        heading_font = 'Times-Bold'
        content_font = 'Times-Roman'
        heading_color = colors.gold
        content_color = colors.black
        heading_alignment = TA_CENTER
        content_alignment = TA_LEFT
        heading_size = 16
        content_size = 11
        leading = 13
        space_before = 12
        space_after = 8
        footer_color = colors.gold
        bg_color = colors.HexColor('#FFFACD')
        hr_color = colors.gold
        hr_width = 0.5
        title_style = ParagraphStyle('Title', fontName='Times-Bold', fontSize=36, alignment=TA_CENTER, textColor=colors.gold, spaceAfter=20,leading=48,splitLongWords=1,wordWrap='CJK')
        info_style = ParagraphStyle('Info', fontName='Times-Roman', fontSize=10, alignment=TA_CENTER, textColor=colors.darkgoldenrod)
    elif template_style == 'modern':
        heading_font = 'Helvetica-Bold'
        content_font = 'Helvetica'
        heading_color = colors.black
        content_color = colors.black
        heading_alignment = TA_LEFT
        content_alignment = TA_LEFT
        heading_size = 14
        content_size = 11
        leading = 12
        space_before = 8
        space_after = 4
        footer_color = colors.gray
        bg_color = colors.white
        hr_color = colors.gray
        hr_width = 0.25
        title_style = ParagraphStyle('Title', fontName='Helvetica-Bold', fontSize=32, alignment=TA_LEFT, textColor=colors.black, spaceAfter=15,leading=48,splitLongWords=1,wordWrap='CJK')
        info_style = ParagraphStyle('Info', fontName='Helvetica', fontSize=10, alignment=TA_LEFT, textColor=colors.gray)
    elif template_style == 'aesthetics':
        heading_font = 'Times-BoldItalic'
        content_font = 'Helvetica'
        heading_color = colors.navy
        content_color = colors.darkslategray
        heading_alignment = TA_CENTER
        content_alignment = TA_JUSTIFY
        heading_size = 14
        content_size = 10
        leading = 13
        space_before = 10
        space_after = 6
        footer_color = colors.navy
        bg_color = colors.HexColor('#F5F5DC')
        hr_color = colors.navy
        hr_width = 0.5
        title_style = ParagraphStyle('Title', fontName='Times-Italic', fontSize=34, alignment=TA_CENTER, textColor=colors.navy, spaceAfter=18,leading=48,splitLongWords=1,wordWrap='CJK')
        info_style = ParagraphStyle('Info', fontName='Helvetica', fontSize=10, alignment=TA_CENTER, textColor=colors.darkslategray)
    elif template_style == 'corporate':
        heading_font = 'Helvetica-Bold'
        content_font = 'Times-Roman'
        heading_color = colors.darkblue
        content_color = colors.black
        heading_alignment = TA_LEFT
        content_alignment = TA_LEFT
        heading_size = 15
        content_size = 11
        leading = 13
        space_before = 10
        space_after = 6
        footer_color = colors.darkblue
        bg_color = colors.lightgrey
        hr_color = colors.darkblue
        hr_width = 0.5
        title_style = ParagraphStyle('Title', fontName='Helvetica-Bold', fontSize=30, alignment=TA_CENTER, textColor=colors.darkblue, spaceAfter=16,leading=48,splitLongWords=1,wordWrap='CJK')
        info_style = ParagraphStyle('Info', fontName='Times-Roman', fontSize=10, alignment=TA_CENTER, textColor=colors.darkblue)
    elif template_style == 'creative':
        heading_font = 'Helvetica-Oblique'
        content_font = 'Helvetica'
        heading_color = colors.darkgreen
        content_color = colors.black
        heading_alignment = TA_CENTER
        content_alignment = TA_JUSTIFY
        heading_size = 16
        content_size = 11
        leading = 14
        space_before = 12
        space_after = 8
        footer_color = colors.darkgreen
        bg_color = colors.HexColor('#E0FFE0')
        hr_color = colors.darkgreen
        hr_width = 0.75
        title_style = ParagraphStyle('Title', fontName='Helvetica-Oblique', fontSize=38, alignment=TA_CENTER, textColor=colors.darkgreen, spaceAfter=22,leading=48,splitLongWords=1,wordWrap='CJK')
        info_style = ParagraphStyle('Info', fontName='Helvetica', fontSize=10, alignment=TA_CENTER, textColor=colors.darkgreen)
    elif template_style == 'elegant':
        heading_font = 'Times-Bold'
        content_font = 'Times-Roman'
        heading_color = colors.darkslategray
        content_color = colors.black
        heading_alignment = TA_RIGHT  # Unique right alignment for elegance
        content_alignment = TA_JUSTIFY
        heading_size = 15
        content_size = 11
        leading = 14  # Clean, balanced spacing
        space_before = 10
        space_after = 6
        footer_color = colors.darkslategray
        bg_color = colors.HexColor('#F0F0F0')
        hr_color = colors.silver  # Subtle light lines
        hr_width = 0.3
        title_style = ParagraphStyle('Title', fontName='Times-Bold', fontSize=40, alignment=TA_CENTER, textColor=colors.darkslategray, spaceAfter=20,leading=48,splitLongWords=1,wordWrap='CJK')
        info_style = ParagraphStyle('Info', fontName='Times-Italic', fontSize=10, alignment=TA_CENTER, textColor=colors.gray)
    
    # Create the PDF document
    doc = SimpleDocTemplate(output_filename, pagesize=A4,
                            leftMargin=base_margins[0], rightMargin=base_margins[1],
                            topMargin=base_margins[2], bottomMargin=base_margins[3])
    
    # Define content styles
    heading_style = ParagraphStyle('Heading',
                                   fontName=heading_font,
                                   fontSize=heading_size,
                                   leading=heading_size + 1,
                                   spaceBefore=space_before,
                                   spaceAfter=space_after // 2,
                                   alignment=heading_alignment,
                                   textColor=heading_color)
    
    content_style = ParagraphStyle('Content',
                                   fontName=content_font,
                                   fontSize=content_size,
                                   leading=leading,
                                   spaceAfter=space_after,
                                   alignment=content_alignment,
                                   textColor=content_color,
                                   leftIndent=0)
    
    footer_style = ParagraphStyle('Footer',
                                  fontName='Helvetica',
                                  fontSize=8,
                                  alignment=TA_CENTER,
                                  textColor=footer_color)
    
    # List to hold document elements
    flowables = []
    
    # Add front page elements
    flowables.append(Spacer(1, 2 * inch))  # Vertical centering for title
    flowables.append(Paragraph(document_title, title_style))
    
    # Push sender/receiver to bottom
    flowables.append(Spacer(1, 3 * inch))  # Adjust this spacer for positioning (increase/decrease as needed)
    
    if sender:
        flowables.append(Paragraph(f"Created by: {sender}", info_style))
    if receiver:
        flowables.append(Paragraph(f"Prepared for: {receiver}", info_style))
    
    flowables.append(PageBreak())  # Start content on next page
    
    # Process each content item (excluding specials)
    for item in content_items:
        section = item['section']
        content = item['answer']
        
        # Add section heading
        flowables.append(Paragraph(section, heading_style))
        flowables.append(Spacer(1, 0.05 * inch))
        
        # Split and add paragraphs
        paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]
        for para in paragraphs:
            flowables.append(Paragraph(para, content_style))
        
        # Add light line breaker after each section
        flowables.append(HRFlowable(width="80%", thickness=hr_width, color=hr_color, spaceBefore=space_after, spaceAfter=space_before // 2))
        flowables.append(Spacer(1, 0.1 * inch))
    
    # Function to draw background and footer (front page uses same bg, no footer on front)
    def draw_page_elements(canvas, doc):
        canvas.saveState()
        canvas.setFillColor(bg_color)
        canvas.rect(0, 0, doc.pagesize[0], doc.pagesize[1], stroke=0, fill=1)
        canvas.restoreState()
        
        page_num = canvas.getPageNumber()
        if page_num > 1:  # Footer starts from page 2
            text = f"Page {page_num - 1} - Generated by AI Document Generator"
            footer = Paragraph(text, footer_style)
            w, h = footer.wrap(doc.width, doc.bottomMargin)
            footer.drawOn(canvas, doc.leftMargin, 0.3 * inch)
    
    # Build the PDF
    doc.build(flowables, onFirstPage=draw_page_elements, onLaterPages=draw_page_elements)


def delete_file(path: str):
    try:
        os.remove(path)
        print(f"Deleted file: {path}")
    except Exception as e:
        print(f"Error deleting file {path}: {e}")
