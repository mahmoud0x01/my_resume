# ADR: Maximize hiring for PEN TESTER / SOC ANALYST worldwide via config and resume

- Date: 2026-09-01
- Type: Architectural Decision Record
- Status: accepted
- Tags: seo, hiring, pen-tester, soc-analyst, worldwide, hugo, resume, toolkit, projects
- Affected files: hugo.yaml, resume-source/MahmoudAdel_Cybersecurity_Resume.html

## Decision

Updated hugo.yaml params.location to 'Alexandria, Egypt · Open to Relocation Worldwide (Remote & On-site)', description to 150-char SEO string 'Junior Penetration Tester & SOC Analyst — penetration testing, SIEM/ELK, incident response, cloud security AWS IAM, bug bounty, responsible disclosure' covering all 6 required substrings, keywords to 399-char string containing soc analyst/siem/elk stack/splunk/incident response/cloud security/aws iam/scout suite/prowler/digital forensics/threat hunting/sigma/yara/mitre attack plus existing. Added 2 featured projects ELK SOC Home Lab and IR Lab (both featured true with /images/elk-siem-lab.png, /images/ir-malware-triage-lab.png) plus AWS IAM lab as non-featured (featured false, /images/aws-iam-lab.png) keeping TicketPro/CollabEditor featured (total 4 featured). Bastion experience now quantifies 8 web apps & 2 network ranges, 11 findings, 6 Linux +4 Windows, 8 reports 0 rework; TSU now 2 prototypes, 12 diagrams. Toolkit APPLIED now includes SIEM (ELK), Incident Response, MITRE ATT&CK, Cloud Security (AWS IAM) (14 items) and FAMILIAR adds YARA/Sigma/Suricata/Splunk lab (15 items). Resume updated location, positioning 'Penetration Testing · SOC / Incident Response · Cloud Security (AWS IAM) · ELK/Splunk Lab', profile with 50k events/5 Sigma and cloud IAM, Bastion quantified, offensive/systems skills with lab markers.

## Rationale

Hiring for PEN TESTER/SOC requires both pen-test proof (Bugcrowd, Bastion) and SOC/SecOps proof (SIEM, IR, cloud IAM). Previous location was local-only; worldwide relocation signal expands recruiter pool. Description previously lacked SOC terms; new 150-char string keeps formal titles while adding SIEM/ELK, incident response, cloud security AWS IAM under 165-char SEO limit. Keywords previously 298 chars lacked SOC stack; new 399-char keeps all existing and adds 14 SOC/cloud terms staying under 400. Two new featured SOC labs (ELK 50k events 5 Sigma, IR Sysmon/KAPE) provide hands-on SOC evidence before engineering projects, keeping 2-col grid via 4 featured. Bastion now provides quantified impact without inventing tenure. Toolkit moves MITRE to APPLIED and adds SOC/cloud to APPLIED, FAMILIAR gains YARA/Sigma/Suricata/Splunk for honest lab exposure. Resume mirrors site honesty (lab markers, authorized-scope, worldwide location).

## Affected Files

- `hugo.yaml`
- `resume-source/MahmoudAdel_Cybersecurity_Resume.html`
