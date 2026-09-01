# ADR: Add ELK SOC Home Lab detection-engineering RESEARCH post and title image

- Date: 2026-08-31
- Type: Architectural Decision Record
- Status: accepted
- Tags: blog, soc, elk, siem, detection-engineering, sigma, kibana, auditd, hugo
- Affected files: content/blogs/elk-siem-soc-home-lab-detection-engineering.md, static/images/elk-siem-lab.png

## Decision

Created Hugo blog post content/blogs/elk-siem-soc-home-lab-detection-engineering.md (frontmatter 2026-03-15, tags SIEM/ELK/SOC/Sigma/Kibana/Auditd, toc true, image /images/elk-siem-lab.png) with 8 sections: Summary, Architecture (ELK 8.12 Docker Compose, 2 VMs, sanitized compose), Ingestion & Parsing (Filebeat auth/audit/syslog, sanitized logs + grok), Detection Engineering (5 Sigma table MITRE T1548.003/T1110.001/T1053.003/T1222/T1059.004), Kibana dashboards + 5-step triage with 24 failed sshd from 10.0.0.15 -> check auth.log -> check auditd -> verdict trace, Tuning (180→12/day, ansible exclusion, -34% FP), Validation Evidence (filebeat test output, curl _cat/indices, curl _count 51234), Takeaways (ElastAlert, Suricata, MITRE expansion); generated static/images/elk-siem-lab.png via PIL 1200x630 dark navy gradient #0b1020→#162040, teal subtitle, glass ELK cards + Kibana chart.

## Rationale

Flagship SOC proof needs hands-on lab narrative, not generic advice: isolated Ubuntu 22.04 + ELK 8.12 Docker, real Filebeat/Logstash grok, MITRE-mapped Sigma, measurable tuning (-93% noisy rule, -34% overall) and documented triage workflow to evidence detection-engineering for SOC hiring; labs-only disclaimer prevents prod confusion; PIL image avoids external asset dependency and matches Gravity Atlas premium palette.

## Affected Files

- `content/blogs/elk-siem-soc-home-lab-detection-engineering.md`
- `static/images/elk-siem-lab.png`
