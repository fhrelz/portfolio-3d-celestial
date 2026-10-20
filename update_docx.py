import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def update_cv_docx(docx_path):
    doc = docx.Document(docx_path)
    table = doc.tables[0]
    
    # Total usable width: A4 is 8.27 in (11906 dxa). Page margins 0.35 in (504 dxa) left/right.
    # Total table width = ~10900 dxa
    # Left col: ~3100 dxa (28.4%)
    # Right col: ~7800 dxa (71.6%)
    
    left_w_dxa = 3100
    right_w_dxa = 7800
    
    # Update tblGrid in XML
    tblGrid = table._element.xpath('w:tblGrid')
    if tblGrid:
        new_grid = parse_xml(f'''
            <w:tblGrid {nsdecls("w")}>
                <w:gridCol w:w="{left_w_dxa}"/>
                <w:gridCol w:w="{right_w_dxa}"/>
            </w:tblGrid>
        ''')
        table._element.replace(tblGrid[0], new_grid)
        
    for row in table.rows:
        c0 = row.cells[0]
        c1 = row.cells[1]
        
        c0.width = Inches( left_w_dxa / 1440.0 )
        c1.width = Inches( right_w_dxa / 1440.0 )
        
        # update cell widths in XML
        tcPr0 = c0._tc.get_or_add_tcPr()
        tcW0 = tcPr0.xpath('w:tcW')
        if tcW0:
            tcPr0.remove(tcW0[0])
        tcPr0.append(parse_xml(f'<w:tcW {nsdecls("w")} w:w="{left_w_dxa}" w:type="dxa"/>'))
        
        # update cell 0 shading background to soft professional blue-gray (#F0F4F9)
        shd0 = tcPr0.xpath('w:shd')
        if shd0:
            tcPr0.remove(shd0[0])
        tcPr0.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="F0F4F9"/>'))
        
        # Cell margins/padding: left 240 dxa (0.16in), right 200 dxa, top 160 dxa, bottom 160 dxa
        tcMar0 = tcPr0.xpath('w:tcMar')
        if tcMar0:
            tcPr0.remove(tcMar0[0])
        tcPr0.append(parse_xml(f'''
            <w:tcMar {nsdecls("w")}>
                <w:top w:w="160" w:type="dxa"/>
                <w:left w:w="240" w:type="dxa"/>
                <w:bottom w:w="160" w:type="dxa"/>
                <w:right w:w="240" w:type="dxa"/>
            </w:tcMar>
        '''))

        tcPr1 = c1._tc.get_or_add_tcPr()
        tcW1 = tcPr1.xpath('w:tcW')
        if tcW1:
            tcPr1.remove(tcW1[0])
        tcPr1.append(parse_xml(f'<w:tcW {nsdecls("w")} w:w="{right_w_dxa}" w:type="dxa"/>'))
        
        # Right cell padding: top 160 dxa, left 360 dxa (0.25in gap), right 240 dxa, bottom 160 dxa
        tcMar1 = tcPr1.xpath('w:tcMar')
        if tcMar1:
            tcPr1.remove(tcMar1[0])
        tcPr1.append(parse_xml(f'''
            <w:tcMar {nsdecls("w")}>
                <w:top w:w="160" w:type="dxa"/>
                <w:left w:w="360" w:type="dxa"/>
                <w:bottom w:w="160" w:type="dxa"/>
                <w:right w:w="240" w:type="dxa"/>
            </w:tcMar>
        '''))

    # Update picture size if needed so profile picture fits left column perfectly
    for p in c0.paragraphs:
        for r in p.runs:
            drawings = r._r.xpath('.//wp:extent')
            for ext in drawings:
                cx = int(ext.get('cx'))
                cy = int(ext.get('cy'))
                if cx > 0:
                    new_cx = 2300000 # ~1.6 inches width
                    new_cy = int(cy * (new_cx / cx))
                    ext.set('cx', str(new_cx))
                    ext.set('cy', str(new_cy))
                    
    doc.save(docx_path)
    print("DOCX layout successfully updated!")

if __name__ == "__main__":
    update_cv_docx('CV_Muhammad_Fahrel_Yuliyanto_2026.docx')
