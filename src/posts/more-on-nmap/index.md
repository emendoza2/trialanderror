---
title: "More on Nmap"
date: 2022-07-08
excerpt: 
pageId: 3452e442489b4e74ad889fd90b519cf8
tags:
  - Networking
  - TryHackMe
---

Nmap is a powerful and essential program for understanding how networks operate and what is happening on a network. According to its manual, it is “an open source tool for network exploration and security auditing” \[[nmap.org](https://nmap.org/book/man.html)]. 

I touched on it recently in {% mentionPageId "6fed0d9f-426f-41c2-b3d2-1bd12ba757c3" %} for enumerating live hosts on a network. This time, we’ll cover its use as a port scanner.

# What?

Let’s begin with some definitions.

**Ports** (in a networking context) are numbers that are used to distinguish running services from one another. In the [OSI model](/0db7b339e4d94972bce9365e105856f6), this would fall under Layer 4 (Transport) or Layer 5 (Session). Every time your computer has to establish a connection, whether listening or requesting (yes, including HTTP requests), it assigns a port to that connection. 

There are a total of 65535 ports available (That’s $2^{16}-1$). These generally fall under three categories [defined by the IANA](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml), although different operating systems have rebelled and devised their own schemes.

- Ports 0–1023 are generally established as well-known or System ports. Of all three categories, this one is the most widely recognized. On UNIX systems, these port numbers are reserved for the root user. 
- Ports 102–49151 are User Ports. These are more easily available for non-root users.
    
    {% figure "Opening a low port without root permissions fails on a Linux device." %}{% image "failed-servr-117561ac.svg", "Opening a low port without root permissions fails on a Linux device." %}{% endfigure %}
    
- Ports 49152–65535 are Dynamic or ephemeral ports, which close as soon as the connection is dropped. Each time your computer makes a request to a server (port 80, for example), it opens a new ephemeral port. 
- Creating a “map” of the network environment
    - Which nmap can actually visually do: [zenmap screenshot]

# Why should I care?

It is difficult to blindly attack or defend without seeing the landscape of the subject.

Nmap is extremely flexible in this regard. By enumerating ports, it can determine what services are running on the system, and knowledge is powerful.

# How do I start?

Glad you asked. 

## Getting started

First, head to [https://nmap.org/download](https://nmap.org/download), download Nmap for your operating system, and install it. You can also install it with a package manager for your system (e.g. `brew install nmap` or `apt install nmap`)

Then type

```bash
$ nmap --help
```

into a terminal to check if it has been installed properly. If the help output appears, great! Hold on to that, because it will be extremely helpful for the next steps.

## Useful stuff

Nmap’s behavior (like other commands) is controlled by *switches*. 
| Switch | Description |
|---|---|
| `-v/-vv/-vvv` | Verbosity level. I usually turn it up to two or higher. If you’ve already started a scan and want to ramp it up, you can type `v` to increase and `V` to decrease it in the terminal window where nmap is running. |
| `-T[1-5]` | Timing. `-T1` is the lowest speed, `-T3` is default, and `-T5` is the maximum. Lower speeds are harder for firewalls and IDSs to detect. |
| `-oX/-oN/-oG/-oA <file>` | Output results as **X**ML, **N**ormal, **G**repable (Greppable?) or **A**ll formats at once to `<file>`. Use this if you want to browse through the results later with something like Zenmap, for example. |
| `-p; -p1-1000` | Specify which ports to scan. |
| `-F` | **F**ast mode. Scan only the most commonly used ports. |

The most useful part of nmap’s output is its **scan report** table, which looks something like this:

```plain text
PORT     STATE SERVICE     REASON  VERSION
80/tcp   open  http        syn-ack Apache httpd 2.4.7 ((Ubuntu))
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-favicon: Nmap Project
|_http-server-header: Apache/2.4.7 (Ubuntu)
|_http-title: Go ahead and ScanMe!
443/tcp  open  https?      syn-ack
3128/tcp open  squid-http? syn-ack
8080/tcp open  http-proxy? syn-ack
```

Besides the self-explanatory stuff in this table, the particularly-important STATE column will take four possible values: `open`, `filtered`, `closed`, or `unfiltered`. For `open` and `closed` ports, nmap knows how the machine is responding with certainty. `Filtered` and `unfiltered` ports are both uncertain about whether the port is open or not. They merely indicate whether a firewall appears to be blocking nmap’s probes.

## Precautions

Take care and use responsible discretion. Nmap is a powerful tool which can intentionally or unintentionally damage services. Be sure that before scanning, you know what you’re doing and you’re authorized to do things that would be intentionally damaging (like nmap’s exploitation scripts). 

## Scan types

Scans here are divided into increasing “levels.” Lower levels provide less information but are quicker.

{% aside %}
Many of these options require root permissions! In fact, *any* scan except a basic SYN scan will require root permissions. Keep that in mind especially if a command seems to be running rather slowly.
{% endaside %}

### Level 0 - List

**Example** - `nmap -sL 10.0.0.0/8` 

**Usage** - The `-sL` switch tells nmap to not scan anything. It will only output the hosts it will be scanning.

**Limitations** - This doesn’t actually scan anything!

### Level 1 - ICMP sweep

**Example** - `sudo nmap -sn 192.168.1.1–255`

**Usage** - This command is useful for finding a large number of hosts without actually port scanning them. The `-sn` tells nmap to skip the port scan part. Instead of checking ports, it sends an ICMP echo (ping) request to each IP address in the range you specify.

There are different switches to fine-tune the scan, but this isn’t the nmap `man` page! Read it for yourself or see {% mentionPageId "6fed0d9f-426f-41c2-b3d2-1bd12ba757c3" %}. 

**Limitations** - Windows firewalls block ICMP packets, so they will not appear as results on an ICMP sweep unless you’re on a local network, where the example command above will still be able to find Windows systems with ARP.

### Level 2 - Port scan

At last we arrive at the port scan. Unfortunately, the variety of methods employed to thwart this type of scanning demand a variety of techniques to fight back. The most basic type, though, is the **SYN** scan. 

**Example** - `nmap -sT localhost`

**Usage** - When root permissions are not available, this scan finds open ports on the addresses you indicate. Like the ICMP sweep scan before, you can specify a range of IP addresses, but this will obviously take much longer if you do. Nmap knows that the port is open if the server sends a SYN/ACK response, and that it is closed if the server sends a RST response.

**Limitations** - This type of scan is easy to detect and slow. 



A better version of the SYN scan is the **SYN stealth** or “half-open” scan.

**Example** - `sudo nmap -sS example.net`  

**Usage** - This is the same as a SYN scan, but is faster and less likely to be logged by running services. Instead of sending an ACK response and maintaining a handshake with the server, it sends a RST request. This scan is the best type for TCP services.

**Limitations** - This (and following scan commands) require root privileges.



Although the stealth scan is usually the best, some situations demand specialized scans in order to evade firewalls or detect different kinds of services, and this is where **UDP, FIN, NULL, and Xmas** scans become appropriate.

**Example** - `sudo nmap -sN -vv 192.168.1.1` 

**Usage** - When trying to evade poorly-configured firewalls (such as your own, perhaps), these methods will give you more options. The UDP scan is the only way to find services running on that protocol.

**Limitations** - The results of these commands are often incomplete, because not all systems are configured to understand the garbled or tricky requests they send.

### Level 3 - NSE

The Nmap Scripting Engine (NSE) allows you to probe even further into the services nmap discovers. Scripts are written in Lua, and nmap ships with a substantial number of them (609 as of this writing), but you can create your own. 

This is the fun part, as long as you don’t permanently or illegally damage anything, because scripts range from vulnerability enumeration to performing the actual exploits! They are organized into categories which can be found in `/usr/local/share/nmap/scripts/` and the [Nmap website](https://nmap.org/book/nse-usage.html#nse-categories).

# Final thoughts

We’ve covered a lot! Yet, the `nmap` universe is still far too big to cover in this article. And more often than not, a beginners’ guide like this will not prepare you for the highly advanced techniques used in most production security setups. Nevertheless, you should at least be equipped to be able to shed *some* light on your previously-invisible network landscape.

Even if it’s just a flicker.

🗺️🔦

