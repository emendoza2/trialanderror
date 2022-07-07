---
title: "Basic Reconnaissance on TryHackMe: Part 2"
date: 2022-07-07
excerpt: 
tags:
  - TryHackMe
  - Networking
---

Active reconnaissance, in contrast to passive reconnaissance, requires direct engagement with a target instead of publicly available data. Consequently, with this type of research, it’s harder to avoid leaving traces, but it generally provides deeper insights into the system. 

---

If active recon is like eating anchovy pizza, passive recon is asking other people about the pizza. Which method tells you more? Which method signals the anchovies that you’re researching them? You get my point.

# Active Recon Commands

What follows are the commands I found to be most helpful.

```shell
$ ping -c 4 example.com
# Sample output:
# PING example.com (93.184.216.34) 56(84) bytes of data.
# 64 bytes from 93.184.216.34 (93.184.216.34): icmp_seq=1 ttl=55 time=170 ms
# 64 bytes from 93.184.216.34 (93.184.216.34): icmp_seq=2 ttl=55 time=173 ms
# 64 bytes from 93.184.216.34 (93.184.216.34): icmp_seq=3 ttl=55 time=159 ms
# 64 bytes from 93.184.216.34 (93.184.216.34): icmp_seq=4 ttl=55 time=161 ms

# --- example.com ping statistics ---
# 4 packets transmitted, 4 received, 0% packet loss, time 6ms
# rtt min/avg/max/mdev = 158.699/165.917/173.407/6.172 ms
```

The **ping** command tells you whether a host is online. A ping response is a [*sufficient condition*](https://www.merriam-webster.com/dictionary/sufficient%20condition) for a host being online, which means that if you receive a response, the host is online, but if you do not, you can’t be sure that the host is online. The host can refuse to respond to ping requests.

```shell
$ traceroute gitlab.com
# Sample output:
# traceroute to gitlab.com (142.251.11.111), 30 hops max, 60 byte packets
# 1 ... (several more lines of IP addresses)
```

**Traceroute** gives you hints on what path your packets are taking through routers to reach the destination you specify. More often than not, however, I found that routers do not respond with their IP address. Because `traceroute` uses a “trick” with specially-crafted ICMP requests, routers don’t have to respond. When I used a VPN, for example, no routers responded at all, even if the site was online and responded to pings. Furthermore, the path that the packets take is unpredictable. At best, if routers do respond, the IP addresses can reveal the layout of the network from you to the host IP.

```shell
$ telnet itcorp.com 80
Trying 134.173.42.59...
Connected to itcorp.com.
Escape character is '^]'.
GET / HTTP/1.1
host: example

HTTP/1.1 200 OK
...
$ nc mozilla.org 80
GET / HTTP/1.1
Host: mozilla.org

HTTP/1.1 301 Moved Permanently
...
```

In this example, **netcat** and **telnet** behave similarly. The `telnet` command uses a different protocol and modifies your input a little ([source](https://superuser.com/questions/1461609/what-is-the-difference-between-telnet-and-netcat)), but since it is so basic, it can get information about websites through TCP. Netcat is the same, but it does not modify input. Strangely, netcat didn’t return a response for several hosts I tested, while telnet did. Netcat is still useful for opening a port and listening to raw TCP connections. To open a port, I ran:

```shell
$ nc -lnvp 1080
# Sample output:
# Listening on [0.0.0.0] (family 2, port 1080)
# Connection from 192.168.9.196 43944 received!
# ¡Hola!
```

Another machine connected to my Raspberry’s IP address at port 1080 to send the greeting.

## Nmap

Nmap, among many other things, allows you to find live hosts on a network. To perform a scan, run:

```shell
$ sudo nmap -sn 192.168.1.1-255 # the subnet depends on your network
# Sample output:
# ...
# Nmap done: 255 IP addresses (21 hosts up) scanned in 7.65 secondsNmNmap found 
```

There are several different options for tuning the scan, but when scanning external networks, nmap defaults to SYN, TCP, or ICMP techniques. A SYN scan is least preferable, because it requires more connections, but nmap resorts to it without privileged access. On a local network, nmap performs an ARP scan by default. 

Here are a few highlights from nmap’s `man` page and the TryHackMe lesson.
| Option | Meaning |
|:---|---|
| `-PR` | ARP scan; most effective on local networks; default |
| `-PE; -PP; -PM` | ICMP protocol; like ping, which uses echo, with the addition of timestamp and address |
| `-PU` | UDP ping; some adminstrators neglect this protocol, unlike TCP; if a device has a port open, however, it won’t respond |
| `-PS; -PS21-23,80,443` `-PA` | TCP SYN ping; whether the port is open or not, a response is a signal to nmap that the host is online. TCP ACK works the same way, but requires privileged access. |

On my home network, I found that all options worked similarly well, with the exception of `-PS` (TCP SYN) run without privileges. This was likely because nmap sends an ARP scan as backup regardless of the scan option if privileged.



Exploring basic active recon reaped a secondary learning: most people who use the internet couldn’t care less about how an TCP request works, but it is indispensable to them. Networking, like anchovy pizza, needs to be actively engaged to make the most of it and protect yourself from it. 

🐟🍕

