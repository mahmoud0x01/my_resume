---
title: "Hardening Linux Servers: A Production-Ready Checklist"
date: 2024-12-15T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags:
  - Linux
  - Security
  - System Administration
  - Hardening
  - Server Security
  - DevSecOps
image: /images/linux-hardening.png
description: "A comprehensive guide to hardening Linux servers for production environments, covering SSH, firewalls, kernel parameters, and monitoring."
toc: true
---

When setting up a new Linux server—whether it's a web server, database, or application host—security hardening is non-negotiable. This guide covers the essential steps I follow when preparing any production Linux server.

## Initial Setup

### Create a Non-Root Admin User

Never use root for daily operations. Create a dedicated admin user:

```bash
# Create user with sudo privileges
useradd -m -s /bin/bash sysadmin
usermod -aG sudo sysadmin  # Debian/Ubuntu
usermod -aG wheel sysadmin  # RHEL/CentOS

# Set a strong password
passwd sysadmin

# Configure sudo without password (optional, for automation)
echo "sysadmin ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/sysadmin
chmod 440 /etc/sudoers.d/sysadmin
```

### Update the System

```bash
# Debian/Ubuntu
apt update && apt upgrade -y

# RHEL/CentOS
dnf update -y

# Enable automatic security updates
apt install unattended-upgrades -y
dpkg-reconfigure -plow unattended-upgrades
```

## SSH Hardening

SSH is your gateway—lock it down tight.

### Generate Strong SSH Keys

```bash
# On your LOCAL machine, generate Ed25519 key
ssh-keygen -t ed25519 -a 100 -C "admin@server"

# Copy to server
ssh-copy-id -i ~/.ssh/id_ed25519.pub sysadmin@server
```

### Harden SSH Configuration

Edit `/etc/ssh/sshd_config`:

```bash
# Disable root login
PermitRootLogin no

# Disable password authentication
PasswordAuthentication no
ChallengeResponseAuthentication no
UsePAM yes

# Use only SSH Protocol 2
Protocol 2

# Strong key exchange and ciphers
KexAlgorithms curve25519-sha256@libssh.org,diffie-hellman-group16-sha512
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com

# Limit authentication attempts
MaxAuthTries 3
MaxSessions 2

# Idle timeout (5 minutes)
ClientAliveInterval 300
ClientAliveCountMax 0

# Restrict users (replace with your username)
AllowUsers sysadmin

# Change default port (obscurity, not security)
Port 2222

# Disable X11 and agent forwarding
X11Forwarding no
AllowAgentForwarding no
AllowTcpForwarding no
```

Restart SSH and test before disconnecting:

```bash
sshd -t  # Test config
systemctl restart sshd

# From another terminal, verify you can still connect!
ssh -p 2222 sysadmin@server
```

## Firewall Configuration

### UFW (Uncomplicated Firewall)

```bash
# Install and enable
apt install ufw -y

# Default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (your custom port)
ufw allow 2222/tcp comment 'SSH'

# Allow web traffic
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'

# Enable firewall
ufw enable
ufw status verbose
```

### iptables (Advanced)

For more control, use iptables directly:

```bash
#!/bin/bash
# /etc/iptables/rules.sh

# Flush existing rules
iptables -F
iptables -X

# Default policies
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow loopback
iptables -A INPUT -i lo -j ACCEPT

# Allow established connections
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Allow SSH (custom port)
iptables -A INPUT -p tcp --dport 2222 -m conntrack --ctstate NEW -j ACCEPT

# Allow HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -m conntrack --ctstate NEW -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -m conntrack --ctstate NEW -j ACCEPT

# Rate limit SSH (prevent brute force)
iptables -A INPUT -p tcp --dport 2222 -m conntrack --ctstate NEW -m recent --set
iptables -A INPUT -p tcp --dport 2222 -m conntrack --ctstate NEW -m recent --update --seconds 60 --hitcount 4 -j DROP

# Drop invalid packets
iptables -A INPUT -m conntrack --ctstate INVALID -j DROP

# Log dropped packets
iptables -A INPUT -j LOG --log-prefix "IPTables-Dropped: "
iptables -A INPUT -j DROP
```

## Kernel Hardening

Apply security-focused kernel parameters in `/etc/sysctl.d/99-security.conf`:

```bash
# IP Spoofing protection
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Ignore ICMP broadcast requests
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Disable source packet routing
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# Ignore send redirects
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0

# Block SYN attacks
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_syn_retries = 5

# Log Martians
net.ipv4.conf.all.log_martians = 1
net.ipv4.icmp_ignore_bogus_error_responses = 1

# Ignore ICMP redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0

# Disable IPv6 (if not needed)
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1

# Restrict dmesg access
kernel.dmesg_restrict = 1

# Hide kernel pointers
kernel.kptr_restrict = 2

# Restrict ptrace
kernel.yama.ptrace_scope = 1

# ASLR (Address Space Layout Randomization)
kernel.randomize_va_space = 2
```

Apply changes:

```bash
sysctl -p /etc/sysctl.d/99-security.conf
```

## Fail2Ban - Intrusion Prevention

Install and configure Fail2Ban:

```bash
apt install fail2ban -y
```

Create `/etc/fail2ban/jail.local`:

```ini
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5
backend = systemd

[sshd]
enabled = true
port = 2222
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 24h

[nginx-http-auth]
enabled = true
port = http,https
filter = nginx-http-auth
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
```

```bash
systemctl enable fail2ban
systemctl start fail2ban
fail2ban-client status
```

## File System Security

### Secure Mount Options

Edit `/etc/fstab` to add security options:

```bash
# Separate /tmp with noexec
tmpfs /tmp tmpfs defaults,noexec,nosuid,nodev 0 0

# Secure /var/tmp
/tmp /var/tmp none bind 0 0

# Secure shared memory
none /run/shm tmpfs defaults,noexec,nosuid,nodev 0 0
```

### Find and Fix Permissions

```bash
# Find world-writable files
find / -xdev -type f -perm -0002 -ls

# Find SUID/SGID binaries
find / -xdev \( -perm -4000 -o -perm -2000 \) -type f -ls

# Find files with no owner
find / -xdev -nouser -o -nogroup

# Secure sensitive files
chmod 600 /etc/shadow
chmod 644 /etc/passwd
chmod 700 /root
```

## Audit Logging

Install and configure auditd:

```bash
apt install auditd audispd-plugins -y
```

Add rules to `/etc/audit/rules.d/audit.rules`:

```bash
# Delete all existing rules
-D

# Increase buffer size
-b 8192

# Failure mode
-f 1

# Monitor authentication files
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/group -p wa -k identity
-w /etc/sudoers -p wa -k sudoers

# Monitor SSH config
-w /etc/ssh/sshd_config -p wa -k sshd

# Monitor cron
-w /etc/crontab -p wa -k cron
-w /etc/cron.d/ -p wa -k cron

# Monitor privileged commands
-a always,exit -F path=/usr/bin/sudo -F perm=x -k privileged
-a always,exit -F path=/usr/bin/su -F perm=x -k privileged

# Monitor network config
-w /etc/hosts -p wa -k network
-w /etc/network/ -p wa -k network
```

```bash
service auditd restart
auditctl -l  # List active rules
```

## Quick Hardening Checklist

| Category | Task | Status |
|----------|------|--------|
| **Users** | Disable root login | ☐ |
| **Users** | Create non-root admin | ☐ |
| **SSH** | Key-only authentication | ☐ |
| **SSH** | Change default port | ☐ |
| **SSH** | Strong ciphers only | ☐ |
| **Firewall** | Default deny policy | ☐ |
| **Firewall** | Whitelist required ports | ☐ |
| **Kernel** | Apply sysctl hardening | ☐ |
| **Services** | Disable unnecessary services | ☐ |
| **Updates** | Enable auto security updates | ☐ |
| **Logging** | Configure auditd | ☐ |
| **IPS** | Install Fail2Ban | ☐ |

## Conclusion

Server hardening is not a one-time task—it's an ongoing process. These configurations provide a solid baseline, but you should:

1. Regularly audit your systems
2. Keep everything updated
3. Monitor logs proactively
4. Test your security controls
5. Follow the principle of least privilege

Security is a journey, not a destination. Stay vigilant! 🛡️
