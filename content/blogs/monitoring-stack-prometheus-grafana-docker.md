---
title: "Building a Home Lab Monitoring Stack with Prometheus and Grafana"
date: 2024-12-10T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags:
  - Monitoring
  - Prometheus
  - Grafana
  - Docker
  - System Administration
  - DevOps
  - Home Lab
image: /images/prometheus-grafana-stack.png
description: "Set up a complete monitoring solution with Prometheus, Grafana, and Alertmanager using Docker Compose for your home lab or small infrastructure."
toc: true
---

Every system administrator needs visibility into their infrastructure. In this guide, we'll build a complete monitoring stack using Prometheus for metrics collection, Grafana for visualization, and Alertmanager for notifications—all containerized with Docker Compose.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Monitoring Stack                      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   Grafana   │──│  Prometheus │──│  Alertmanager   │  │
│  │  :3000      │  │  :9090      │  │  :9093          │  │
│  └─────────────┘  └──────┬──────┘  └─────────────────┘  │
│                          │                               │
│  ┌───────────────────────┼───────────────────────────┐  │
│  │                 Exporters                          │  │
│  ├─────────────┬─────────────┬─────────────┬─────────┤  │
│  │ Node        │ cAdvisor    │ Blackbox    │ Custom  │  │
│  │ Exporter    │ (Docker)    │ Exporter    │ Apps    │  │
│  │ :9100       │ :8080       │ :9115       │         │  │
│  └─────────────┴─────────────┴─────────────┴─────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Project Structure

```bash
monitoring/
├── docker-compose.yml
├── prometheus/
│   ├── prometheus.yml
│   └── alerts/
│       └── rules.yml
├── alertmanager/
│   └── alertmanager.yml
├── grafana/
│   └── provisioning/
│       ├── dashboards/
│       │   ├── dashboard.yml
│       │   └── node-exporter.json
│       └── datasources/
│           └── prometheus.yml
└── .env
```

## Docker Compose Configuration

Create `docker-compose.yml`:

```yaml
version: '3.8'

networks:
  monitoring:
    driver: bridge

volumes:
  prometheus_data: {}
  grafana_data: {}
  alertmanager_data: {}

services:
  prometheus:
    image: prom/prometheus:v2.47.0
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./prometheus/alerts:/etc/prometheus/alerts:ro
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'
      - '--web.enable-admin-api'
    ports:
      - "9090:9090"
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:10.1.0
    container_name: grafana
    restart: unless-stopped
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning:ro
    environment:
      - GF_SECURITY_ADMIN_USER=${GRAFANA_ADMIN_USER:-admin}
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD:-admin}
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_SERVER_ROOT_URL=http://localhost:3000
      - GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-piechart-panel
    ports:
      - "3000:3000"
    networks:
      - monitoring
    depends_on:
      - prometheus

  alertmanager:
    image: prom/alertmanager:v0.26.0
    container_name: alertmanager
    restart: unless-stopped
    volumes:
      - ./alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro
      - alertmanager_data:/alertmanager
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--storage.path=/alertmanager'
    ports:
      - "9093:9093"
    networks:
      - monitoring

  node-exporter:
    image: prom/node-exporter:v1.6.1
    container_name: node-exporter
    restart: unless-stopped
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    ports:
      - "9100:9100"
    networks:
      - monitoring

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:v0.47.2
    container_name: cadvisor
    restart: unless-stopped
    privileged: true
    devices:
      - /dev/kmsg:/dev/kmsg
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker:/var/lib/docker:ro
      - /cgroup:/cgroup:ro
    ports:
      - "8080:8080"
    networks:
      - monitoring

  blackbox-exporter:
    image: prom/blackbox-exporter:v0.24.0
    container_name: blackbox-exporter
    restart: unless-stopped
    ports:
      - "9115:9115"
    networks:
      - monitoring
```

## Prometheus Configuration

Create `prometheus/prometheus.yml`:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    monitor: 'home-lab'

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

rule_files:
  - /etc/prometheus/alerts/*.yml

scrape_configs:
  # Prometheus itself
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Node Exporter - System metrics
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
        replacement: 'home-server'

  # cAdvisor - Docker container metrics
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']

  # Blackbox Exporter - Endpoint monitoring
  - job_name: 'blackbox-http'
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
      - targets:
        - https://google.com
        - https://github.com
        - http://localhost:3000  # Grafana
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: blackbox-exporter:9115
```

## Alert Rules

Create `prometheus/alerts/rules.yml`:

```yaml
groups:
  - name: system-alerts
    rules:
      # High CPU usage
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage detected"
          description: "CPU usage is above 80% on {{ $labels.instance }} for more than 5 minutes."

      # High memory usage
      - alert: HighMemoryUsage
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage detected"
          description: "Memory usage is above 85% on {{ $labels.instance }}."

      # Low disk space
      - alert: LowDiskSpace
        expr: (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 < 15
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Low disk space"
          description: "Disk space is below 15% on {{ $labels.instance }}."

      # Service down
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
          description: "{{ $labels.job }} has been down for more than 1 minute."

  - name: container-alerts
    rules:
      # Container high CPU
      - alert: ContainerHighCPU
        expr: (sum by (name) (rate(container_cpu_usage_seconds_total{name!=""}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Container high CPU usage"
          description: "Container {{ $labels.name }} CPU usage is above 80%."

      # Container high memory
      - alert: ContainerHighMemory
        expr: (container_memory_usage_bytes{name!=""} / container_spec_memory_limit_bytes{name!=""}) * 100 > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Container high memory usage"
          description: "Container {{ $labels.name }} memory usage is above 80%."

      # Container restart
      - alert: ContainerRestarted
        expr: increase(container_last_seen{name!=""}[5m]) > 2
        for: 0m
        labels:
          severity: warning
        annotations:
          summary: "Container restarted"
          description: "Container {{ $labels.name }} has restarted."
```

## Alertmanager Configuration

Create `alertmanager/alertmanager.yml`:

```yaml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'severity']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'telegram'
  routes:
    - match:
        severity: critical
      receiver: 'telegram'
      continue: true
    - match:
        severity: warning
      receiver: 'telegram'

receivers:
  - name: 'telegram'
    telegram_configs:
      - bot_token: 'YOUR_BOT_TOKEN'
        chat_id: YOUR_CHAT_ID
        message: |
          🚨 *Alert: {{ .Status | toUpper }}*
          
          {{ range .Alerts }}
          *Alert:* {{ .Labels.alertname }}
          *Severity:* {{ .Labels.severity }}
          *Instance:* {{ .Labels.instance }}
          *Description:* {{ .Annotations.description }}
          {{ end }}

  # Email alternative
  # - name: 'email'
  #   email_configs:
  #     - to: 'admin@example.com'
  #       from: 'alertmanager@example.com'
  #       smarthost: 'smtp.gmail.com:587'
  #       auth_username: 'your-email@gmail.com'
  #       auth_password: 'app-password'

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'instance']
```

## Grafana Provisioning

### Datasource

Create `grafana/provisioning/datasources/prometheus.yml`:

```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: false
```

### Dashboard Provisioning

Create `grafana/provisioning/dashboards/dashboard.yml`:

```yaml
apiVersion: 1

providers:
  - name: 'default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 30
    options:
      path: /etc/grafana/provisioning/dashboards
```

## Deploy the Stack

Create `.env` file:

```bash
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=your-secure-password
```

Start everything:

```bash
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## Access the Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Grafana | http://localhost:3000 | admin / (from .env) |
| Prometheus | http://localhost:9090 | None |
| Alertmanager | http://localhost:9093 | None |
| Node Exporter | http://localhost:9100 | None |

## Useful PromQL Queries

### CPU Usage

```promql
100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

### Memory Usage

```promql
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100
```

### Disk Usage

```promql
(1 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})) * 100
```

### Network Traffic

```promql
# Inbound
rate(node_network_receive_bytes_total[5m]) * 8

# Outbound
rate(node_network_transmit_bytes_total[5m]) * 8
```

### Container Memory

```promql
container_memory_usage_bytes{name!=""} / 1024 / 1024
```

## Adding More Targets

To monitor additional hosts, install Node Exporter on each machine:

```bash
# On the target machine
docker run -d \
  --name node-exporter \
  --net="host" \
  --pid="host" \
  -v "/:/host:ro,rslave" \
  prom/node-exporter \
  --path.rootfs=/host
```

Then add to Prometheus:

```yaml
- job_name: 'remote-nodes'
  static_configs:
    - targets: 
      - '192.168.1.100:9100'
      - '192.168.1.101:9100'
```

## Conclusion

You now have a production-grade monitoring stack that provides:

- **Real-time metrics** from all your systems
- **Beautiful dashboards** in Grafana
- **Instant alerts** via Telegram/Email
- **Container monitoring** with cAdvisor
- **Endpoint health checks** with Blackbox Exporter

This setup scales well for home labs and small infrastructures. For larger deployments, consider adding Thanos or Cortex for long-term storage and high availability.

Happy monitoring! 📊
