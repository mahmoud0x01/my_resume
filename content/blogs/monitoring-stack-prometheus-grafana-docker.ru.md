---
title: "Домашний стек мониторинга на Prometheus и Grafana с Docker"
date: 2024-12-10T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags: ["Monitoring","Prometheus","Grafana","Docker","System Administration","DevOps","Home Lab"]
categories: []
image: /images/prometheus-grafana-stack.png
description: "Разверните полнофункциональное решение мониторинга на Prometheus, Grafana и Alertmanager с помощью Docker Compose для домашней лабы или небольшой инфраструктуры."
toc: true
---
## Краткое резюме

Стек мониторинга для сисадмина: Prometheus (сбор метрик) + Grafana (визуализация) + Alertmanager (нотификации) + экспортёры (Node Exporter :9100, cAdvisor :8080, Blackbox Exporter :9115) — всё в Docker Compose.

**Состав:** архитектура (Grafana :3000 → Prometheus :9090 → Alertmanager :9093 и экспортёры), структура проекта (`docker-compose.yml`, `prometheus/prometheus.yml` + `alerts/rules.yml`, `alertmanager/alertmanager.yml`, `grafana/provisioning`), compose-конфиг (Prometheus `v2.47.0`, Grafana `10.1.0`, Alertmanager `v0.26.0`, Node Exporter `v1.6.1`, cAdvisor `v0.47.2`, Blackbox `v0.24.0`, networks/volumes, `GF_SECURITY_ADMIN_*`, `GF_INSTALL_PLUGINS`), конфиг Prometheus (`scrape_interval 15s`, `alertmanagers`, `scrape_configs` для prometheus/node-exporter/cadvisor/blackbox-http с `relabel_configs`), правила алертов (HighCPU >80% 5m, HighMemory >85%, LowDisk <15%, ServiceDown `up==0`, ContainerHighCPU/Memory/Restart), Alertmanager (route `group_by`, `telegram_configs` + email, `inhibit_rules`), provisioning Grafana (datasource Prometheus, dashboards `dashboard.yml`), деплой `.env` + `docker-compose up -d`, доступ (`localhost:3000/9090/9093/9100`), PromQL (CPU/memory/disk/network/container), добавление удалённых Node Exporter.

Масштабируется для хомлабов; для крупных — Thanos/Cortex.

> 🇷🇺 **Перевод в процессе** — выше краткое резюме. Полный гайд со всем YAML и PromQL: [English version](/blogs/monitoring-stack-prometheus-grafana-docker/).
> Docker Compose, YAML, PromQL и пути оставлены на английском.

