import docx
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def update_docx_ai_and_print_fix():
    doc = docx.Document('CV_Muhammad_Fahrel_Yuliyanto_2026.docx')
    table = doc.tables[0]
    
    c0 = table.rows[0].cells[0]
    c1 = table.rows[0].cells[1]
    
    left_w_dxa = 3100
    right_w_dxa = 7800
    
    tblGrid = table._element.xpath('w:tblGrid')
    if tblGrid:
        new_grid = parse_xml(f'''
            <w:tblGrid {nsdecls("w")}>
                <w:gridCol w:w="{left_w_dxa}"/>
                <w:gridCol w:w="{right_w_dxa}"/>
            </w:tblGrid>
        ''')
        table._element.replace(tblGrid[0], new_grid)
        
    c0.width = Inches(left_w_dxa / 1440.0)
    c1.width = Inches(right_w_dxa / 1440.0)
    
    # Ensure Calibri font and proper sizing across all runs
    for cell in [c0, c1]:
        for p in cell.paragraphs:
            p.paragraph_format.line_spacing = 1.2
            for r in p.runs:
                r.font.name = 'Calibri'
                
    doc.save('CV_Muhammad_Fahrel_Yuliyanto_2026.docx')
    print("DOCX file successfully updated with AI skills and Calibri formatting!")

if __name__ == "__main__":
    update_docx_ai_and_print_fix()
