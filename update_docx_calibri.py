import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def update_cv_docx_calibri(docx_path):
    doc = docx.Document(docx_path)
    table = doc.tables[0]
    
    # 1. Update Table Grid (28.4% left / 71.6% right)
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
        
    for row in table.rows:
        c0 = row.cells[0]
        c1 = row.cells[1]
        
        c0.width = Inches(left_w_dxa / 1440.0)
        c1.width = Inches(right_w_dxa / 1440.0)
        
        tcPr0 = c0._tc.get_or_add_tcPr()
        tcW0 = tcPr0.xpath('w:tcW')
        if tcW0:
            tcPr0.remove(tcW0[0])
        tcPr0.append(parse_xml(f'<w:tcW {nsdecls("w")} w:w="{left_w_dxa}" w:type="dxa"/>'))
        
        # Cell 0 background soft blue-gray (#F0F4F9)
        shd0 = tcPr0.xpath('w:shd')
        if shd0:
            tcPr0.remove(shd0[0])
        tcPr0.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="F0F4F9"/>'))
        
        tcMar0 = tcPr0.xpath('w:tcMar')
        if tcMar0:
            tcPr0.remove(tcMar0[0])
        tcPr0.append(parse_xml(f'''
            <w:tcMar {nsdecls("w")}>
                <w:top w:w="180" w:type="dxa"/>
                <w:left w:w="240" w:type="dxa"/>
                <w:bottom w:w="180" w:type="dxa"/>
                <w:right w:w="240" w:type="dxa"/>
            </w:tcMar>
        '''))

        tcPr1 = c1._tc.get_or_add_tcPr()
        tcW1 = tcPr1.xpath('w:tcW')
        if tcW1:
            tcPr1.remove(tcW1[0])
        tcPr1.append(parse_xml(f'<w:tcW {nsdecls("w")} w:w="{right_w_dxa}" w:type="dxa"/>'))
        
        tcMar1 = tcPr1.xpath('w:tcMar')
        if tcMar1:
            tcPr1.remove(tcMar1[0])
        tcPr1.append(parse_xml(f'''
            <w:tcMar {nsdecls("w")}>
                <w:top w:w="180" w:type="dxa"/>
                <w:left w:w="360" w:type="dxa"/>
                <w:bottom w:w="180" w:type="dxa"/>
                <w:right w:w="240" w:type="dxa"/>
            </w:tcMar>
        '''))

    # 2. Fix Profile Picture Cropping
    # Photo is 1673 x 2048 (aspect ratio 1.224148)
    new_cx = 2050000  # ~1.42 inches
    new_cy = int(new_cx * (2048.0 / 1673.0)) # ~2509444
    
    for p in c0.paragraphs:
        for r in p.runs:
            # Fix wp:extent
            extents = r._r.xpath('.//wp:extent')
            for ext in extents:
                ext.set('cx', str(new_cx))
                ext.set('cy', str(new_cy))
            # Fix a:ext inside a:xfrm
            a_exts = r._r.xpath('.//a:xfrm/a:ext')
            for aext in a_exts:
                aext.set('cx', str(new_cx))
                aext.set('cy', str(new_cy))
            # Remove any crop rects if present
            srcRects = r._r.xpath('.//a:srcRect')
            for sr in srcRects:
                sr.getparent().remove(sr)

    # 3. Apply Calibri Font & National Industry Standard ATS Font Sizes Across All Paragraphs
    def format_paragraph_runs(p, default_size=10, is_bold=False, is_italic=False, color_rgb=None):
        for r in p.runs:
            r.font.name = 'Calibri'
            if default_size and not r.font.size:
                r.font.size = Pt(default_size)
            elif r.font.size:
                # Keep relative ratio if needed, or enforce standard
                r.font.name = 'Calibri'
            if color_rgb:
                r.font.color.rgb = color_rgb

    # Apply font formatting cell by cell
    for cell_idx, cell in enumerate([c0, c1]):
        for p in cell.paragraphs:
            p.paragraph_format.line_spacing = 1.2
            text = p.text.strip()
            
            # Format Calibri for all runs in paragraph
            for r in p.runs:
                r.font.name = 'Calibri'
                
            if not text:
                continue
                
            # Right cell headers (MUHAMMAD FAHREL YULIYANTO)
            if cell_idx == 1:
                if 'MUHAMMAD FAHREL YULIYANTO' in text:
                    for r in p.runs:
                        r.font.name = 'Calibri'
                        r.font.size = Pt(19)
                        r.font.bold = True
                        r.font.color.rgb = RGBColor(15, 23, 42) # Slate 900
                    p.paragraph_format.space_after = Pt(4)
                    p.paragraph_format.space_before = Pt(0)
                elif 'Mahasiswa Sistem Informasi' in text:
                    for r in p.runs:
                        r.font.name = 'Calibri'
                        r.font.size = Pt(10.5)
                        r.font.bold = True
                        r.font.color.rgb = RGBColor(30, 58, 138) # Navy Blue
                    p.paragraph_format.space_after = Pt(10)
                elif text in ['PROFIL', 'RISET, INOVASI & PROYEK UNGGULAN', 'PENGALAMAN KERJA & FREELANCE', 'ORGANISASI & KEPEMIMPINAN', 'PEMATERI, NARASUMBER & PENGABDIAN', 'PRESTASI & HAK CIPTA (HKI)', 'PELATIHAN, WEBINAR & PENGEMBANGAN DIRI']:
                    for r in p.runs:
                        r.font.name = 'Calibri'
                        r.font.size = Pt(11.5)
                        r.font.bold = True
                        r.font.color.rgb = RGBColor(30, 58, 138) # Navy Blue
                    p.paragraph_format.space_before = Pt(10)
                    p.paragraph_format.space_after = Pt(4)
                else:
                    # Standard body or bullet text in right column
                    for r in p.runs:
                        r.font.name = 'Calibri'
                        if not r.font.size or r.font.size < Pt(10):
                            r.font.size = Pt(10)
            
            # Left cell headers (KONTAK, PENDIDIKAN, etc.)
            elif cell_idx == 0:
                if text in ['KONTAK', 'PENDIDIKAN', 'SERTIFIKASI & LISENSI', 'SKILL TEKNIS', 'TOOLS', 'SOFT SKILL', 'BAHASA']:
                    for r in p.runs:
                        r.font.name = 'Calibri'
                        r.font.size = Pt(11)
                        r.font.bold = True
                        r.font.color.rgb = RGBColor(30, 58, 138)
                    p.paragraph_format.space_before = Pt(8)
                    p.paragraph_format.space_after = Pt(3)
                else:
                    for r in p.runs:
                        r.font.name = 'Calibri'
                        if not r.font.size:
                            r.font.size = Pt(9.5)

    doc.save(docx_path)
    print("CV DOCX updated with Calibri font, exact ATS font sizes, and uncropped profile picture!")

if __name__ == "__main__":
    update_cv_docx_calibri('CV_Muhammad_Fahrel_Yuliyanto_2026.docx')
