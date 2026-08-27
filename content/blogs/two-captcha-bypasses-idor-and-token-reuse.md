---
title: "Two Captcha Bypasses — IDOR and Token Reuse"
date: 2024-01-25T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags:
  - Security
  - Bug Bounty
  - Web Security
  - IDOR
  - CAPTCHA
  - Vulnerability Research
image: /images/post.jpg
description: "Original vulnerability research documenting novel captcha bypass techniques through Insecure Direct Object Reference (IDOR) and authentication token reuse vulnerabilities."
toc: true
---

This is my first write-up here. I will talk about how I bypassed captcha on two companies.

## First One (Captcha Token Reuse)

While testing a site.example.com, I found that signing up on their site had a captcha. I solved the captcha challenge and captured the request with credentials, and I saw the captcha response token.

It was like:

```
&g-recaptcha-response=03AJpayVGwtrg6bOlwaMCLZ9-vHQcM0jxbgdU_JcPyQI4e4QZlBbj7WrWHw8I13IW5qT6yd-g8txCFoThxlzDB8b-aGvX16idgAktxU5459HNgVFC5n8h0-aHGPH1eOCWJuw5c0mo5sGI9DflNPGfnK5Rq90Zj4gFtCU9y5IGks4SWLH2iA0OGIQ9gISptqd8QuMqKcYROgNQ3huLb-gikJX7VQBvfR2Tw24TAP8OX5LQofNYaFE8sDx77Smtrf7fF9pVvqwVYoETDkoeA8exu2V90YMAw0apTtNhVy2SCikb3aTZI5bt7ZYJVgdObNDDwFTU3nonAJM88GRMA-vmX3atBhGGoQw56QaooPGjVMcJnly-LK154RoBh4R8S-BBNqLZfk4ivJH7K
```

I tried the same request in Burp Repeater with another email and password, and wow! WTF! The web app just didn't terminate the valid token after it was used. I sent a POST request to Intruder and launched an attack, and I made 100 accounts in less than 40 seconds. I sent a POC video to the company, but unfortunately, it's a duplicate!

> Hi mahmoud,
>
> Thank you for your report.
>
> The ability to bypass our signup controls is a known issue that our engineers are currently working to address.

Another hacker reported it 5 months ago and the problem is not fixed!

Bad luck, but I didn't give up and I found a second way to bypass captcha, but at a different application.

## Second One (IDOR)

It was an Insecure Direct Object Reference. While testing example.com, I found that when signing in, if I typed credentials three times incorrectly, it showed up a captcha.

I found that in the URL there are `fail=1&captcha=1` parameters. I put 0 instead of 1, and I bypassed the captcha. I found that the captcha turned off, and I was able to bruteforce now!

And the report is triaged (open).

