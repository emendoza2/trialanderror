---
title: "Networking in Brief"
date: 2022-07-13
excerpt: 
pageId: 0de5b863ad7046248853b18aea9e1540
tags:
  - Networking
  - TryHackMe
---

Imagine you’re a computer. A computer sealed off from any others. You may hear from people, but never from one of your own kind.

Such a silent and lonely existence was the destiny of most computers created before the internet. That situation half a century ago is difficult to imagine today.

Arguably, however, humans, and by extension, their computers, are designed to connect. The desire to build connections is what led to the creation of the military project that was the precursor to the internet: [ARPANET](https://archive.nytimes.com/www.nytimes.com/library/tech/99/12/biztech/articles/122099outlook-bobb.html). 

{% figure "Credit: Wikimedia Commons. The first three letters that were sent over the wires of ARPANET were… [L, O, and L](https://arstechnica.com/information-technology/2019/10/50-years-ago-today-the-internet-was-born-sort-of/)." %}{% image "640px-Arpanet_1972_Map-889366f4.png", "Credit: Wikimedia Commons. The first three letters that were sent over the wires of ARPANET were… [L, O, and L](https://arstechnica.com/information-technology/2019/10/50-years-ago-today-the-internet-was-born-sort-of/)." %}{% endfigure %}

And that is what *networking* fundamentally is: the art of connections. To make these connections, the internet relies on the TCP/IP protocol. The modern version of this protocol consists of three key elements: **names**, **addresses**, and a **common language**. 

# MAC addresses

A “name” or a *MAC address* represents a specific device. It is usually burned into the hardware. Like a human name, it is useful for communicating over short distances, when names are familiar, and where you can be heard easily. MAC addresses follow this format:

```plain text
00:25:96:12:34:56
```

MAC addresses are designed to be unique to each device. Although it has its benefits, the flaw in this design is similar to the consequence of wearing an ID card displaying your name wherever you go: it attracts unwanted tracking. Knowing that this threatened privacy, [Apple](https://www.techtimes.com/articles/8233/20140612/apple-implements-random-mac-address-on-ios-8-goodbye-marketers.htm) implemented a feature back in iOS 8 that randomized MAC addresses.

“Wait!” you may retort, “Aren’t MAC addresses burned into hardware? Can devices lie about their MAC address?” 

The short answer is yes. This technique is called MAC *spoofing*, which is why you can’t solely rely on MAC addresses anymore to determine the identity of a device. You can, however, still use them to ensure that network messages get sent to the right device. Similarly, if people choose to hide their identity by using an alias, you should still be able to use that alias to address them.

MAC addresses are best used over short distances, in local networks. To communicate over long distances, the internet uses another tool: IP addresses.

# IP addresses

{% image "photo-1527377667-83c6c76f963f-22479538.jpg" %}

This is where IP addresses come in. Like physical addresses, they indicate less of *who* you are and more of *where* you are. A common IP address looks like this:

```plain text
127.0.0.1
```

This is a logical scheme that *routers* will use to assign *who* will send messages and *to where* they will be sent, like a post office. As a consequence of this design, IP addresses are much more dynamic than MAC addresses. Furthermore, IP addresses change owners like a home address does, and the path to reach an IP addresses involves a more elaborate system than MAC addressing.

# A common language

The final element in this simplification of the TCP/IP protocol is a common language. This ensures that devices will be able to understand each other regardless of their make and model. Messages have a structure that mirrors that of a postal envelope: addresses, names, a letter. Among many things, following a predictable model for sending messages shares the benefits of doing the same for sending letters to a friend. It eliminates confusion (addresses and names), ensures the soundness of the message (an envelope for protection), and finally communicates the message (the content of the letter). 

A point like this should be common sense, but it wasn’t until the TCP/IP protocol was publicized and made freely available that the internet could explode into what it is today. And I mean *explode*. Remember that drawing of ARPANET from earlier? This is what the Internet looked like in 2021.

{% figure "This beautiful pom-pom visualization of the internet is courtesy of [The Opte Project](https://www.opte.org/the-internet)." %}{% image "the_internet%281%29-5fd757d2.png", "This beautiful pom-pom visualization of the internet is courtesy of [The Opte Project](https://www.opte.org/the-internet)." %}{% endfigure %}

Part of what helped TCP/IP win the [Protocol Wars](https://www.wikiwand.com/en/Protocol_Wars) of the 1970s–1990s was its openness. In contrast other standards, like OSI, were locked behind payments or proprietary licenses. TCP/IP was a pioneer in the culture of sharing on which the internet today stands. While it is beneficial, it is also a challenge for network engineers. It introduced a tension, likely irresolvable, between security and accessibility, control and freedom, privacy and convenience. This, in brief, is the art of networking as computers see it.



