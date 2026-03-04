# Hacktivist Claims Tracker
### Iran-Nexus & Pro-Russia Groups | Operation Epic Fury / Roaring Lion Cyber Dimension

> **Coverage period:** Feb 28 – Mar 3, 2026 &nbsp;·&nbsp; **50 claims tracked** &nbsp;·&nbsp; Compiled Mar 3, 2026

I created this because I got sick of monitoring multiple feeds and trying to combine them into one clear dataset just to  track whether the wave of primarily exaggerated/fabricated claims would shift targeting away from the Gulf Region and towards the US. A fully open, editable threat-intelligence tracker for pro-Iran and pro-Russia hacktivist claims following the US-Israel strikes on Iran (Operation Epic Fury / Operation Roaring Lion). Includes an **interactive React web app** and a **Python PDF generator** — both driven by a single shared `claims.json` dataset.

---

## What's included

```
hacktivist-tracker/
├── data/
│   └── claims.json          # Single source of truth — all 50 claims
├── web/
│   ├── tracker.jsx          # React component (runs in Claude.ai artifacts, CodeSandbox, etc.)
│   ├── index.html           # Standalone HTML version (no build step needed)
│   └── package.json         # For local Vite/React dev environment
├── pdf/
│   ├── generate_pdf.py      # ReportLab PDF generator — landscape A4
│   └── requirements.txt     # Python dependencies (just reportlab)
├── docs/
│   ├── CONTRIBUTING.md      # How to add/edit claims
│   ├── CREDIBILITY_TIERS.md # Tier definitions and usage guidance
│   └── SOURCES.md           # Source index and abbreviation key
└── README.md
```

---

## Quick start

### Option A — Run the web app (no install)

Paste `web/tracker.jsx` directly into:
- **Claude.ai** → New chat → Artifacts panel → paste as a React artifact
- **CodeSandbox** → New React sandbox → replace `App.jsx`
- **StackBlitz** → New Vite + React project → replace `src/App.jsx`

### Option B — Standalone HTML (truly zero dependencies)

```bash
# Just open in a browser — no server needed
open web/index.html
```

### Option C — Local React dev environment

```bash
cd web
npm install
npm run dev
# → http://localhost:5173
```

### Option D — Generate a PDF

```bash
cd pdf
pip install -r requirements.txt
python generate_pdf.py
# → outputs/hacktivist_claims_tracker.pdf
```

---

## Adding or editing claims

All claims live in **`data/claims.json`**. Each entry follows this schema:

```json
{
  "id": 51,
  "group": "Example Group",
  "alignment": "Iran-Nexus",
  "attack_type": "DDoS",
  "target": "Example Target Organization",
  "entity_type": "Government Ministry",
  "country": "Israel",
  "date": "2026-03-04",
  "independently_verified": "No",
  "credibility_tier": "Plausible but Unverified",
  "assessment": "Brief analyst assessment citing named source or firm.",
  "sources": "Source 1; Source 2; @TwitterHandle"
}
```

**Valid values for `credibility_tier`:**
| Value | Meaning |
|-------|---------|
| `Almost Certainly Fabricated` | No credible evidence; scale/nature implausible; flagged as fake by major firms |
| `Likely Exaggerated` | Some underlying activity possible, but scope/impact overstated |
| `Plausible but Unverified` | Consistent with group TTP; not independently confirmed |
| `Confirmed` | Independently verified by named security firm, media, or victim statement |

**Valid values for `alignment`:**
- `Iran-Nexus`
- `Iran-Nexus (MOIS/Void Manticore)`
- `Iran-Nexus (IRGC/Cotton Sandstorm)`
- `Iran-Nexus (hacktivist collective)`
- `Iran-Nexus / Pro-Palestinian`
- `Iran-Nexus / Pro-Russian (dual)`
- `Pro-Russia`
- `Pro-Russia (state-aligned)`
- `Financially motivated (opportunistic)`

After editing `claims.json`, both the web app and PDF generator will automatically pick up your changes — no other files need to be modified.

---

## Credibility framework

See [`docs/CREDIBILITY_TIERS.md`](docs/CREDIBILITY_TIERS.md) for the full framework. In brief:

| Badge | Color | Meaning |
|-------|-------|---------|
| **FABRICATED** | 🔴 Red | Almost Certainly Fabricated |
| **EXAGGERATED** | 🟠 Orange | Likely Exaggerated |
| **PLAUSIBLE** | 🟡 Yellow | Plausible but Unverified |
| **CONFIRMED** | 🟢 Green | Confirmed |

---

## Key sources used

| Abbreviation | Full name |
|---|---|
| Unit 42 | Palo Alto Networks Unit 42 Threat Brief |
| Flashpoint | Flashpoint Intelligence |
| Check Point | Check Point Research (CPR) |
| Sophos X-Ops | Sophos X-Ops Counter Threat Unit (CTU) |
| CrowdStrike | CrowdStrike (Adam Meyers, counter adversary ops) |
| Hudson Rock | Hudson Rock infostealer intelligence |
| SOCRadar | SOCRadar Dark Web Monitor |
| Halcyon RRC | Halcyon Ransomware Research Center |
| Truesec | Truesec threat research |
| CloudSEK | CloudSEK threat intelligence |
| @FalconFeedsio | FalconFeeds.io on X/Twitter |
| @H4ckmanac | Hackmanac on X/Twitter |
| @Cyberknow20 | CyberKnow on X/Twitter |

---

## Data caveat

> Most claims are unverified self-reports from hacktivist Telegram channels and X/Twitter posts. Credibility assessments reflect analyst judgments from named firms and should **not** be treated as confirmed incidents without independent validation. This dataset is for **situational awareness and threat intelligence research only** — not for attribution.

---

## Contributing

See [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md). PRs welcome for:
- New claims (with sources)
- Updated credibility assessments as new information emerges
- Additional groups
- Bug fixes in the web app or PDF generator

---

## License

MIT — free to use, adapt, and redistribute with attribution.
