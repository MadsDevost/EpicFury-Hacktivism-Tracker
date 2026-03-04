import { useState, useMemo } from "react";

// ─── TIER CONFIG ────────────────────────────────────────────────
const TIER = {
  "Almost Certainly Fabricated": {
    label: "FABRICATED",
    full: "Almost Certainly Fabricated",
    bg: "#C0392B", text: "#fff",
    rowBg: "#fdf2f1", rowBorder: "#e8b4b0",
    dot: "#C0392B"
  },
  "Likely Exaggerated": {
    label: "EXAGGERATED",
    full: "Likely Exaggerated",
    bg: "#D35400", text: "#fff",
    rowBg: "#fdf6f0", rowBorder: "#f0c8a0",
    dot: "#D35400"
  },
  "Plausible but Unverified": {
    label: "PLAUSIBLE",
    full: "Plausible / Unverified",
    bg: "#B7950B", text: "#fff",
    rowBg: "#fdfcf0", rowBorder: "#e8d98a",
    dot: "#B7950B"
  },
  "Confirmed": {
    label: "CONFIRMED",
    full: "Confirmed",
    bg: "#1A7A43", text: "#fff",
    rowBg: "#f0faf4", rowBorder: "#90d4a8",
    dot: "#1A7A43"
  },
};

// ─── ALIGNMENT CONFIG ────────────────────────────────────────────
const ALIGN_COLORS = {
  "Iran-Nexus (MOIS/Void Manticore)":        { bg: "#BBCFE8", badge: "#1A5276", light: "#9AC4E4" },
  "Iran-Nexus":                               { bg: "#BBCFE8", badge: "#1A5276", light: "#9AC4E4" },
  "Iran-Nexus / Pro-Palestinian":             { bg: "#BBCFE8", badge: "#154360", light: "#9AC4E4" },
  "Iran-Nexus / Pro-Palestinian (BD)":        { bg: "#BBCFE8", badge: "#154360", light: "#9AC4E4" },
  "Iran-Nexus (IRGC/Cotton Sandstorm)":       { bg: "#BBCFE8", badge: "#1A5276", light: "#9AC4E4" },
  "Iran-Nexus (hacktivist collective)":       { bg: "#BBCFE8", badge: "#1A5276", light: "#9AC4E4" },
  "Iran-Nexus (botnet-for-hire)":             { bg: "#BBCFE8", badge: "#1A5276", light: "#9AC4E4" },
  "Iran-Nexus (ideological RaaS)":            { bg: "#BBCFE8", badge: "#1A5276", light: "#9AC4E4" },
  "Iran-Nexus / Pro-Russian (dual)":          { bg: "#C3CAFE", badge: "#4527A0", light: "#A5ABEF" },
  "Pro-Russia (state-aligned)":             { bg: "#DEC8EF", badge: "#6C3483", light: "#CCAADF" },
  "Pro-Russia":                             { bg: "#DEC8EF", badge: "#6C3483", light: "#CCAADF" },
  "Financially motivated (opportunistic)":  { bg: "#D8DDE2", badge: "#2C3E50", light: "#C0C8CE" },
};

function getAlignColor(a) {
  return ALIGN_COLORS[a] || { bg: "#D8DDE2", badge: "#555", light: "#eee" };
}

// ─── DATA (all 50 claims) ─────────────────────────────────────────
const DATA = [
  // HANDALA
  { id:1,  group:"Handala Hack", alignment:"Iran-Nexus (MOIS/Void Manticore)", attack:"Phishing / Mobile malware (fake RedAlert APK)", target:"Israeli general public", entityType:"Civilian Population", country:"Israel", date:"2026-03-01", verified:"Yes", tier:"Confirmed", assessment:"APK independently analysed by Unit 42 on VirusTotal; Hebrew-language SMS phishing distributing surveillance malware confirmed; most technically verified claim in dataset", sources:"Unit 42 / Palo Alto Networks; VirusTotal; Cyble" },
  { id:2,  group:"Handala Hack", alignment:"Iran-Nexus (MOIS/Void Manticore)", attack:"Doxxing / Death threats via email", target:"Iranian-American & Iranian-Canadian influencers", entityType:"Private Individuals", country:"USA / Canada", date:"2026-03-02", verified:"Yes", tier:"Confirmed", assessment:"Threat emails published by Unit 42 (Figure 2 in threat brief); claims to have forwarded home addresses to physical operatives confirmed as real emails; physical threat element unverifiable", sources:"Unit 42; GBHackers; @FalconFeedsio" },
  { id:3,  group:"Handala Hack", alignment:"Iran-Nexus (MOIS/Void Manticore)", attack:"Hack & data breach", target:"Israeli civilian healthcare provider (unnamed)", entityType:"Healthcare Provider", country:"Israel", date:"2026-02-28", verified:"Partial", tier:"Plausible but Unverified", assessment:"Check Point (Gil Messing): 'somewhat, though not fully, credible — level of exaggeration'; Sophos: routinely overstates impact; breach of supplier does not equal breach of healthcare system. Clalit launched investigation (separate confirmed claim, see #4)", sources:"Check Point Research; Sophos X-Ops; Unit 42; Dark Reading" },
  { id:4,  group:"Handala Hack", alignment:"Iran-Nexus (MOIS/Void Manticore)", attack:"Data breach (10,000+ patient records)", target:"Clalit Health Services", entityType:"Healthcare Provider", country:"Israel", date:"2026-02-26", verified:"Partial", tier:"Plausible but Unverified", assessment:"Clalit confirmed investigation and activated monitoring; medical records attached to post appeared genuine; Check Point: 'group has real prior history of data theft'; scope of 10k+ records not independently confirmed", sources:"Times of Israel; Jerusalem Post; Check Point Research; SOCRadar" },
  { id:5,  group:"Handala Hack", alignment:"Iran-Nexus (MOIS/Void Manticore)", attack:"Ransomware / Data breach", target:"Israel Opportunity Energy", entityType:"Oil & Gas Company", country:"Israel", date:"2026-03-02", verified:"No", tier:"Likely Exaggerated", assessment:"Sophos: routinely overstates impact; RedPacket Security: no ransom amount or confirmed leak details; Handala wrote 'destruction of cyber infrastructures is currently underway' — typical psychological-effect messaging", sources:"Unit 42; RedPacket Security; Industrial Cyber; Sophos X-Ops" },
  { id:6,  group:"Handala Hack", alignment:"Iran-Nexus (MOIS/Void Manticore)", attack:"Infrastructure compromise", target:"Jordan fuel / energy systems (unnamed)", entityType:"Energy Infrastructure", country:"Jordan", date:"2026-02-28", verified:"No", tier:"Likely Exaggerated", assessment:"Sophos: routinely overstates capability; real intrusion possible but sabotage claim not corroborated; overlaps with APT Iran Jordan claim suggesting coordinated narrative amplification", sources:"Unit 42; Sophos X-Ops; SecurityWeek" },
  { id:7,  group:"Handala Hack", alignment:"Iran-Nexus (MOIS/Void Manticore)", attack:"Hack-and-leak / Defacement", target:"i24 News administrative interface", entityType:"Media / News", country:"Israel", date:"2026-03-02", verified:"No", tier:"Plausible but Unverified", assessment:"SOCRadar: specific system interface claimed; Check Point: 'quick and dirty' opportunistic targeting of low-hanging supply-chain systems consistent with recent Handala TTP; no data dump released", sources:"SOCRadar Dark Web Monitor; Check Point Research; @Cyberknow20" },
  { id:8,  group:"Handala Hack", alignment:"Iran-Nexus (MOIS/Void Manticore)", attack:"Data breach (1.3TB claimed)", target:"Sharjah National Petroleum Corp (SNOC)", entityType:"Oil & Gas / Critical Infra", country:"UAE", date:"2026-03-01", verified:"No", tier:"Plausible but Unverified", assessment:"FalconFeeds.io: 'no independent confirmation'; Check Point: Handala actively probing Gulf targets from Starlink IPs since Jan 2026; 1.3TB including financial statements claimed but unverified", sources:"@FalconFeedsio; Pravda EN; Check Point Research" },
  { id:9,  group:"Handala Hack", alignment:"Iran-Nexus (MOIS/Void Manticore)", attack:"Infrastructure destruction + cyber ops claim", target:"Saudi Aramco (total halt of oil extraction claimed)", entityType:"Oil & Gas / Critical Infra", country:"Saudi Arabia", date:"2026-03-02", verified:"No", tier:"Almost Certainly Fabricated", assessment:"FalconFeeds.io: 'claim likely part of ongoing cyber-information warfare — no independent confirmation'; Aramco Ras Tanura fire confirmed caused by Iranian drone debris NOT cyber; Iran's own military source denied Aramco cyber targeting", sources:"@FalconFeedsio; Al Jazeera; Times of Israel; Saudi Press Agency" },
  { id:10, group:"Handala Hack", alignment:"Iran-Nexus (MOIS/Void Manticore)", attack:"Cyber-info warfare / claimed 160+ data centers", target:"Israeli Govt & Military Comms infrastructure", entityType:"Government / Military", country:"Israel", date:"2026-03-02", verified:"No", tier:"Almost Certainly Fabricated", assessment:"Hudson Rock: 'many data breaches claimed in recent days are fake'; FalconFeedsio: unverified; scale of 160+ data centers is technically implausible for hacktivist actor; consistent with Handala disinfo pattern", sources:"@FalconFeedsio; Hudson Rock; SecurityWeek" },
  { id:11, group:"Handala Hack", alignment:"Iran-Nexus (MOIS/Void Manticore)", attack:"Threat declaration / mass email to citizens", target:"General Israeli & regional targets", entityType:"Multiple / Unspecified", country:"Israel", date:"2026-02-28", verified:"No", tier:"Plausible but Unverified", assessment:"Declaration consistent with Handala operational tempo; Sophos: group has sent mass emails in prior operations; no specific attack to evaluate at time of claim", sources:"@FalconFeedsio; Pravda EN; Industrial Cyber; Sophos X-Ops" },
  // APT IRAN
  { id:12, group:"APT Iran", alignment:"Iran-Nexus (hacktivist collective)", attack:"ICS / SCADA sabotage", target:"Jordanian grain silo (unnamed, Irbid)", entityType:"Agricultural / ICS Infrastructure", country:"Jordan", date:"2026-02-28", verified:"No", tier:"Almost Certainly Fabricated", assessment:"Flashpoint: 'not clear if those claims are legitimate'; ICS/SCADA sabotage is the most commonly fabricated claim category; no corroborating evidence from Jordanian authorities; overlap with Handala Jordan energy claim", sources:"Unit 42; Flashpoint; NextGov/FCW; Defense One" },
  { id:13, group:"APT Iran", alignment:"Iran-Nexus (hacktivist collective)", attack:"Hack & infrastructure sabotage", target:"Jordanian critical infrastructure (unnamed)", entityType:"Critical Infrastructure", country:"Jordan", date:"2026-02-28", verified:"No", tier:"Plausible but Unverified", assessment:"Sophos: APTIran ramped up Telegram activity; third-party attribution of APTIran to major campaigns; real intrusion possible; sabotage claim embellished per Sophos pattern analysis", sources:"Unit 42; Sophos X-Ops CTU; SOCRadar" },
  { id:14, group:"APT Iran", alignment:"Iran-Nexus (hacktivist collective)", attack:"Unverified compromise", target:"Israeli water control infrastructure", entityType:"Water / Critical Infra", country:"Israel", date:"2026-03-01", verified:"No", tier:"Almost Certainly Fabricated", assessment:"Sophos (CTU): Figure 4 — 'unverified compromise of Israeli water control infrastructure'; Flashpoint: alarming ICS claims not independently verified; no water disruption reported", sources:"Sophos X-Ops (Figure 4); Flashpoint; SecurityWeek" },
  // CYBER ISLAMIC RESISTANCE
  { id:15, group:"Cyber Islamic Resistance (CIR)", alignment:"Iran-Nexus", attack:"Hack / Data breach", target:"Israeli health insurance provider (unnamed)", entityType:"Healthcare Provider", country:"Israel", date:"2026-03-01", verified:"No", tier:"Likely Exaggerated", assessment:"Sophos: 'CIR claims have not been verified and may be exaggerated'; no disruption reported by health sector; Flashpoint: claim unverified", sources:"SecurityWeek; Unit 42; Flashpoint; Sophos X-Ops" },
  { id:16, group:"Cyber Islamic Resistance (CIR)", alignment:"Iran-Nexus", attack:"Compromise of drone defense system", target:"Israeli drone defense system (unnamed)", entityType:"Military / Defense System", country:"Israel", date:"2026-03-01", verified:"No", tier:"Almost Certainly Fabricated", assessment:"Unit 42: no drone disruption observed; military system access claim with zero evidence; consistent with disinformation pattern typical of CIR umbrella group", sources:"Unit 42; SecurityWeek; Cyble" },
  { id:17, group:"Cyber Islamic Resistance (CIR)", alignment:"Iran-Nexus", attack:"Hack / Payment infrastructure compromise", target:"Israeli payment infrastructure (unnamed)", entityType:"Financial Infrastructure", country:"Israel", date:"2026-03-01", verified:"No", tier:"Likely Exaggerated", assessment:"No payment disruptions reported; Sophos: CIR critical infrastructure claims unverified and likely exaggerated; consistent with CIR narrative amplification pattern", sources:"Unit 42; Sophos X-Ops; Flashpoint" },
  { id:18, group:"Cyber Islamic Resistance (CIR)", alignment:"Iran-Nexus", attack:"App disruption claim", target:"Home Front Command app (Oref)", entityType:"Govt App / Emergency Services", country:"Israel", date:"2026-02-28", verified:"Partial", tier:"Plausible but Unverified", assessment:"Israeli media independently reported app issues in same time window; causal link with CIR unconfirmed; may be opportunistic claim piggybacking on unrelated technical issue", sources:"@FalconFeedsio; Israeli media (Ynet); Unit 42" },
  // RIPPERSEC / CYB3RDRAG0NZZ
  { id:19, group:"RipperSec / Cyb3rDrag0nzz", alignment:"Iran-Nexus", attack:"DDoS / Website defacement", target:"Israeli websites (multiple, unnamed)", entityType:"Multiple Civilian Websites", country:"Israel", date:"2026-02-28", verified:"No", tier:"Plausible but Unverified", assessment:"Unit 42: DDoS and defacement within established capability; groups confirmed joining Electronic Operations Room; TTPs consistent with prior activity", sources:"@FalconFeedsio; Unit 42; Sophos X-Ops" },
  // DARK STORM TEAM
  { id:20, group:"Dark Storm Team", alignment:"Iran-Nexus / Pro-Palestinian", attack:"DDoS", target:"Israeli Ministry of Justice", entityType:"Government Ministry", country:"Israel", date:"2026-03-01", verified:"No", tier:"Plausible but Unverified", assessment:"Government website DDoS is most credible hacktivist claim type; within Dark Storm documented capability; Outpost24 tracks group activity", sources:"Unit 42; Outpost24; Cyble" },
  { id:21, group:"Dark Storm Team", alignment:"Iran-Nexus / Pro-Palestinian", attack:"DDoS", target:"Israeli National Police", entityType:"Law Enforcement", country:"Israel", date:"2026-03-01", verified:"No", tier:"Plausible but Unverified", assessment:"Same assessment as Ministry of Justice DDoS claim; consistent with Dark Storm's government/law enforcement targeting pattern", sources:"Unit 42; Outpost24" },
  { id:22, group:"Dark Storm Team", alignment:"Iran-Nexus / Pro-Palestinian", attack:"DDoS", target:"Israeli Ministry of Education", entityType:"Government Ministry", country:"Israel", date:"2026-03-01", verified:"No", tier:"Plausible but Unverified", assessment:"Consistent Dark Storm DDoS claim; government ministry targeting within capability", sources:"Unit 42; Outpost24" },
  { id:23, group:"Dark Storm Team", alignment:"Iran-Nexus / Pro-Palestinian", attack:"DDoS", target:"Israeli Supreme Court", entityType:"Judiciary", country:"Israel", date:"2026-03-01", verified:"No", tier:"Plausible but Unverified", assessment:"High-profile symbolic target; web-layer DDoS within group capability", sources:"Unit 42; Outpost24" },
  { id:24, group:"Dark Storm Team", alignment:"Iran-Nexus / Pro-Palestinian", attack:"DDoS", target:"Israeli bank (unnamed)", entityType:"Financial Institution", country:"Israel", date:"2026-03-01", verified:"No", tier:"Plausible but Unverified", assessment:"Financial DDoS harder to confirm; no disruption publicly reported; bank name not specified reduces confidence", sources:"Unit 42" },
  // FAD TEAM
  { id:25, group:"FAD Team (Fatimiyoun Cyber)", alignment:"Iran-Nexus", attack:"SQL injection / SCADA/PLC access", target:"Multiple Israeli SCADA/PLC systems (unnamed)", entityType:"Industrial Control Systems", country:"Israel", date:"2026-03-01", verified:"No", tier:"Almost Certainly Fabricated", assessment:"Flashpoint: 'alarming claims not independently verified'; monitoring dashboard access is not system control; SecurityWeek: Flashpoint said claims 'not clear if legitimate'; consistent with fabricated ICS pattern", sources:"Unit 42; SecurityWeek; Flashpoint; Sophos X-Ops" },
  // DIENET
  { id:26, group:"DieNet", alignment:"Iran-Nexus / Pro-Russian (dual)", attack:"DDoS / Service disruption", target:"Bahrain International Airport", entityType:"Airport / Transport", country:"Bahrain", date:"2026-02-28", verified:"No", tier:"Plausible but Unverified", assessment:"Airport web-layer DDoS within DieNet capability; no flight disruptions reported; FalconFeeds: 'no independent confirmation'", sources:"Unit 42; @FalconFeedsio; CIS/ThreatWA" },
  { id:27, group:"DieNet", alignment:"Iran-Nexus / Pro-Russian (dual)", attack:"DDoS / Service disruption", target:"Sharjah Airport", entityType:"Airport / Transport", country:"UAE", date:"2026-02-28", verified:"No", tier:"Plausible but Unverified", assessment:"Geographic error in original claim (listed as Saudi Arabia) adds doubt; FalconFeeds confirmed DieNet claim; no disruption reported", sources:"Unit 42; @FalconFeedsio" },
  { id:28, group:"DieNet", alignment:"Iran-Nexus / Pro-Russian (dual)", attack:"DDoS", target:"Riyadh Bank website", entityType:"Financial Institution", country:"Saudi Arabia", date:"2026-02-28", verified:"No", tier:"Plausible but Unverified", assessment:"Web-layer DDoS within capability; CIS/ThreatWA: 'likely did not cause significant outages'; no disruption confirmed", sources:"Unit 42; CIS/ThreatWA" },
  { id:29, group:"DieNet", alignment:"Iran-Nexus / Pro-Russian (dual)", attack:"DDoS / Service disruption", target:"Bank of Jordan", entityType:"Financial Institution", country:"Jordan", date:"2026-02-28", verified:"No", tier:"Plausible but Unverified", assessment:"Web-layer DDoS within capability; CIS: DieNet often targets minor web pages; no bank-side confirmation", sources:"Unit 42; @H4ckmanac; CIS/ThreatWA" },
  { id:30, group:"DieNet", alignment:"Iran-Nexus / Pro-Russian (dual)", attack:"DDoS / Service disruption", target:"UAE airport (unnamed)", entityType:"Airport / Transport", country:"UAE", date:"2026-02-28", verified:"No", tier:"Plausible but Unverified", assessment:"Airport name not specified reduces confidence; no disruption reported", sources:"Unit 42" },
  { id:31, group:"DieNet", alignment:"Iran-Nexus / Pro-Russian (dual)", attack:"DDoS (announced / threatened)", target:"Cypriot govt / British military base infrastructure", entityType:"Govt / Military Base", country:"Cyprus", date:"2026-03-02", verified:"No", tier:"Plausible but Unverified", assessment:"@Cyberknow20: 'UK has had nothing to do with current US/Israel-Iran fighting'; SOCRadar: DieNet framing Cyprus as target before public reporting confirmed; threat declared but execution not confirmed", sources:"@Cyberknow20; Industrial Cyber; SOCRadar" },
  // 313 TEAM
  { id:32, group:"313 Team (Islamic Cyber Resistance)", alignment:"Iran-Nexus", attack:"DDoS", target:"Kuwait Armed Forces", entityType:"Military / Defense", country:"Kuwait", date:"2026-03-02", verified:"No", tier:"Plausible but Unverified", assessment:"Government/military website DDoS is most credible claim type; consistent with 313 Team TTPs; Unit 42 assessed as active IRGC-aligned cell", sources:"Unit 42; @FalconFeedsio" },
  { id:33, group:"313 Team (Islamic Cyber Resistance)", alignment:"Iran-Nexus", attack:"DDoS", target:"Kuwait Ministry of Defense", entityType:"Government Ministry", country:"Kuwait", date:"2026-03-02", verified:"No", tier:"Plausible but Unverified", assessment:"Consistent with Kuwait Armed Forces claim; same assessment applies", sources:"Unit 42" },
  { id:34, group:"313 Team (Islamic Cyber Resistance)", alignment:"Iran-Nexus", attack:"DDoS", target:"Kuwait Government (general portal)", entityType:"Government", country:"Kuwait", date:"2026-03-02", verified:"No", tier:"Plausible but Unverified", assessment:"Consistent with group targeting pattern; SOCRadar reported related Keymous parallel campaign on same targets", sources:"Unit 42; @H4ckmanac" },
  { id:35, group:"313 Team (Islamic Cyber Resistance)", alignment:"Iran-Nexus", attack:"DDoS (9 targets simultaneously)", target:"Absher / Go Telecom / Salam / MoCommerce / MoEducation / MoFA / CST / Saudi Open Data / Saudi Press Agency", entityType:"Multiple Govt & Telecom", country:"Saudi Arabia", date:"2026-03-02", verified:"No", tier:"Plausible but Unverified", assessment:"High-volume simultaneous DDoS is a 313 Team pattern per @H4ckmanac; individual site availability not independently confirmed; consistent with established TTP", sources:"@H4ckmanac; HackRisk.io; Unit 42" },
  // SYLHET GANG
  { id:36, group:"Sylhet Gang-SG", alignment:"Iran-Nexus / Pro-Palestinian (BD)", attack:"DDoS / Compromise claim", target:"Saudi MoHA (HCM & Internal Mgmt Systems)", entityType:"Government Ministry", country:"Saudi Arabia", date:"2026-03-02", verified:"No", tier:"Likely Exaggerated", assessment:"Internal management system claim exceeds typical Sylhet Gang DDoS capability; CloudSEK: groups routinely claim internal access when actual impact is web-layer only", sources:"Unit 42; CloudSEK" },
  { id:37, group:"Sylhet Gang-SG", alignment:"Iran-Nexus / Pro-Palestinian (BD)", attack:"Warning / Threat declaration", target:"Bangladeshi civilian targets (future threat)", entityType:"Civilian Population", country:"Bangladesh", date:"2026-02-28", verified:"No", tier:"Plausible but Unverified", assessment:"Declaration only; no attack claimed; framing Bangladesh as potential target due to India-Israel-US geopolitical ties", sources:"@FalconFeedsio" },
  // MOROCCAN BLACK CYBER ARMY
  { id:38, group:"Moroccan Black Cyber Army", alignment:"Iran-Nexus / Pro-Palestinian", attack:"Website compromise", target:"TCS Communications (Tel Aviv)", entityType:"Telecommunications", country:"Israel", date:"2026-02-28", verified:"No", tier:"Plausible but Unverified", assessment:"FalconFeeds: 'no independent verification'; TCS Communications is a real Tel Aviv entity; within group capability; follows Cyber Islamic Resistance mobilization call", sources:"@FalconFeedsio" },
  // JEARMY
  { id:39, group:"JEArmy (Electronic Army of Al-Quds)", alignment:"Iran-Nexus", attack:"Hack / Data exfiltration (alleged 300GB+)", target:"Israeli military officers & soldiers (devices)", entityType:"Military Personnel / Devices", country:"Israel", date:"2026-02-28", verified:"No", tier:"Almost Certainly Fabricated", assessment:"Hudson Rock: claims of this scale flagged as fake; 300GB+ claim with zero sample evidence; no portion independently verified; typical propaganda scale inflation", sources:"@FalconFeedsio; Hudson Rock" },
  // KEYMOUS
  { id:40, group:"Keymous+ / Inteid", alignment:"Iran-Nexus", attack:"DDoS / Themed campaign", target:"Kuwait, Jordan, Saudi Arabia govt ministries (Interior, Finance, Education, Oil)", entityType:"Multiple Govt & Critical Infra", country:"Kuwait / Jordan / Saudi Arabia", date:"2026-03-02", verified:"No", tier:"Likely Exaggerated", assessment:"SOCRadar: screenshots show connection timeouts via public uptime services; standard DDoS methodology; coordinated with Inteid per Outpost24; no official government outage confirmation", sources:"SOCRadar Dark Web Monitor; @H4ckmanac; Outpost24" },
  // GHOSTSEC
  { id:41, group:"GhostSec", alignment:"Iran-Nexus / Pro-Palestinian", attack:"ICS compromise / Modbus & VSAT access claimed", target:"Israeli water management, ICS, satellite systems", entityType:"Industrial / Water / Satellite", country:"Israel", date:"2026-03-01", verified:"No", tier:"Likely Exaggerated", assessment:"Outpost24: GhostSec detailed multiphase campaign; Modbus/VSAT screenshots shared; CyberPress: 'analysts caution claims bear hallmarks of state-sponsored faketivism'; no independent confirmation of control", sources:"Outpost24; CyberPress; Unit 42" },
  // RUSSIA-ALIGNED
  { id:42, group:"NoName057(16)", alignment:"Pro-Russia", attack:"DDoS", target:"Israeli defense contractor (unnamed)", entityType:"Defense Contractor", country:"Israel", date:"2026-03-01", verified:"No", tier:"Plausible but Unverified", assessment:"Most credible DDoS actor in dataset; long documented track record; CrowdStrike confirmed DDoS activity; Truesec: state-linked to Russian CISM institute", sources:"SecurityWeek; Unit 42; Flashpoint; @Cyberknow20" },
  { id:43, group:"NoName057(16)", alignment:"Pro-Russia", attack:"DDoS", target:"Israeli municipal governments, political parties & telecom (multiple)", entityType:"Local Govt / Political / Telecom", country:"Israel", date:"2026-03-01", verified:"No", tier:"Plausible but Unverified", assessment:"Consistent with NoName pattern of targeting government web infrastructure; CrowdStrike confirmed surge in NoName DDoS activity; individual targets unnamed", sources:"SecurityWeek; Unit 42; Flashpoint; CrowdStrike" },
  { id:44, group:"Russian Legion", alignment:"Pro-Russia (state-aligned)", attack:"Alleged radar / system access", target:"Israel Iron Dome missile defense system", entityType:"Military / Defense System", country:"Israel", date:"2026-03-02", verified:"No", tier:"Almost Certainly Fabricated", assessment:"Iron Dome is air-gapped; real-time radar control claim is technically implausible; no security firm corroborated; Truesec: 'group uses language to create fear far beyond actual capabilities — limited to DDoS in reality'", sources:"Unit 42; SecurityWeek; Truesec; @FalconFeedsio" },
  { id:45, group:"Russian Legion", alignment:"Pro-Russia (state-aligned)", attack:"Alleged network intrusion", target:"IDF closed / internal servers", entityType:"Military Infrastructure", country:"Israel", date:"2026-03-02", verified:"No", tier:"Almost Certainly Fabricated", assessment:"Posted minutes after Iron Dome claim; IDF closed networks are air-gapped; rapid succession of implausible claims is hallmark of disinformation; Unit 42: unverified", sources:"Unit 42; Truesec" },
  { id:46, group:"Cardinal", alignment:"Pro-Russia (state-aligned)", attack:"Alleged intrusion / document leak", target:"IDF Magen Tsafoni (Northern Shield) document", entityType:"Military Document / Intelligence", country:"Israel", date:"2026-03-02", verified:"No", tier:"Almost Certainly Fabricated", assessment:"Unit 42: 'Cardinal likely lacks direct state funding'; posting plausible-looking documents is well-documented Russian/Iranian disinfo tactic; authenticity of document completely unverified", sources:"Unit 42; Ctech; @FalconFeedsio" },
  // REACTIVATED / EMERGING
  { id:47, group:"Cyber Toufan", alignment:"Iran-Nexus (IRGC/Cotton Sandstorm)", attack:"Hack & leak / Defacement (reactivated persona)", target:"Israeli organizations (reactivated persona)", entityType:"Multiple / Unspecified", country:"Israel", date:"2026-03-01", verified:"No", tier:"Plausible but Unverified", assessment:"Check Point: Cotton Sandstorm reactivated old hacktivist persona; group has real prior history of data theft and wiper attacks; Sophos: 'primarily engaging in unsophisticated tactics and narrative amplification'", sources:"Check Point Research; SecurityWeek; Sophos X-Ops" },
  { id:48, group:"BaqiyatLock (RaaS)", alignment:"Iran-Nexus (ideological RaaS)", attack:"Ransomware affiliate recruitment (open call)", target:"Israeli entities (open call, no specific target yet)", entityType:"Multiple / Unspecified", country:"Israel", date:"2026-03-01", verified:"No", tier:"Plausible but Unverified", assessment:"Sophos (CTU Figure 5): affiliate recruitment post confirmed real; offering free RaaS access to 'target the Zionist entity'; actual deployment not yet confirmed as of Mar 3", sources:"Sophos X-Ops; @FalconFeedsio" },
  { id:49, group:"HydraC2 (DDoS botnet)", alignment:"Iran-Nexus (botnet-for-hire)", attack:"DDoS (call to action)", target:"Israeli / US targets (unspecified)", entityType:"Multiple / Unspecified", country:"Israel / USA", date:"2026-03-01", verified:"No", tier:"Plausible but Unverified", assessment:"Halcyon RRC: botnet infrastructure real and observed; campaign execution not confirmed; Halcyon monitoring HydraC2 alongside Handala and Muddy Water APT", sources:"Halcyon RRC; SecurityWeek" },
  { id:50, group:"Cyber Support Front / Iranian Avenger / Cyb3r Drag0nz", alignment:"Iran-Nexus", attack:"Threat declarations / Narrative amplification", target:"Israeli organizations (unspecified)", entityType:"Multiple / Unspecified", country:"Israel", date:"2026-02-28", verified:"No", tier:"Plausible but Unverified", assessment:"Sophos CTU: 'emerging and reactivated groups primarily engaging in unsophisticated tactics, broad and embellished claims, and narrative amplification rather than delivering materially significant impacts'", sources:"Sophos X-Ops CTU; @FalconFeedsio" },
];

const TIER_ORDER = ["Almost Certainly Fabricated","Likely Exaggerated","Plausible but Unverified","Confirmed"];
const ALIGN_OPTIONS = ["All","Iran-Nexus","Pro-Russia","Iran-Nexus / Pro-Russian (dual)","Financially motivated"];

export default function App() {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    let d = [...DATA];
    if (tierFilter !== "All") d = d.filter(r => {
      if (tierFilter === "Iran-Nexus") return r.alignment.startsWith("Iran-Nexus") && !r.alignment.includes("Russian");
      if (tierFilter === "Pro-Russia") return r.alignment.startsWith("Pro-Russia");
      if (tierFilter === "Iran-Nexus / Pro-Russian (dual)") return r.alignment.includes("Pro-Russian") || r.alignment.includes("dual");
      if (tierFilter === "Financially motivated") return r.alignment.includes("Financial");
      return r.tier === tierFilter;
    });
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(r =>
        r.group.toLowerCase().includes(q) ||
        r.target.toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q) ||
        r.attack.toLowerCase().includes(q) ||
        r.tier.toLowerCase().includes(q) ||
        r.entityType.toLowerCase().includes(q)
      );
    }
    return d;
  }, [tierFilter, search]);

  const counts = useMemo(() => {
    const c = { total: DATA.length };
    TIER_ORDER.forEach(t => { c[t] = DATA.filter(r => r.tier === t).length; });
    return c;
  }, []);

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', 'Courier New', monospace", background: "#0f1117", minHeight: "100vh", color: "#e2e8f0" }}>
      {/* ── HEADER ── */}
      <div style={{ background: "linear-gradient(135deg, #1a1f2e 0%, #0f1117 100%)", borderBottom: "2px solid #2d3748", padding: "20px 24px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#64748b", marginBottom: 4, fontWeight: 700, textTransform: "uppercase" }}>
              ◈ OSINT TRACKER · OPERATION EPIC FURY / ROARING LION CYBER DIMENSION
            </div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
              Iran-Nexus &amp; Pro-Russia Hacktivist Claims
            </h1>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
              Feb 28 – Mar 3, 2026 &nbsp;·&nbsp; {counts.total} claims tracked &nbsp;·&nbsp; Compiled Mar 3, 2026
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {TIER_ORDER.map(t => {
              const tc = TIER[t];
              const active = tierFilter === t;
              return (
                <button key={t} onClick={() => setTierFilter(active ? "All" : t)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 4,
                    background: active ? tc.bg : "#1e2535", border: `1px solid ${active ? tc.bg : "#374151"}`,
                    color: active ? tc.text : "#9ca3af", cursor: "pointer", fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.08em", fontFamily: "inherit", transition: "all 0.15s" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: tc.bg, display: "inline-block", flexShrink: 0 }} />
                  <span>{tc.label}</span>
                  <span style={{ background: active ? "rgba(255,255,255,0.2)" : "#374151", borderRadius: 3, padding: "1px 5px", fontSize: 10 }}>
                    {counts[t]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend row */}
        <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.12em", textTransform: "uppercase", marginRight: 4 }}>ALIGNMENT</span>
          {[
            { key: "Iran-Nexus", label: "Iran-Nexus", bg: "#1A5276", rowBg: "#0e1e33" },
            { key: "Pro-Russia", label: "Pro-Russia", bg: "#6C3483", rowBg: "#1a0d24" },
            { key: "Iran-Nexus / Pro-Russian (dual)", label: "Dual / Mixed", bg: "#4527A0", rowBg: "#130f22" },
            { key: "Financially motivated", label: "Financially Motivated", bg: "#2C3E50", rowBg: "#141a20" },
          ].map(a => (
            <button key={a.key} onClick={() => setTierFilter(tierFilter === a.key ? "All" : a.key)}
              style={{ padding: "4px 9px", borderRadius: 4, background: tierFilter === a.key ? a.bg : "#1e2535",
                border: `1px solid ${tierFilter === a.key ? a.bg : "#374151"}`, color: tierFilter === a.key ? "#fff" : "#9ca3af",
                cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", fontFamily: "inherit" }}>
              {a.label}
            </button>
          ))}
          {tierFilter !== "All" && (
            <button onClick={() => setTierFilter("All")}
              style={{ padding: "4px 9px", borderRadius: 4, background: "transparent", border: "1px solid #C0392B",
                color: "#ef4444", cursor: "pointer", fontSize: 10, fontFamily: "inherit", letterSpacing: "0.06em" }}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* Search */}
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search group, target, country, attack type, entity type…"
            style={{ background: "#1e2535", border: "1px solid #374151", borderRadius: 6, padding: "7px 12px",
              color: "#e2e8f0", fontSize: 11, fontFamily: "inherit", width: "100%", maxWidth: 480, outline: "none" }} />
          <span style={{ fontSize: 11, color: "#64748b", whiteSpace: "nowrap" }}>
            {filtered.length} / {DATA.length} claims
          </span>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div style={{ overflowX: "auto", padding: "0 0 40px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ background: "#161b27", borderBottom: "2px solid #2d3748" }}>
              {["Hacktivist Group","Alignment","Attack Type","Entity Targeted","Type","Country","Date","Credibility Tier","Assessment","Sources"].map(h => (
                <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontSize: 9, fontWeight: 700,
                  color: "#64748b", letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
              <th style={{ width: 28 }} />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={11} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
                No results match your current filters.
              </td></tr>
            )}
            {filtered.map((row, i) => {
              const tc = TIER[row.tier];
              const ac = getAlignColor(row.alignment);
              const isExpanded = expandedId === row.id;
              const rowBg = isExpanded ? "#1a2030" : (i % 2 === 0 ? "#0f1117" : "#12161f");
              return [
                <tr key={row.id} onClick={() => setExpandedId(isExpanded ? null : row.id)}
                  style={{ background: rowBg, borderBottom: `1px solid #1e2535`,
                    cursor: "pointer", transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#1a1f2e"}
                  onMouseLeave={e => e.currentTarget.style.background = rowBg}>

                  {/* Group */}
                  <td style={{ padding: "9px 12px", borderLeft: `3px solid ${tc.bg}` }}>
                    <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 11 }}>{row.group}</div>
                  </td>
                  {/* Alignment */}
                  <td style={{ padding: "9px 12px" }}>
                    <span style={{ background: ac.light+"22", border: `1px solid ${ac.badge}44`,
                      color: ac.badge === "#1A5276" ? "#60a5fa" : ac.badge === "#6C3483" ? "#c084fc" : ac.badge === "#4527A0" ? "#a78bfa" : "#94a3b8",
                      padding: "2px 7px", borderRadius: 3, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                      {row.alignment.replace("(MOIS/Void Manticore)","").replace("(state-aligned)","").replace("(hacktivist collective)","").replace("(botnet-for-hire)","").replace("(ideological RaaS)","").replace("(IRGC/Cotton Sandstorm)","").trim()}
                    </span>
                  </td>
                  {/* Attack */}
                  <td style={{ padding: "9px 12px", color: "#cbd5e1", maxWidth: 160 }}>{row.attack}</td>
                  {/* Target */}
                  <td style={{ padding: "9px 12px", color: "#f1f5f9", fontWeight: 600, maxWidth: 220 }}>{row.target}</td>
                  {/* Entity Type */}
                  <td style={{ padding: "9px 12px", color: "#94a3b8", fontSize: 10, whiteSpace: "nowrap" }}>{row.entityType}</td>
                  {/* Country */}
                  <td style={{ padding: "9px 12px", color: "#94a3b8", whiteSpace: "nowrap" }}>{row.country}</td>
                  {/* Date */}
                  <td style={{ padding: "9px 12px", color: "#94a3b8", whiteSpace: "nowrap" }}>{row.date}</td>
                  {/* Tier Badge */}
                  <td style={{ padding: "9px 12px" }}>
                    <span style={{ background: tc.bg, color: tc.text, padding: "3px 8px", borderRadius: 4,
                      fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", whiteSpace: "nowrap", display: "inline-block" }}>
                      {tc.label}
                    </span>
                  </td>
                  {/* Assessment */}
                  <td style={{ padding: "9px 12px", color: "#94a3b8", fontSize: 10, maxWidth: 300 }}>
                    <div style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {row.assessment}
                    </div>
                  </td>
                  {/* Sources */}
                  <td style={{ padding: "9px 12px", color: "#64748b", fontSize: 10, maxWidth: 200 }}>
                    <div style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {row.sources}
                    </div>
                  </td>
                  {/* Expand */}
                  <td style={{ padding: "9px 8px", textAlign: "center", color: "#475569" }}>
                    <span style={{ fontSize: 10 }}>{isExpanded ? "▲" : "▼"}</span>
                  </td>
                </tr>,

                isExpanded && (
                  <tr key={`exp-${row.id}`} style={{ background: "#141926", borderBottom: `2px solid ${tc.bg}44` }}>
                    <td colSpan={11} style={{ padding: "0" }}>
                      <div style={{ borderLeft: `4px solid ${tc.bg}`, margin: "0", padding: "16px 20px 16px 20px",
                        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                        {/* Col 1: Credibility */}
                        <div>
                          <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>
                            CREDIBILITY ASSESSMENT
                          </div>
                          <div style={{ marginBottom: 10 }}>
                            <span style={{ background: tc.bg, color: tc.text, padding: "4px 10px", borderRadius: 4,
                              fontSize: 10, fontWeight: 800, letterSpacing: "0.08em" }}>
                              {tc.full}
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: "#cbd5e1", lineHeight: 1.6 }}>
                            {row.assessment}
                          </div>
                        </div>
                        {/* Col 2: Details */}
                        <div>
                          <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>
                            CLAIM DETAILS
                          </div>
                          <table style={{ width: "100%", fontSize: 10 }}>
                            {[
                              ["Group", row.group],
                              ["Alignment", row.alignment],
                              ["Attack Type", row.attack],
                              ["Entity Type", row.entityType],
                              ["Country", row.country],
                              ["Date", row.date],
                              ["Independently Verified", row.verified],
                            ].map(([k,v]) => (
                              <tr key={k}>
                                <td style={{ color: "#64748b", padding: "2px 8px 2px 0", whiteSpace: "nowrap", fontWeight: 700 }}>{k}</td>
                                <td style={{ color: "#e2e8f0", padding: "2px 0" }}>{v}</td>
                              </tr>
                            ))}
                          </table>
                        </div>
                        {/* Col 3: Sources */}
                        <div>
                          <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>
                            SOURCE ATTRIBUTION
                          </div>
                          <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7 }}>
                            {row.sources.split(";").map((s,i) => (
                              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 3 }}>
                                <span style={{ color: "#475569", marginTop: 2 }}>▸</span>
                                <span>{s.trim()}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ background: tc.bg+"33", border: `1px solid ${tc.bg}`, color: tc.bg === "#C0392B" ? "#f87171" : tc.bg === "#D35400" ? "#fb923c" : tc.bg === "#B7950B" ? "#facc15" : "#4ade80",
                              padding: "2px 8px", borderRadius: 3, fontSize: 9, fontWeight: 700 }}>{tc.full}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              ];
            })}
          </tbody>
        </table>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: "#0a0d14", borderTop: "1px solid #1e2535", padding: "16px 24px" }}>
        <div style={{ fontSize: 9, color: "#475569", lineHeight: 1.7, maxWidth: 1200 }}>
          <span style={{ color: "#f59e0b", fontWeight: 800 }}>⚠ DATA CAVEAT</span>{" "}
          This tracker is compiled from open-source intelligence as of March 3, 2026. The vast majority of hacktivist claims during active geopolitical conflicts are unverified, exaggerated, or deliberately fabricated for psychological effect.
          Credibility assessments reflect analyst judgments from:&nbsp;
          <span style={{ color: "#94a3b8" }}>Unit 42/Palo Alto Networks · Flashpoint · Check Point Research · CrowdStrike (Adam Meyers) · Sophos X-Ops CTU · Hudson Rock · Halcyon RRC · Truesec · CloudSEK · SOCRadar Dark Web Monitor · SecurityWeek</span>
          &nbsp;and social intelligence from&nbsp;
          <span style={{ color: "#94a3b8" }}>@FalconFeedsio · @H4ckmanac · @Cyberknow20 · HackRisk.io · Outpost24</span>.
          &nbsp;Claims marked "Almost Certainly Fabricated" may still reflect some underlying lower-level activity. For situational awareness only — not for attribution without independent confirmation.
        </div>
      </div>
    </div>
  );
}
