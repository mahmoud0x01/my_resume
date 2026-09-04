---
title: "Распространённые уязвимости AWS IAM и митигации: уроки из реального баг-хантинга и лабораторных симуляций"
date: 2026-03-28T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags: ["Cloud Security", "AWS", "IAM", "Misconfiguration", "Privilege Escalation", "Bug Bounty", "DevSecOps"]
categories: ["Security Research"]
image: /images/aws-iam-lab.png
description: "На основе реальных паттернов баг-баунти — 5 мисконфигураций AWS IAM, которые я ищу (избыточные политики, trusts AssumeRole, пути эскалации привилегий) — воспроизведены в лабораторном AWS-аккаунте с доказательствами ScoutSuite/Prowler и митигациями."
toc: true
---
> **Примечание исследования:** Ниже — комбинация (a) анонимизированных паттернов из авторизованного баг-баунти (без клиентских данных, хосты скрыты) и (b) воспроизведённых мисконфигураций в изолированном лаб-аккаунте AWS (ID `000000000000`, `example.com`). Прод-аккаунты без авторизации не тестировались.

## Краткое резюме

IAM — главный риск облака, потому что это лестница: один wildcard превращает низкопривилегированный ключ в захват аккаунта. В материале — **5 мисконфигураций**, которые я реально ханчу: (1) избыточные `*:*` / `iam:*` (`AdministratorAccess` на CI-юзер`, `Action:"*" Resource:"*"`), (2) wildcard trust `Principal:"*"`/`AWS:"*"` без `Condition` на `AssumeRole`, (3) эскалация через `iam:PassRole` + `ec2:RunInstances` / `lambda:CreateFunction` (техника Rhino Security Labs, кража кредов через `http://169.254.169.254/latest/meta-data/iam/security-credentials/`), (4) ключи старше 90 дней / утечки в Git (`AKIA[REDACTED]`, `git-secrets`/`trufflehog`), (5) утечки S3 через `s3:*` на `*` + bucket `Principal:"*"`.

Методология: энумерация через `iam:SimulatePrincipalPolicy` и `GetAccountAuthorizationDetails`, ручной ревью trust-политик (`ExternalId`, `aws:PrincipalOrgID`, `ArnLike`), два сканера в лабе `scout --provider aws` (ScoutSuite) и `prowler aws --checks iam_*`, затем ручной разбор JSON → воспроизведение на `lab-*` ролях/юзерах → доказательства (`simulate-principal-policy allowed`, Prowler FAIL, ScoutSuite `iam-role-with-wildcard-principal`) → фикс least privilege + conditions/boundaries → PASS.

Митигации: least privilege + Access Analyzer, permission boundaries, условия `ArnLike`/`PrincipalOrgID`/`ExternalId`/`SourceAccount`, скоупинг `iam:PassedToService: ec2.amazonaws.com`, 90-дневная ротация, Secrets Manager, MFA, CloudTrail + GuardDuty, SCPs + S3 Block Public Access (`aws:SecureTransport`, `s3:ResourceAccount`).

> 🇷🇺 **Перевод в процессе** — выше краткое резюме. Полный разбор с JSON-политиками, выводами `aws iam simulate-principal-policy`, Prowler и чек-листом: [English version](/blogs/aws-iam-common-vulns-mitigations/).
> Команды AWS CLI, ARN, политики JSON, ScoutSuite/Prowler оставлены на английском.

