---
title: "Evade Network Scanners with Firewall"
date: 2024-01-20T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags:
  - Security
  - Network Security
  - Firewall
  - NMAP
  - Defense
  - TCP/IP
image: /images/firewall-technique.png
description: "Defense evasion research exploring techniques for bypassing network security monitoring and intrusion detection systems through firewall manipulation."
toc: true
---

We all know the most common network scanner NMAP. The mechanism that all network scanners work with is testing kernel network transport layer protocol response [ICMP / TCP / UDP / SCTP] across the whole 65,000 ports.

Now, how do scanners know if a port is open / closed / filtered? If you don't know, I will explain in the TCP layer. For example, if there is a socket listening in the kernel on machine 192.168.1.15, if 192.168.1.10 sends a SYN packet, the kernel will respond with ACK, and now NMAP knows the port is open. Detecting common application layers is easy—if SSH responds, it will be an SSH handshake, and if HTTP, for example, you will see a response with HTTP headers. You can see this yourself with Wireshark.

If a port is filtered in common ways, kernel network filters (firewalls) check the Internet Protocol layer. If the IP doesn't match the allowed rule, it won't accept data. For then, if NMAP sends SYN, the kernel will not respond at all, so NMAP tells you the port is filtered.

Now, if you have a sensitive port like SSH 22 and want to hide that service, there is a good technique in the TCP/IP mechanism. If the kernel finds no process listening on a socket and it receives SYNs from outside, it will respond with a TCP-RST flag, which refers to RESET connection to tell the agent that there is no service here.

Here is how we can use TCP-RST to protect your company:

![NC Listening on Port 22](/images/nc-listening-port22.png)

*Here is NC listening on port 22*

![Firewall Technique](/images/firewall-technique.png)

*Here is the technique*

To accept the connection from only a specified source IP address, an iptables rule will be like:

```bash
iptables -A INPUT ! -s 192.168.1.40 -p tcp -m tcp --dport 22 -j REJECT --reject-with tcp-reset
```

The command above will set that rule to respond with a reset flag to anyone except 192.168.1.40.

Hope this was useful for you. Follow me on Twitter [https://twitter.com/0xvdso](https://twitter.com/0xvdso), thanks.

