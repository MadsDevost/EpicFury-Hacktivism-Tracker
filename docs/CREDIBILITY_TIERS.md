# Credibility Tier Definitions

This tracker uses a four-tier credibility system adapted from the intelligence community's confidence-level framework, calibrated for hacktivist claim analysis during active geopolitical conflicts.

---

## The Four Tiers

### 🔴 Almost Certainly Fabricated
**Badge color:** Red (`#C0392B`)

The claim is almost certainly false, inflated, or deliberately manufactured for psychological effect or propaganda purposes. One or more of the following applies:

- A named security firm or intelligence organization has explicitly assessed the claim as fake or implausible
- The claimed capability is technically impossible or implausible given the group's known resources (e.g., claiming control of an air-gapped military system)
- The claimed scale is wildly disproportionate to the group's established capability, with zero sample evidence provided
- The claim piggybacks on a kinetic or unrelated event to falsely claim cyber credit
- Hudson Rock, Flashpoint, or a comparable firm has flagged claims of this type from this period as fake

**Examples from this dataset:**
- Russian Legion claiming real-time control of Israel's Iron Dome radar system
- JEArmy claiming 300GB+ exfiltration from Israeli military devices with no sample data
- Handala claiming compromise of 160+ Israeli government data centers

---

### 🟠 Likely Exaggerated
**Badge color:** Orange (`#D35400`)

Some underlying cyber activity likely occurred, but the group has materially overstated the scope, impact, or sophistication of the operation. The true effect is probably limited to web-layer disruption (DDoS, defacement) rather than the claimed infrastructure compromise or data theft.

- The group has a documented pattern of overstating impact (e.g., Sophos notes Handala "routinely overstates capability")
- The attack type claimed (DDoS) is within capability, but the claimed *effect* (system shutdown, data sabotage) is not corroborated
- No victim statement, outage report, or independent technical evidence supports the scope claimed
- CloudSEK or similar firms note the group "claims internal access when actual impact is web-layer only"

**Examples from this dataset:**
- Handala claiming compromise of Jordan's fuel systems (DDoS plausible; sabotage not corroborated)
- Sylhet Gang-SG claiming internal Saudi MoHA system access (DDoS capability confirmed; internal access claim not)
- Keymous+/Inteid coordinated campaign (screenshots of timeouts confirm DDoS; no confirmed disruption)

---

### 🟡 Plausible but Unverified
**Badge color:** Yellow (`#B7950B`)

The claim is consistent with the group's known tactics, techniques, and procedures (TTPs) and targeting patterns. No independent evidence confirms or denies the claim. Neither the attack type nor the claimed impact has been corroborated, but there is no specific reason to dismiss it.

- Attack type (e.g., DDoS of a government website, data theft from a small firm) is within the group's documented capability
- Targeting is consistent with prior behavior
- No named security firm has flagged the claim as fabricated
- No victim statement confirming or denying
- The claim has been acknowledged (but not confirmed) by at least one monitoring source

**Examples from this dataset:**
- DieNet DDoS against Bahrain International Airport (within capability; no flight disruption; no confirmation)
- 313 Team DDoS against Kuwait Ministry of Defense (consistent TTP; no independent check)
- Cardinal posting purported IDF document (plausible-looking; authenticity unknown)

---

### 🟢 Confirmed
**Badge color:** Green (`#1A7A43`)

The claim has been independently verified by a named security firm, victim organization, government body, or technical artifact. At least one of the following:

- A named security firm has technically confirmed the attack (e.g., APK analyzed on VirusTotal)
- The victim organization has acknowledged a breach or investigation
- A government CERT or advisory has confirmed the incident
- Independent technical evidence (leaked data verified as genuine, defacement captured by independent monitor, etc.) exists

**Examples from this dataset:**
- Handala fake RedAlert APK: Unit 42 confirmed analysis on VirusTotal
- Handala death threats to influencers: Unit 42 published the actual email (Figure 2 in threat brief)

---

## Why so few "Confirmed" entries?

This is intentional and reflects reality. During active geopolitical conflicts:

1. **Hacktivist groups are incentivized to lie.** Psychological impact often matters more to them than operational reality.
2. **Victims are incentivized to stay quiet.** Confirming a breach creates legal, reputational, and operational problems.
3. **Security firms need time.** Technical analysis of claims takes days to weeks; this tracker covers a 3-day window.
4. **The conflict itself creates noise.** With 60+ groups simultaneously claiming attacks, attribution and verification is extremely difficult.

A "Plausible but Unverified" rating does **not** mean the attack didn't happen. It means there is insufficient public evidence to confirm or deny it.

---

## Using this framework for your own analysis

When assessing a new claim, ask in order:

1. **Has a named firm explicitly debunked this?** → Fabricated
2. **Is the claimed effect technically impossible?** → Fabricated
3. **Does the group have a documented pattern of exaggeration?** → Likely Exaggerated
4. **Is the claimed *effect* (not just attack type) unsupported?** → Likely Exaggerated
5. **Is the attack type within capability and targeting consistent with prior behavior?** → Plausible but Unverified
6. **Is there independent technical or institutional confirmation?** → Confirmed

---

## Analyst citations

The credibility assessments in this tracker draw on public statements from:

| Firm / Analyst | Key finding used in assessments |
|---|---|
| Unit 42 / Palo Alto Networks | Primary source for group listings; ICS claim skepticism |
| Flashpoint | ICS/grain silo claims "not clear if legitimate"; "alarming claims" framing |
| Check Point Research (Gil Messing) | Handala "somewhat credible — level of exaggeration" |
| Sophos X-Ops CTU | "Surge in activity but not escalation in risk"; group-specific overstatement patterns |
| CrowdStrike (Adam Meyers) | "Claim-driven rather than evidence-backed" for hacktivist DDoS surge |
| Hudson Rock | "Many data breaches claimed in recent days are fake" |
| Truesec | Russian Legion "limited to DDoS and web defacement in reality" |
| CloudSEK | Groups "claim internal access when actual impact is web-layer only" |
| SOCRadar Dark Web Monitor | Real-time Telegram/dark web monitoring; uptime-tool screenshot analysis |
| Halcyon RRC | HydraC2 botnet confirmation; ICS monitoring |
