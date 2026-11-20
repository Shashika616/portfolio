# CVs

Three role-targeted, ATS-friendly CVs (two well-filled pages, every role in full) built from the same facts as the portfolio. Design follows the original CV: dark banner, spaced capitals, Poppins, bold ruled headings.

| File | Target roles | Leads with |
|---|---|---|
| `Shashika_Fernando_Software_Engineer_CV.pdf` | Software / Backend / Full-stack Engineer | Seefa platforms, identity, backend design, testing |
| `Shashika_Fernando_AI_Engineer_CV.pdf` | AI / LLM / Applied ML Engineer | Grounded LLM systems, fallback and agent loops, 3D U-Net |
| `Shashika_Fernando_Site_Reliability_Engineer_CV.pdf` | SRE / Platform / DevOps | Uptime, consolidation, failure handling, CI/CD, security |

## Rules they follow

- **ATS-safe:** single column, real selectable text, embedded Poppins (Arial fallback), the banner is page content not a header, no tables, icons, text boxes, headers or footers; contact details in the body; standard headings (Summary, Skills, Experience, Projects, Education, Certifications).
- **Bullets use Google's X-Y-Z shape:** what was achieved, how it was measured, how it was done.
- **Facts only.** Every number comes from the portfolio data (`app/data/*`) or Shashika's previous CV. Client projects are anonymous. Never add a figure without a source.
- **A4, two pages at most,** with page two well filled. Every role (Seefa, WSO2 including IAM) appears in full on every CV. Own products (TieHere, AshiruLabs) live on the portfolio, not the CVs. Check the page count after every edit.

## Edit and rebuild

1. Edit the HTML in `src/` (shared styles in `src/cv.css`).
2. Open the HTML in Chrome (online, so Poppins loads from Google Fonts), then Print → Save as PDF, Paper: A4, Margins: Default, Background graphics: on (needed for the dark banner). The page margins come from `@page` in `cv.css`.
3. Save over the matching PDF here, and copy-paste its text into a plain text editor to confirm the reading order is intact (the ATS test).

## Publish to the site

The portfolio's "Download CV" buttons open a picker (`app/components/ui/CvPicker.tsx`, list in `CVS` in `app/data/profile.ts`). After rebuilding a PDF:

```bash
cp cv/*.pdf public/cv/
cd public/cv && rm -f Shashika_Fernando_CVs.zip && zip -q -j Shashika_Fernando_CVs.zip Shashika_Fernando_*_CV.pdf
```
