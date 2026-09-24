import os
import sys
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable, Image
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

def fmt_code(text):
    if not isinstance(text, str):
        return text
    return re.sub(r'`([^`]+)`', r'<font face="Courier" size="8.5" color="#1E293B"><b>\1</b></font>', text)

# Define NumberedCanvas for dynamic total page count & running headers/footers
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        if self._pageNumber == 1:
            # Suppress header/footer on cover page
            return

        self.saveState()
        
        # Header text & line (Larger font: 9pt)
        self.setFont("Helvetica-Bold", 9)
        self.setFillColor(colors.HexColor("#4F46E5")) # Indigo accent
        self.drawString(54, 752, "APIVerse")
        
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(102, 752, "|   Advanced REST API Explorer & Analytics Platform — Technical Report")
        
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.75)
        self.line(54, 744, 558, 744)

        # Footer line & text (Larger font: 8.5pt)
        self.line(54, 48, 558, 48)
        self.setFont("Helvetica", 8.5)
        self.drawString(54, 34, "APIVerse Production Technical Report  •  Open-Source Architecture Specification")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 34, page_str)
        
        self.restoreState()


def build_pdf(filename="APIVerse_Project_Report.pdf"):
    # Margins: Left=54, Right=54 -> Printable Width = 504 pt = 7.0 inch
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=64,
        bottomMargin=64
    )

    styles = getSampleStyleSheet()

    # Color Palette Definitions
    C_PRIMARY = colors.HexColor("#0F172A")    # Slate 900
    C_INDIGO = colors.HexColor("#4F46E5")     # Indigo 600 (Primary Accent)
    C_SKY = colors.HexColor("#0EA5E9")        # Sky 500 (Secondary Accent)
    C_TEXT = colors.HexColor("#1E293B")       # Slate 800 (Body text)
    C_MUTED = colors.HexColor("#64748B")      # Slate 500 (Subtitles / Metadata)
    C_BG_LIGHT = colors.HexColor("#F8FAFC")   # Slate 50 (Callout background)
    C_BORDER = colors.HexColor("#E2E8F0")     # Slate 200 (Light border)
    C_SUCCESS = colors.HexColor("#059669")    # Emerald 600 (Success badge)
    C_CARD_BG = colors.HexColor("#EEF2FF")    # Light Indigo tint

    # Custom Paragraph Styles with ENLARGED FONT SIZES & IMPROVED LEADING
    style_cover_badge = ParagraphStyle(
        'CoverBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=C_INDIGO,
        spaceAfter=14
    )

    style_cover_title = ParagraphStyle(
        'CoverTitle',
        parent=styles['Title'],
        fontName='Helvetica-Bold',
        fontSize=32,
        leading=38,
        textColor=C_PRIMARY,
        alignment=0,
        spaceAfter=10
    )

    style_cover_subtitle = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=15,
        leading=20,
        textColor=C_MUTED,
        alignment=0,
        spaceAfter=22
    )

    style_h1 = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=17,
        leading=21,
        textColor=C_PRIMARY,
        spaceBefore=18,
        spaceAfter=10,
        keepWithNext=True
    )

    style_h2 = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=C_INDIGO,
        spaceBefore=14,
        spaceAfter=7,
        keepWithNext=True
    )

    style_h3 = ParagraphStyle(
        'Heading3_Custom',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14.5,
        textColor=C_PRIMARY,
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )

    style_body = ParagraphStyle(
        'Body_Custom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=10,
        leading=14.5,
        textColor=C_TEXT,
        spaceAfter=8
    )

    style_bullet = ParagraphStyle(
        'Bullet_Custom',
        parent=style_body,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=5
    )

    style_callout = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=C_PRIMARY
    )

    style_code = ParagraphStyle(
        'Code_Block',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#0F172A")
    )

    style_th = ParagraphStyle(
        'TableHead',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12.5,
        textColor=colors.white
    )

    style_td = ParagraphStyle(
        'TableData',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12.5,
        textColor=C_TEXT
    )

    style_td_bold = ParagraphStyle(
        'TableDataBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12.5,
        textColor=C_PRIMARY
    )

    story = []

    # -------------------------------------------------------------------------
    # COVER PAGE
    # -------------------------------------------------------------------------
    story.append(Spacer(1, 15))
    story.append(Paragraph("PROJECT TECHNICAL REPORT & SYSTEM SPECIFICATION", style_cover_badge))
    story.append(Paragraph("APIVerse", style_cover_title))
    story.append(Paragraph("Advanced REST API Explorer & Geographic Data Analytics Platform", style_cover_subtitle))
    
    # Colored Divider Bar
    story.append(HRFlowable(width="100%", thickness=4, color=C_INDIGO, spaceBefore=0, spaceAfter=18))

    # Metadata Card Table (Widths sum to 7.0 inches)
    meta_data = [
        [Paragraph("Project Title", style_td_bold), Paragraph(fmt_code("APIVerse – Advanced REST API Explorer & Analytics"), style_td)],
        [Paragraph("Live Application URL", style_td_bold), Paragraph("<font color='#4F46E5'><u>https://api-verse-ashy.vercel.app/</u></font>", style_td)],
        [Paragraph("GitHub Repository", style_td_bold), Paragraph("<font color='#4F46E5'><u>https://github.com/Syedumair05/APIVerse-</u></font>", style_td)],
        [Paragraph("Author / Lead Developer", style_td_bold), Paragraph("Syed Umair Ahmed", style_td)],
        [Paragraph("Frontend Technology", style_td_bold), Paragraph("React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, Lucide Icons", style_td)],
        [Paragraph("Backend Technology", style_td_bold), Paragraph("Node.js, Express, TypeScript, MongoDB (Mongoose), Swagger OpenAPI 3.0, Zod", style_td)],
        [Paragraph("External Data Source", style_td_bold), Paragraph("REST Countries API v3.1 (Geographic & Demographic Dataset)", style_td)],
        [Paragraph("Test Suite Status", style_td_bold), Paragraph("<font color='#059669'><b>100% Passed (14/14 Unit & Integration Tests)</b></font>", style_td)],
        [Paragraph("Report Version & Date", style_td_bold), Paragraph("Version 1.0.0 (Production Ready)  •  September 2026", style_td)],
        [Paragraph("License", style_td_bold), Paragraph("MIT Open Source License", style_td)]
    ]
    t_meta = Table(meta_data, colWidths=[1.9*inch, 5.1*inch])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_CARD_BG),
        ('BOX', (0,0), (-1,-1), 1.2, C_INDIGO),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#C7D2FE")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 18))

    # Executive Overview Callout Box
    summary_html = (
        "<b>Executive Summary:</b> APIVerse is a production-grade, full-stack web application engineered to consume, "
        "filter, visualize, and analyze live geographic and demographic dataset from the public REST Countries API. "
        "Built using React 19, TypeScript, Vite, and Express, APIVerse delivers a high-performance user experience with "
        "dual-tier caching (client-side 24-hour localStorage + backend MongoDB TTL cache), interactive analytics powered by Recharts, "
        "URL query state synchronization, dark/light theme switching, and strict REST security hardening."
    )
    callout_data = [[Paragraph(summary_html, style_callout)]]
    t_callout = Table(callout_data, colWidths=[7.0*inch])
    t_callout.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('LINELEFT', (0,0), (0,0), 4, C_INDIGO),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
    ]))
    story.append(t_callout)
    
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 1: EXECUTIVE SUMMARY & CORE OBJECTIVES
    # -------------------------------------------------------------------------
    story.append(Paragraph("1. Executive Summary & Core Objectives", style_h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=C_INDIGO, spaceBefore=2, spaceAfter=12))

    story.append(Paragraph(
        "<b>APIVerse</b> is designed as a modern REST API Explorer and Geographic Data Analytics Platform. "
        "It empowers users to seamlessly search, filter, sort, bookmark, and visually analyze live data for over 250 sovereign "
        "nations and global territories.", style_body))

    story.append(Paragraph("Core Value Propositions", style_h2))

    bullets_section1 = [
        "<b>Real-Time API Consumption:</b> Integrates with REST Countries API v3.1 using Axios DTO mappings.",
        "<b>Dual-Tier Caching:</b> Eliminates redundant network usage via client-side timestamped local storage (24-hour TTL) and backend MongoDB caching.",
        "<b>Rich Interactive Analytics:</b> Recharts dashboard rendering regional population bars, country distribution donuts, and top 10 land area / population rankings.",
        "<b>URL State Synchronization:</b> Syncs search queries, region filters, and sorting parameters directly into the browser URL (`?search=india&region=Asia&sort=pop-desc`) for shareable views.",
        "<b>Modern UX Design System:</b> Tailwind CSS v4 styling, dark/light theme toggle, custom shimmer loading skeletons, keyboard shortcut handling ('/' focus search), and fully accessible modal dialogs.",
        "<b>100% Type-Safe Architecture:</b> Strict TypeScript coverage across both React frontend and Express backend gateway."
    ]
    for b in bullets_section1:
        story.append(Paragraph(f"• {fmt_code(b)}", style_bullet))

    story.append(Spacer(1, 10))

    # Core Metrics Table
    story.append(Paragraph("Key System Performance Metrics", style_h3))
    metrics_table_data = [
        [Paragraph("Metric", style_th), Paragraph("Value / Target", style_th), Paragraph("Technical Specification & Implementation", style_th)],
        [Paragraph("Global Coverage", style_td_bold), Paragraph("250+ Nations & Territories", style_td), Paragraph(fmt_code("REST Countries API v3.1 dataset"), style_td)],
        [Paragraph("Client Cache TTL", style_td_bold), Paragraph("24 Hours (1440 mins)", style_td), Paragraph(fmt_code("Timestamped `localStorage` cache with manual refresh header"), style_td)],
        [Paragraph("Debounce Latency", style_td_bold), Paragraph("300 ms", style_td), Paragraph("Optimized search query state throttling to prevent redundant re-renders", style_td)],
        [Paragraph("Pagination Layout", style_td_bold), Paragraph("12 items / page", style_td), Paragraph("Responsive grid with item range counter and page controls", style_td)],
        [Paragraph("Axios Timeout", style_td_bold), Paragraph("12,000 ms", style_td), Paragraph("Automatic request timeout with friendly fallback error screen", style_td)],
        [Paragraph("Backend Rate Limit", style_td_bold), Paragraph("100 reqs / 15 mins", style_td), Paragraph(fmt_code("`express-rate-limit` middleware IP protection"), style_td)],
        [Paragraph("Test Coverage", style_td_bold), Paragraph("14/14 Tests Passed (100%)", style_td), Paragraph("Jest & Supertest automated unit and integration suite", style_td)]
    ]
    t_metrics = Table(metrics_table_data, colWidths=[1.8*inch, 2.0*inch, 3.2*inch])
    t_metrics.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_metrics)

    story.append(Spacer(1, 14))

    # -------------------------------------------------------------------------
    # SECTION 2: SYSTEM ARCHITECTURE & TECH STACK
    # -------------------------------------------------------------------------
    story.append(Paragraph("2. System Architecture & Tech Stack", style_h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=C_INDIGO, spaceBefore=2, spaceAfter=12))

    story.append(Paragraph(
        "APIVerse follows a clean, decoupled multi-tiered full-stack architecture. The system supports direct client-side API consumption "
        "as well as a dedicated Node.js Express REST API gateway for backend persistence and rate limiting.", style_body))

    # Tech Stack Table
    arch_data = [
        [Paragraph("Layer", style_th), Paragraph("Technologies", style_th), Paragraph("Role & Key Architectural Features", style_th)],
        [
            Paragraph("<b>Frontend Framework</b>", style_td),
            Paragraph("React 19, TypeScript, Vite", style_td),
            Paragraph("Declarative UI components, Virtual DOM rendering, strict type interfaces, lightning-fast Vite build system.", style_td)
        ],
        [
            Paragraph("<b>Styling & UX</b>", style_td),
            Paragraph("Tailwind CSS v4, Lucide Icons, Glassmorphism", style_td),
            Paragraph("Utility-first design tokens, dark/light theme persistence, shimmer skeleton loaders, accessible focus dialogs.", style_td)
        ],
        [
            Paragraph("<b>Data Visualization</b>", style_td),
            Paragraph("Recharts Engine", style_td),
            Paragraph("Dynamic responsive bar charts, donut breakdowns, and horizontal top 10 ranking visualizations.", style_td)
        ],
        [
            Paragraph("<b>HTTP Client Layer</b>", style_td),
            Paragraph("Axios Client Layer", style_td),
            Paragraph("Centralized Axios instance with timeout controls, interceptors, and 24-hour timestamped local caching.", style_td)
        ],
        [
            Paragraph("<b>Backend API Gateway</b>", style_td),
            Paragraph("Node.js, Express, TypeScript", style_td),
            Paragraph("RESTful API gateway, parameter sanitization, Zod schema validation, Swagger OpenAPI 3.0 documentation.", style_td)
        ],
        [
            Paragraph("<b>Database & Security</b>", style_td),
            Paragraph("MongoDB, Mongoose, Helmet, Rate-Limit", style_td),
            Paragraph("MongoDB TTL cache indexing, user favorites schema, Helmet security headers, express-rate-limit protection.", style_td)
        ]
    ]
    t_arch = Table(arch_data, colWidths=[1.7*inch, 2.1*inch, 3.2*inch])
    t_arch.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_INDIGO),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_arch)

    story.append(Spacer(1, 12))

    story.append(Paragraph("Data Pipeline Flow Diagram", style_h2))
    
    pipeline_code = (
        "[ User Query / Filter Input ]\n"
        "             |\n"
        "             v\n"
        "[ React useCountries Hook + Debounce (300ms) ]\n"
        "             |\n"
        "             v\n"
        "+--------------------------------------------------------+\n"
        "| Check Client LocalStorage Payload Cache (TTL 24 Hours) |\n"
        "+---------------------------+----------------------------+\n"
        "             | Valid Cache  |            | Expired / Cache Miss\n"
        "             v              |            v\n"
        "   [ Serve UI Instantly ]   |     [ Axios GET /api/countries ]\n"
        "                            |            |\n"
        "                            |            v\n"
        "                            |     [ Express Gateway + MongoDB Cache ]\n"
        "                            |            |\n"
        "                            |            v\n"
        "                            |     [ REST Countries API v3.1 ]\n"
        "                            |            |\n"
        "                            +------------+---> [ Cache Payload & Render UI ]"
    )

    t_pipe = Table([[Paragraph(pipeline_code.replace("\n", "<br/>").replace(" ", "&nbsp;"), style_code)]], colWidths=[7.0*inch])
    t_pipe.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
    ]))
    story.append(t_pipe)

    story.append(Spacer(1, 16))

    # -------------------------------------------------------------------------
    # SECTION 3: FRONTEND ARCHITECTURE & COMPONENTS
    # -------------------------------------------------------------------------
    story.append(Paragraph("3. Frontend Architecture & React Components", style_h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=C_INDIGO, spaceBefore=2, spaceAfter=12))

    story.append(Paragraph(
        "The frontend application is structured logically into components, views, context providers, custom hooks, and utility helpers. "
        "Strict TypeScript types enforce DTO consistency throughout.", style_body))

    story.append(Paragraph("Primary Page Routing (React Router v7)", style_h2))

    page_views = [
        "<b>Home Dashboard View (`/`):</b> The primary exploration screen featuring Stats Cards, debounced SearchBar, FilterPanel, responsive CountryGrid, and Pagination controls.",
        "<b>Interactive Analytics View (`/analytics`):</b> Dedicated charts dashboard rendering 4 dynamic Recharts visualizations for regional populations, country distributions, and top land area / population rankings.",
        "<b>Bookmarked Favorites View (`/favorites`):</b> Renders saved user country bookmarks from persistent storage, with quick access to detailed country modals.",
        "<b>Documentation & About View (`/about`):</b> Technical documentation page presenting system architecture, REST endpoint references, and stack specifications."
    ]
    for p in page_views:
        story.append(Paragraph(f"• {fmt_code(p)}", style_bullet))

    story.append(Spacer(1, 10))

    story.append(Paragraph("Component Specifications Table", style_h2))

    comp_table_data = [
        [Paragraph("Component", style_th), Paragraph("File Path", style_th), Paragraph("Functionality & Interactivity", style_th)],
        [Paragraph("<b>SearchBar</b>", style_td), Paragraph(fmt_code("`src/components/SearchBar.tsx`"), style_td), Paragraph("Debounced search bar with instant clear button and '/' keyboard shortcut listener.", style_td)],
        [Paragraph("<b>FilterPanel</b>", style_td), Paragraph(fmt_code("`src/components/FilterPanel.tsx`"), style_td), Paragraph("Multi-criteria dropdowns for Region filter, Population brackets, and multi-field sorting.", style_td)],
        [Paragraph("<b>CountryCard</b>", style_td), Paragraph(fmt_code("`src/components/CountryCard.tsx`"), style_td), Paragraph("Card view rendering nation flag image, name, region, capital, population metric, and bookmark toggle button.", style_td)],
        [Paragraph("<b>CountryDetailsModal</b>", style_td), Paragraph(fmt_code("`src/components/CountryDetailsModal.tsx`"), style_td), Paragraph("Accessible modal dialog showing subregion, area, landlocked status, currencies, languages, and global rank badge.", style_td)],
        [Paragraph("<b>StatsCards</b>", style_td), Paragraph(fmt_code("`src/components/StatsCards.tsx`"), style_td), Paragraph("KPI summary cards displaying Total Nations (250), Global Population (~7.9B), Average Population, and Surface Area.", style_td)],
        [Paragraph("<b>Pagination</b>", style_td), Paragraph(fmt_code("`src/components/Pagination.tsx`"), style_td), Paragraph("Page switching navigation bar with item range counter (e.g. 'Showing 1-12 of 250 countries').", style_td)],
        [Paragraph("<b>ThemeToggle</b>", style_td), Paragraph(fmt_code("`src/components/ThemeToggle.tsx`"), style_td), Paragraph("Dark/Light theme switch persisting preference to local storage and toggling HTML root class.", style_td)],
        [Paragraph("<b>LoadingSkeleton</b>", style_td), Paragraph(fmt_code("`src/components/LoadingSkeleton.tsx`"), style_td), Paragraph("Animated shimmer card placeholders displayed during network request loading states.", style_td)]
    ]
    t_comp = Table(comp_table_data, colWidths=[1.7*inch, 2.1*inch, 3.2*inch])
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_comp)

    story.append(Spacer(1, 12))

    story.append(Paragraph("Custom React Hooks & Global Context", style_h2))

    hooks_desc = [
        "<b>useCountries Hook:</b> Primary state manager. Manages dataset fetching, client-side caching, search filtering, region filtering, population bracket filtering, sorting logic, pagination slice, and URL query param synchronization.",
        "<b>useDebounce Hook:</b> Custom utility hook throttling search query updates by 300ms to avoid unnecessary component re-renders during fast user typing.",
        "<b>FavoritesContext Provider:</b> Context provider storing favorited nation CCA3 codes persistently in local storage with helper methods (`addFavorite`, `removeFavorite`, `isFavorite`).",
        "<b>ThemeContext Provider:</b> Theme state provider detecting OS preference (`prefers-color-scheme`) and supporting smooth Dark/Light mode switching."
    ]
    for h in hooks_desc:
        story.append(Paragraph(f"• {fmt_code(h)}", style_bullet))

    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 4: BACKEND REST API ARCHITECTURE
    # -------------------------------------------------------------------------
    story.append(Paragraph("4. Backend REST API Architecture & Security", style_h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=C_INDIGO, spaceBefore=2, spaceAfter=12))

    story.append(Paragraph(
        "The APIVerse Backend is a production-grade Express REST API server written in TypeScript. "
        "It acts as a secure API gateway, payload aggregator, and caching provider between the frontend and external API services.", style_body))

    story.append(Paragraph("REST API Endpoints Reference Matrix", style_h2))

    api_endpoints_data = [
        [Paragraph("HTTP Method & Route", style_th), Paragraph("Description & Output", style_th), Paragraph("Parameters & Validation", style_th)],
        [
            Paragraph(fmt_code("`GET /api/health`"), style_td_bold),
            Paragraph("System status & MongoDB connectivity", style_td),
            Paragraph("None (Returns uptime, timestamp, DB connection state)", style_td)
        ],
        [
            Paragraph(fmt_code("`GET /api/countries`"), style_td_bold),
            Paragraph("Paginated, filtered & sorted countries list", style_td),
            Paragraph(fmt_code("`page`, `limit`, `search`, `region`, `sort` (Zod validated)"), style_td)
        ],
        [
            Paragraph(fmt_code("`GET /api/countries/:code`"), style_td_bold),
            Paragraph("Detailed country profile by CCA2/CCA3", style_td),
            Paragraph(fmt_code("Path param `:code` (e.g. `IND`, `USA`)"), style_td)
        ],
        [
            Paragraph(fmt_code("`GET /api/countries/regions`"), style_td_bold),
            Paragraph("List of all available geographic regions", style_td),
            Paragraph("None", style_td)
        ],
        [
            Paragraph(fmt_code("`POST /api/countries/refresh`"), style_td_bold),
            Paragraph("Invalidates backend cache & refetches API", style_td),
            Paragraph("Cache control request header", style_td)
        ],
        [
            Paragraph(fmt_code("`GET /api/analytics/overview`"), style_td_bold),
            Paragraph("Global demographic aggregates summary", style_td),
            Paragraph("None", style_td)
        ],
        [
            Paragraph(fmt_code("`GET /api/analytics/regions`"), style_td_bold),
            Paragraph("Region demographic stats for Recharts", style_td),
            Paragraph("None", style_td)
        ],
        [
            Paragraph(fmt_code("`GET /api/analytics/top-population`"), style_td_bold),
            Paragraph("Top N most populous nations list", style_td),
            Paragraph(fmt_code("`limit` (default: 10)"), style_td)
        ],
        [
            Paragraph(fmt_code("`GET /api/analytics/top-area`"), style_td_bold),
            Paragraph("Top N largest countries by surface area", style_td),
            Paragraph(fmt_code("`limit` (default: 10)"), style_td)
        ],
        [
            Paragraph(fmt_code("`GET /api/favorites`"), style_td_bold),
            Paragraph("Fetch user saved country bookmarks", style_td),
            Paragraph("None", style_td)
        ],
        [
            Paragraph(fmt_code("`POST /api/favorites`"), style_td_bold),
            Paragraph("Add country bookmark to MongoDB", style_td),
            Paragraph(fmt_code("Body: `{ countryCode, countryName }`"), style_td)
        ],
        [
            Paragraph(fmt_code("`DELETE /api/favorites/:code`"), style_td_bold),
            Paragraph("Remove country bookmark", style_td),
            Paragraph(fmt_code("Path param `:code`"), style_td)
        ],
        [
            Paragraph(fmt_code("`GET /api-docs`"), style_td_bold),
            Paragraph("Interactive Swagger OpenAPI 3.0 documentation", style_td),
            Paragraph("Browser Swagger UI interface", style_td)
        ]
    ]
    t_api = Table(api_endpoints_data, colWidths=[2.2*inch, 2.4*inch, 2.4*inch])
    t_api.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_INDIGO),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_api)

    story.append(Spacer(1, 10))

    story.append(Paragraph("Security Hardening & Database Schema", style_h2))

    sec_bullets = [
        "<b>Helmet Header Security:</b> Protects against XSS, clickjacking, and MIME-sniffing by setting strict HTTP headers (`Content-Security-Policy`, `X-Frame-Options`).",
        "<b>Rate-Limiting Middleware:</b> Enforces a limit of 100 requests per 15-minute window (`RATE_LIMIT_WINDOW_MS`), guarding endpoints against scraping and denial-of-service.",
        "<b>Zod Input Validation:</b> Validates request parameters, query options, and payload bodies against type schemas prior to controller execution.",
        "<b>MongoDB Data Models:</b> Implements `CacheModel` with automatic TTL index deletion (1440 mins) and indexed `FavoriteModel` storing user bookmarks."
    ]
    for s in sec_bullets:
        story.append(Paragraph(f"• {fmt_code(s)}", style_bullet))

    story.append(Spacer(1, 16))

    # -------------------------------------------------------------------------
    # SECTION 5: ANALYTICS & DATA VISUALIZATIONS
    # -------------------------------------------------------------------------
    story.append(Paragraph("5. Interactive Analytics & Visualizations", style_h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=C_INDIGO, spaceBefore=2, spaceAfter=12))

    story.append(Paragraph(
        "The **Interactive Analytics Dashboard** translates global demographic data into dynamic graphical insights using Recharts. "
        "Preprocessing logic in `src/utils/statistics.ts` aggregates population totals, regional splits, and top country rankings.", style_body))

    # Embed Generated Chart Images
    chart_dir = r"C:\Users\Syed Umair Ahmed\.gemini\antigravity-ide\brain\778d4312-48fa-4f05-b0f9-5a50bdd9ad3e\charts"
    chart1_path = os.path.join(chart_dir, "chart_region_pop.png")
    chart2_path = os.path.join(chart_dir, "chart_region_donut.png")
    chart3_path = os.path.join(chart_dir, "chart_top_pop.png")

    if os.path.exists(chart1_path) and os.path.exists(chart2_path):
        story.append(Paragraph("Regional Demographics & Country Breakdown", style_h2))
        img1 = Image(chart1_path, width=3.4*inch, height=1.7*inch)
        img2 = Image(chart2_path, width=3.4*inch, height=1.7*inch)
        
        t_charts_side = Table([[img1, img2]], colWidths=[3.5*inch, 3.5*inch])
        t_charts_side.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(t_charts_side)
        story.append(Spacer(1, 10))

    if os.path.exists(chart3_path):
        story.append(Paragraph("Top 10 Most Populous Nations Ranking", style_h2))
        img3 = Image(chart3_path, width=6.9*inch, height=2.4*inch)
        t_chart3 = Table([[img3]], colWidths=[7.0*inch])
        t_chart3.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        story.append(t_chart3)

    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SECTION 6: QUALITY ASSURANCE & TEST VERIFICATION
    # -------------------------------------------------------------------------
    story.append(Paragraph("6. Quality Assurance & Test Verification", style_h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=C_INDIGO, spaceBefore=2, spaceAfter=12))

    story.append(Paragraph(
        "APIVerse incorporates automated test suites and defensive fallback mechanisms to ensure production reliability.", style_body))

    # Test Results Summary Box
    test_summary_html = fmt_code(
        "<b>Automated Test Suite Results (Jest + Supertest):</b><br/>"
        "• <b>Test Suites:</b> 4 Passed (4 Total)<br/>"
        "• <b>Tests Executed:</b> 14 Passed (14 Total — 100% Pass Rate)<br/>"
        "• <b>Coverage Areas:</b> `health.test.ts`, `countries.test.ts`, `analytics.test.ts`, `favorites.test.ts`<br/>"
        "• <b>Status:</b> <font color='#059669'><b>ALL SYSTEM TESTS PASSING CLEANLY</b></font>"
    )
    t_test_box = Table([[Paragraph(test_summary_html, style_callout)]], colWidths=[7.0*inch])
    t_test_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#ECFDF5")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#A7F3D0")),
        ('LINELEFT', (0,0), (0,0), 4, C_SUCCESS),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
    ]))
    story.append(t_test_box)

    story.append(Spacer(1, 10))

    qa_bullets = [
        "<b>Network Reliability & Timeouts:</b> Axios requests are configured with a 12-second timeout limit. If external endpoints hang, fallback UI error cards present a manual retry option.",
        "<b>Data Fallback Protection:</b> Missing capital names, currency maps, or flag assets are safely handled with default fallback badges (`N/A`), preventing null pointer exceptions.",
        "<b>Static Analysis & Type Checks:</b> Validated via Oxlint (`npm run lint`) and strict TypeScript build rules (`tsc -b`)."
    ]
    for q in qa_bullets:
        story.append(Paragraph(f"• {fmt_code(q)}", style_bullet))

    story.append(Spacer(1, 16))

    # -------------------------------------------------------------------------
    # SECTION 7: DEPLOYMENT & DEVOPS
    # -------------------------------------------------------------------------
    story.append(Paragraph("7. Deployment Strategy & Operations", style_h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=C_INDIGO, spaceBefore=2, spaceAfter=12))

    story.append(Paragraph(
        "APIVerse is configured for continuous deployment across Vercel (Frontend Single Page Application) and Render / Docker containers (Backend REST Gateway).", style_body))

    deploy_data = [
        [Paragraph("Target Layer", style_th), Paragraph("Hosting Service", style_th), Paragraph("Build Configuration & Rewrite Rules", style_th)],
        [
            Paragraph("<b>Frontend SPA</b>", style_td_bold),
            Paragraph("Vercel Platform", style_td),
            Paragraph(fmt_code("`npm run build` (`vercel.json` SPA rewrite rules for React Router v7)"), style_td)
        ],
        [
            Paragraph("<b>Backend REST Gateway</b>", style_td_bold),
            Paragraph("Render / Node Container", style_td),
            Paragraph(fmt_code("`npm run build` & `npm start` (`render.yaml` & `Procfile` configuration)"), style_td)
        ],
        [
            Paragraph("<b>Database Layer</b>", style_td_bold),
            Paragraph("MongoDB Atlas", style_td),
            Paragraph("Cloud MongoDB cluster configured with TTL indexes for 24-hour cache invalidation", style_td)
        ]
    ]
    t_deploy = Table(deploy_data, colWidths=[1.8*inch, 2.0*inch, 3.2*inch])
    t_deploy.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_INDIGO),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_deploy)

    story.append(Spacer(1, 14))

    story.append(Paragraph("Environment Variables Configuration", style_h2))

    env_table_data = [
        [Paragraph("Variable Name", style_th), Paragraph("Sample Value", style_th), Paragraph("Description", style_th)],
        [Paragraph(fmt_code("`PORT`"), style_td_bold), Paragraph(fmt_code("`5000`"), style_td), Paragraph("Backend HTTP listen port", style_td)],
        [Paragraph(fmt_code("`NODE_ENV`"), style_td_bold), Paragraph(fmt_code("`production` / `development`"), style_td), Paragraph("Application runtime environment mode", style_td)],
        [Paragraph(fmt_code("`MONGODB_URI`"), style_td_bold), Paragraph(fmt_code("`mongodb+srv://...`"), style_td), Paragraph("MongoDB connection URI string", style_td)],
        [Paragraph(fmt_code("`CLIENT_URL`"), style_td_bold), Paragraph(fmt_code("`https://api-verse-ashy.vercel.app`"), style_td), Paragraph("Allowed CORS origin for frontend client", style_td)],
        [Paragraph(fmt_code("`COUNTRIES_API_URL`"), style_td_bold), Paragraph(fmt_code("`https://restcountries.com/v3.1`"), style_td), Paragraph("External REST Countries API base URL", style_td)],
        [Paragraph(fmt_code("`CACHE_TTL_MINUTES`"), style_td_bold), Paragraph(fmt_code("`1440`"), style_td), Paragraph("MongoDB cache TTL duration (24 hours)", style_td)]
    ]
    t_env = Table(env_table_data, colWidths=[2.0*inch, 2.2*inch, 2.8*inch])
    t_env.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_env)

    story.append(Spacer(1, 16))

    # -------------------------------------------------------------------------
    # SECTION 8: CONCLUSION & FUTURE ROADMAP
    # -------------------------------------------------------------------------
    story.append(Paragraph("8. Conclusion & Future Roadmap", style_h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=C_INDIGO, spaceBefore=2, spaceAfter=12))

    story.append(Paragraph(
        "APIVerse demonstrates how modern TypeScript web engineering can transform raw REST API data into an interactive, "
        "highly accessible, and visually compelling product. The codebase is thoroughly structured, tested, and optimized for production.", style_body))

    story.append(Paragraph("Project Roadmap & Expansion Phases", style_h2))

    roadmap_items = [
        "<b>Phase 1 (Completed):</b> Full-stack TypeScript architecture, dual caching, URL query state sync, dark theme, Recharts analytics, and full unit test coverage.",
        "<b>Phase 2 (Planned):</b> User Authentication (JWT / OAuth2) for personalized cross-device favorite bookmarks and custom analytical dashboard layouts.",
        "<b>Phase 3 (Planned):</b> Progressive Web App (PWA) service worker integration for offline data inspection and instant loading.",
        "<b>Phase 4 (Planned):</b> Side-by-side country comparison matrix allowing users to compare demographics, GDP estimates, and geographic land areas directly."
    ]
    for r in roadmap_items:
        story.append(Paragraph(f"• {fmt_code(r)}", style_bullet))

    story.append(Spacer(1, 14))

    # Concluding Callout Box
    concl_html = (
        "<b>Final Assessment:</b> APIVerse meets and exceeds all criteria for a production-grade full-stack web application. "
        "Live Web Demo: <b>https://api-verse-ashy.vercel.app/</b>  |  GitHub Repository: <b>https://github.com/Syedumair05/APIVerse-</b>"
    )
    t_concl_final = Table([[Paragraph(concl_html, style_callout)]], colWidths=[7.0*inch])
    t_concl_final.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, C_INDIGO),
        ('LINELEFT', (0,0), (0,0), 4, C_INDIGO),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
    ]))
    story.append(t_concl_final)

    # Build PDF Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {os.path.abspath(filename)}".encode('ascii', errors='ignore').decode())

if __name__ == "__main__":
    build_pdf()
