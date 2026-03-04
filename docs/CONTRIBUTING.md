# Contributing to the Hacktivist Claims Tracker

Thank you for helping keep this tracker accurate and up to date. Here's how to contribute.

---

## Adding a new claim

1. Open `data/claims.json`
2. Add a new object at the end of the array, incrementing the `id`
3. Fill in all required fields (see schema in README)
4. Submit a pull request with a brief description of your source

**Required fields:** `id`, `group`, `alignment`, `attack_type`, `target`, `entity_type`, `country`, `date`, `independently_verified`, `credibility_tier`, `assessment`, `sources`

### Sourcing standards

- Every claim must have at least one named source
- Preferred sources (in priority order):
  1. Named security firms (Unit 42, Flashpoint, Check Point, Sophos, CrowdStrike, etc.)
  2. Established threat intel accounts (@FalconFeedsio, @H4ckmanac, @Cyberknow20)
  3. Credible journalism (SecurityWeek, BleepingComputer, The Record, etc.)
  4. Victim statements or government advisories
  5. Primary Telegram/X screenshots (with archival link)
- Do **not** use anonymous sources without corroboration
- Do **not** cite a hacktivist group's own Telegram as the only source for a "Confirmed" rating

---

## Updating a credibility assessment

If new evidence changes a tier (e.g., a "Plausible" claim is later confirmed or debunked):

1. Update the `credibility_tier` field
2. Update the `assessment` field to reflect the new information and cite the source
3. Add the new source to the `sources` field
4. Note the change in your PR description

---

## Credibility tier decision guide

Use the following questions to assign a tier:

### Almost Certainly Fabricated
- Has a named firm (Hudson Rock, Flashpoint, etc.) explicitly flagged this as fake?
- Is the claimed capability technically implausible (e.g., Iron Dome control, 160 data centers)?
- Is the scale wildly disproportionate to the group's known capability with zero sample evidence?
- Does it piggyback on an unrelated event (e.g., kinetic strike) to claim cyber credit?

→ **FABRICATED**

### Likely Exaggerated
- Is there some underlying activity possible, but the claimed scope/impact is overstated?
- Has a firm noted the group "routinely overstates impact"?
- Is the attack type within capability, but the claimed *effect* (sabotage, shutdown) unconfirmed?

→ **EXAGGERATED**

### Plausible but Unverified
- Is the claim consistent with the group's known TTPs and prior behavior?
- Is the attack type (DDoS, web defacement) within their documented capability?
- Has a firm acknowledged the claim without confirming or denying it?
- Is there no victim statement, no outage report, but also no debunking?

→ **PLAUSIBLE**

### Confirmed
- Has a named security firm, victim organization, or government body independently confirmed the attack?
- Is there technical evidence (APK on VirusTotal, leaked data independently verified, etc.)?
- Has the victim acknowledged investigation or breach?

→ **CONFIRMED**

---

## Code contributions

### Web app (`web/tracker.jsx`)
- The component reads from the inline `DATA` array — if you want it to load from `claims.json` dynamically, a fetch-based version is welcome as a separate file
- Keep Tailwind classes to core utilities only (no JIT/custom config required)
- Test in Claude.ai artifacts and CodeSandbox before submitting

### PDF generator (`pdf/generate_pdf.py`)
- ReportLab only — no additional dependencies
- Must produce a valid landscape A4 PDF
- Column widths are tuned for 50+ rows — test with your full dataset

---

## Style guide for assessments

Keep assessment text:
- **Concise** — 1–3 sentences max
- **Attributed** — always name the firm or analyst: `"Flashpoint: 'not clear if those claims are legitimate'"` not `"experts say"`
- **Specific** — cite *why* it's rated as it is, not just the tier label
- **Neutral** — describe what was claimed and what was verified; avoid editorializing

**Good:** `"Flashpoint: 'alarming claims not independently verified'; dashboard access is not system control; consistent with fabricated ICS pattern"`

**Bad:** `"Probably fake, typical Iranian exaggeration"`

---

## Pull request checklist

- [ ] JSON is valid (run `python3 -c "import json; json.load(open('data/claims.json'))"`)
- [ ] All required fields present
- [ ] Source is named and credible
- [ ] Credibility tier follows the decision guide above
- [ ] Assessment text is concise, attributed, and specific
- [ ] PR description explains what changed and why
