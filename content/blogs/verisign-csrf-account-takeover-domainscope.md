---
title: "$1,000 CSRF to Full Account Takeover at Verisign (DomainScope)"
date: 2018-04-15T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags: ["CSRF", "OAuth", "Account Takeover", "Bug Bounty", "Verisign", "Web Security", "Responsible Disclosure"]
categories: ["Security Research"]
image: /images/verisign-csrf-reward.png
description: "Responsible disclosure of a $1,000 CSRF in Verisign DomainScope Google OAuth linking — missing state parameter allowed an attacker to link their Google account to a victim's DomainScope profile and take over the account. Includes redacted PoC and reward timeline."
toc: true
---

> **Note:** Sensitive values (authorization codes, cookies, session IDs) have been redacted to `[REDACTED]`. Host and flow are preserved for reproducibility.

## Summary

Identified and validated a Cross-Site Request Forgery (CSRF) vulnerability in the Google OAuth account linking flow of Verisign DomainScope (`domainscope.com`). The OAuth callback at `/connect/google` did not validate the `state` parameter. An attacker could force a victim's authenticated session to link the attacker's Google account to the victim's DomainScope profile, then authenticate as the victim via Google OAuth. Impact was full account takeover without needing the victim's password. Reported via Bugcrowd in April 2018 within the authorized Verisign bug bounty program, triaged and rewarded **$1,000**, and acknowledged in the Verisign Hall of Fame. Found during Bugcrowd program participation as part of authorized penetration testing.

## Background — OAuth Linking Flow in DomainScope

Verisign DomainScope supported two related authentication flows at the time of testing:

- **Primary sign-in:** Users could sign in to DomainScope with LinkedIn OAuth.
- **Account linking in My Profile:** An authenticated user could visit **My Profile → Link Google Account** to associate a Google identity with their existing DomainScope profile. After linking, the user could subsequently authenticate to DomainScope via **Sign in with Google**.

The intended OAuth 2.0 flow for linking was:

1. User clicks **Link Google Account** while authenticated to DomainScope.
2. Browser redirects to `https://accounts.google.com` for Google authorization.
3. Google redirects back to DomainScope's callback `GET /connect/google?code=...&state=...` with an authorization code and a `state` value that should be bound to the user's session.
4. DomainScope exchanges the code for tokens and links the returned Google identity (`email`, `profile`) to the currently authenticated DomainScope account.

The `state` parameter is defined in [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749) as the CSRF protection for OAuth. When linking an external identity to an already-authenticated account, `state` is critical. Without it, the link action is not bound to the user who initiated it.

## Vulnerability — Missing State Parameter Verification Enables CSRF

Assessed the `/connect/google` callback and documented that the `state` parameter was not validated. The application accepted a callback containing only `code` and `scope`, without requiring a cryptographically random `state` tied to the victim's session.

Validated behavior:

- Interception of the Google OAuth callback showed the request could be replayed without a `state` value.
- Removing the `state` parameter still resulted in a successful link between the DomainScope session and the Google identity represented by the `code`.
- No anti-CSRF token, `SameSite` enforcement, or server-side session binding was observed on this linking endpoint at the time of testing.

In OAuth account linking, the missing `state` check turns the callback into a CSRF endpoint. An attacker can prepare a valid authorization code for *their own* Google account and make a victim's browser deliver it to the victim's DomainScope session. The victim's account becomes linked to the attacker's Google identity.

This class of OAuth CSRF is often missed during testing because reviewers focus on login flows and overlook linking and unlinking flows in profile settings.

## Steps to Reproduce (Sanitized)

All testing was performed using only accounts owned and controlled for the purpose of the assessment. No victim data was accessed.

**Prerequisites:** Two test accounts — a victim account (`victim@...`) authenticated to DomainScope, and an attacker-controlled Google account. Tools: browser with intercepting proxy.

**Step 1 — Initiate attacker Google authorization:**

1. Sign in to DomainScope with LinkedIn (or primary identity) using the attacker-controlled test session.
2. Navigate to **My Profile → Link Google Account**.
3. Complete Google authorization with the attacker-controlled Google account.
4. Intercept the callback to DomainScope:
   `GET /connect/google?code=[REDACTED_AUTHORIZATION_CODE]&scope=email+profile&state=[REDACTED] HTTP/1.1`
5. Document the callback URL and drop or hold the request. Extract the `code` value. Note that the application did not enforce `state` — removing it still succeeded when replayed.

**Step 2 — Create CSRF proof-of-concept for the victim:**

1. Craft a minimal HTML page that triggers a GET to the callback with the attacker's code and without a valid `state`:
   ```html
   <!-- csrf-poc.html — redacted, for authorized reproduction only -->
   <html>
     <body>
       <img src="https://domainscope.com/connect/google?code=[REDACTED_AUTHORIZATION_CODE]&scope=email+profile" style="display:none">
       <!-- Alternative: auto-submit form or window.location -->
       <script>window.location = "https://domainscope.com/connect/google?code=[REDACTED_AUTHORIZATION_CODE]&scope=email+profile";</script>
     </body>
   </html>
   ```
2. Host this page on an attacker-controlled origin (in testing, a local file).

**Step 3 — Victim interaction and takeover:**

1. While the victim is authenticated to DomainScope (active session via `JSESSIONID` / session cookies), have the victim visit the PoC URL. In real attack scenarios this is via phishing link or embedded resource.
2. The victim's browser sends the authenticated request to `/connect/google` with the attacker's code. DomainScope links the attacker's Google identity to the victim's profile.
3. Attacker then visits DomainScope and selects **Sign in with Google**, authenticating with the attacker-controlled Google account. The attacker is now authenticated as the victim — full account takeover with no password required.

The vulnerability was validated using two accounts owned by the researcher. No other accounts were tested or accessed.

## Redacted PoC Request

> **Note:** Sensitive values (authorization codes, cookies, session IDs) have been redacted to `[REDACTED]`. Host and flow are preserved for reproducibility. A PoC video was recorded for the Bugcrowd report; no live exploit is published.

Original callback intercepted via proxy (sanitized):

```http
GET /connect/google?code=[REDACTED_AUTHORIZATION_CODE]&scope=email+profile HTTP/1.1
Host: domainscope.com
User-Agent: Mozilla/5.0 [REDACTED]
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Referer: https://accounts.google.com/... [REDACTED]
Cookie: [REDACTED_SESSION_COOKIES]
Connection: close
```

Redacted details:

- `code=4%2F...` (long authorization code) → `code=[REDACTED_AUTHORIZATION_CODE]`
- `Cookie: s_fid=... s_evar... JSESSIONID=...` (full session) → `Cookie: [REDACTED_SESSION_COOKIES]` and `JSESSIONID=[REDACTED]`
- `Referer: https://accounts.google.com/o/oauth2/...?client_id=...&xsrfsig=...` → `Referer: https://accounts.google.com/... [REDACTED]`
- `client_id` value → `[REDACTED_CLIENT_ID]`
- `xsrfsig` and other long tokens → `[REDACTED]`
- `scope=email profile ...` generalized to `email+profile`
- `Host: domainscope.com` preserved — it identifies Verisign's DomainScope, which is public.

Scope was observed as `email profile` (generalized). No additional PII or token chains are included.

## Impact — Full Account Takeover via Google OAuth Linking

Validated impact was full account takeover at the application layer:

- **Authentication bypass:** After successful CSRF linking, the attacker authenticates through the trusted Google OAuth flow. The application treats the Google identity as the account owner.
- **No password needed:** The victim's password, if any, is not required. The linked Google account becomes an alternate authentication path.
- **Scope:** Any DomainScope account with an active session that visited the crafted link could be linked to the attacker's Google identity. The linking action is state-changing and was not protected by a CSRF token.
- **Persistence:** Once linked, the attacker retains access via Google sign-in until the link is manually removed by the victim or by support. The victim may not notice the additional linked identity in profile settings.

The finding was reported as a validated CSRF-to-account-takeover in the OAuth account linking flow. No critical or zero-day terminology was used in the original report; the issue was triaged as a rewarded vulnerability.

## Reward & Timeline — $1,000 via Bugcrowd, Hall of Fame April 2018

- **Program:** Verisign bug bounty via Bugcrowd (authorized testing only).
- **Discovery approach:** Found during Bugcrowd program participation while assessing OAuth flows with manual proxy interception.
- **Report date:** April 2018 (Hall of Fame date per awards data; matches disclosure timeline).
- **Triaged and rewarded:** Validated, triaged, and rewarded **$1,000** through Bugcrowd.
- **Recognition:** Acknowledged in Verisign Hall of Fame, April 2018.
- **Profile:** Reported findings and recognitions are listed on the Bugcrowd researcher profile: [https://bugcrowd.com/h/mahmoud_adel](https://bugcrowd.com/h/mahmoud_adel).

![Bugcrowd reward and triage — Verisign CSRF $1,000](/images/verisign-csrf-reward.png)

*Bugcrowd triage and reward confirmation for the Verisign DomainScope CSRF-to-account-takeover ($1,000). Screenshot stored at `/images/verisign-csrf-reward.png`.*

No fix date is asserted here beyond what was publicly acknowledged. The report was triaged and rewarded; patch verification, if any, would have been handled through the program.

## Mitigation — Validate OAuth state Parameter

Recommended mitigations documented at the time, aligned with OAuth 2.0 best practices (RFC 6749, Section 10.12 — Cross-Site Request Forgery):

1. **Require and verify `state` on every OAuth callback:**
   - Generate a cryptographically secure random value (at least 128 bits, e.g., `crypto.randomBytes(32)`).
   - Bind it to the user's session server-side before redirecting to the provider.
   - Verify exact match on `GET /connect/google` callback. Reject the request if `state` is missing, mismatched, or reused.

2. **Enforce single-use and expiry:**
   - Invalidate `state` after first use.
   - Set short expiration (e.g., 10 minutes) to limit replay window.

3. **Add defense in depth:**
   - Set `SameSite=Lax` or `Strict` on session cookies (`JSESSIONID` and auth cookies) where compatible.
   - Require re-authentication or additional CSRF token for account linking actions, not just login.
   - Validate `Referer`/`Origin` as a secondary check, not primary.

4. **Do not rely on `code` secrecy alone:**
   - The authorization code is not a CSRF defense; it authenticates the Google identity, not the user who initiated the link.

Example server-side check (pseudocode):

```js
// On initiating link:
const state = crypto.randomBytes(32).toString('hex');
req.session.oauthState = { value: state, expiresAt: Date.now() + 10*60*1000 };
res.redirect(`https://accounts.google.com/o/oauth2/auth?...&state=${state}`);

// On callback /connect/google:
if (!req.query.state || req.query.state !== req.session.oauthState?.value) {
  return res.status(403).send('Invalid OAuth state — possible CSRF');
}
if (Date.now() > req.session.oauthState.expiresAt) {
  return res.status(403).send('OAuth state expired');
}
delete req.session.oauthState; // single-use
// then exchange code and link account
```

For penetration testing of similar flows, always test linking, unlinking, and re-linking, not only primary OAuth login. Intercept the callback, remove or replace `state`, and assess whether the action still succeeds under the victim's session.

## Lessons / Takeaways

1. **OAuth CSRF is most often missed in linking flows.** Login CSRF gets attention; account linking CSRF — where an external identity is attached to an already-authenticated session — is frequently unprotected. Test every state-changing OAuth callback, including `connect`, `link`, and `unlink` endpoints.
2. **Manual interception still outperforms DAST for logic flaws.** Automated scanners validated the presence of OAuth but did not flag the missing `state` binding. Proxy interception and manual removal of `state` immediately confirmed the bypass. Document the raw callback, then replay without `state` under a second session.
3. **The `state` parameter is a session-bound CSRF token.** Treat it as such: random, unpredictable, bound to the initiating session, verified exactly, and single-use. `SameSite` cookies help but do not replace `state` validation.
4. **State-changing GETs amplify CSRF.** The callback used `GET`. Any GET that changes account linkage should either be POST with a CSRF token or be protected by the OAuth `state` check. Prefer POST for linking completion where possible.
5. **Minimize SEO noise, maximize signal.** This finding used precise keywords — CSRF, OAuth, State Parameter, Google OAuth, Verisign, DomainScope, Account Takeover, Bug Bounty, Responsible Disclosure — in the report, description, and headings. Clear reproduction steps with redacted artifacts accelerate triage.
6. **Report only what was validated.** No CVSS was assigned by the program at the time; no patch timeline is claimed beyond triage and reward. Keeping the timeline to what was documented (reported April 2018, $1,000, HoF) preserves accuracy for future review.

## Disclaimer — Responsible Disclosure

Testing was performed solely on accounts owned and controlled by the researcher, within the scope of Verisign's authorized Bugcrowd bug bounty program. No customer data, production accounts, or unrelated user sessions were accessed, modified, or tested. All reproduction used the researcher's own LinkedIn and Google test identities.

This write-up was published after triage and reward via responsible disclosure, with sensitive values redacted to `[REDACTED]`. Hostnames and flow details are preserved for reproducibility and defensive learning. No active exploit is provided; the PoC is reduced to a sanitized `GET` and a static HTML pattern.

For questions about the finding or mitigation guidance, contact via the Bugcrowd profile at [https://bugcrowd.com/h/mahmoud_adel](https://bugcrowd.com/h/mahmoud_adel) or the site contact page.

