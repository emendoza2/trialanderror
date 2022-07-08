---
title: "What is the OSI Model?"
date: 2022-07-07
excerpt: The internet is founded on the principles of something called the OSI (Open Systems Interconnection) model. Although it's not the most comfortable to learn about, but it is essential. This is a high-level summary of OSI key concepts.
pageId: 0db7b339e4d94972bce9365e105856f6
tags:
  - TryHackMe
  - Networking
---

{% figure "" %}{% image "a9cde219c212c9e9463ab2fc54fe8132a58aff91.png", "" %}{% endfigure %}

Statistics say that this little WiFi icon is what 99% of people imagine when they think of the word “network” [[Source](https://www.goodreads.com/quotes/70193-over-85-of-all-statistics-are-made-up-on-the)]. 

{% figure "" %}{% image "d9bbd4d9e69dde0148af24bed034c94dc4d49b28.jpeg", "" %}{% endfigure %}

And that is a photo of a fungus. 

{% figure "" %}{% image "c0b48a3e9d4c881d50e2ec1a51564fd412d2f48d.jpg", "" %}{% endfigure %}

Finally, this is an iceberg—at least, the most that those who ever get to see an iceberg will see of one. 

If you haven’t realized what I’m getting at here by now, it’s what these three things have in common: they are all larger beneath the surface. Fungi are supported by mycelium, icebergs by nine-tenths of their volume, and networks by something called the *OSI model.* Of course, nobody needs to know that—that is, until things *stop* working. 

The importance of knowing the stuff under the surface depends on the object in question. The worst that could happen with a fungus, for instance, is that someone’s pet mushroom dies. With a cruise liner swerving through icebergs, the risks are slightly higher. But with the internet—no TikTok for a day? The stakes could not be greater.

We are most familiar with WiFi and websites, the parts of the internet that can be called its “surface.” But to change the signals in the air, glass tubes, or copper cables into words on a page, such as those you are reading right now, there are several layers to jump through. This is a high-level overview of that process, based on the Open Systems Interconnection (OSI) model. 

# Why?

The OSI model is rarely implemented word-for-word in practice. Nevertheless, having a standardized model of communication allows different devices with different hardware to communicate, as long as they follow the protocol. Whether you’re reading this on a phone over cellular data or an old PC cabled up to a dial-up, you should be able to see these words just the same. The OSI model is largely to thank for this. How does it do it? The key word is *encapsulation*.

## Encapsulation

Like an expensive wedding cake, the OSI model is composed of *layers*. Each layer performs a unique function. This function is to send and receive *data*, or information, from the layers above and below. 

🎂\
↕️\
🎂\
↕️\
🎂

Now, if not for *encapsulation*, this would be an overly convoluted and expensive way to fill the space between the plate and the candles. Instead, however, like a real cake, each layer is bigger than the previous one.

```plain text
    🕯🕯🕯 <-- candles
   --------
   |      |
  ----------
  |        |
 ------------
 |          |
 ------------
\------------/ <-- plate
```

Each layer adds its own *header* to the data. As the data goes down the cake, or it is being sent, each layer adds its unique information. As it goes up, each layer removes its own header. This way, each layer can work its magic without having to necessarily worry about the layers before or after. On receiving, a layer simply reads its header and passes along the body, and on sending, it just has to add the right headers. 

Through encapsulation, the host of different protocols and permutations of layers can achieve the same result: data can consistently travel from candles to plate—or keyboard to cables.

# [The seven layers](https://www.iso.org/ics/35.100.html)

Some people like to start with the bottom layer and work their way up, but here we’ll be covering them from the highest, which has the most abstractions, to the lowest, which has the least. In this order, a useful mnemonic to remember the layers is:

All People Steal Their Neighbors’ Dogs Patiently (Application, Presentation, Session, Transport, Network, Data Link, Physical)

How else would you steal them? 🐶

Let’s jump right in.

## Layer 7 – Application

{% figure "An illustration of this layer. FTP operates on the Application layer of the OSI model." %}{% image "d7e5a64bd2aa4ec903838aeb08e42e20ba1292a9.svg", "An illustration of this layer. FTP operates on the Application layer of the OSI model." %}{% endfigure %}

Layer 7 of the OSI model is the Application layer. This layer provides a high-level interface to network data, and this is what the user most often sees. Aside from FTP, HTTP is another ubiquitous example of a service that operates on this layer. 

## Layer 6 – Presentation

```bash
$ file ascii.txt
# ascii.txt: ASCII text, with very long lines, with CRLF line terminators
$ hexdump -C ascii.txt | head
# 00000000  56 65 72 73 65 09 4b 69  6e 67 20 4a 61 6d 65 73  |Verse.King James|
# 00000010  20 42 69 62 6c 65 0d 0a  47 65 6e 65 73 69 73 20  | Bible..Genesis |
# 00000020  31 3a 31 09 49 6e 20 74  68 65 20 62 65 67 69 6e  |1:1.In the begin|
# 00000030  6e 69 6e 67 20 47 6f 64  20 63 72 65 61 74 65 64  |ning God created|
# 00000040  20 74 68 65 20 68 65 61  76 65 6e 20 61 6e 64 20  | the heaven and |
# 00000050  74 68 65 20 65 61 72 74  68 2e 0d 0a 47 65 6e 65  |the earth...Gene|
# 00000060  73 69 73 20 31 3a 32 09  41 6e 64 20 74 68 65 20  |sis 1:2.And the |
# 00000070  65 61 72 74 68 20 77 61  73 20 77 69 74 68 6f 75  |earth was withou|
# 00000080  74 20 66 6f 72 6d 2c 20  61 6e 64 20 76 6f 69 64  |t form, and void|
# 00000090  3b 20 61 6e 64 20 64 61  72 6b 6e 65 73 73 20 3c  |; and darkness <|
```

Simply put, the Presentation layer standardizes communication. It compresses and converts between character encoding formats.

## Layer 5 – Session

The Session layer establishes, maintains, and closes connections between two devices. It ensures that separate connections stay separate so that a shapeless blob of data does not flood applications. Honestly, there is not much to say about this layer and Layer 6, but thankfully, they are [less relevant](https://www.computerworld.com/article/2470634/the-session-layer--understanding-layer-5-of-the-osi-model.html#:~:text=are%20the%20two%20least%20relevant).

## Layer 4 – Transport



The Transport layer determines what protocol to use to transport the data, which is mainly either TCP (Transmission Control Protocol) or UDP (User Datagram Protocol). TCP is better for situations where data accuracy is essential, e.g. file downloads, and UDP is preferable for things like video streaming because it sacrifices fidelity for speed.

At this layer, data get a new name! They are called *segments* when using TCP or *datagrams* when using UDP.

## Layer 3 – Network

{% figure "ICMP (Internet Control Messaging Protocol) operates on the Network layer." %}{% image "042e1359ec1c1ae371ee5392ac2668897bf24df6.svg", "ICMP (Internet Control Messaging Protocol) operates on the Network layer." %}{% endfigure %}

The Network layer performs routing between logical addresses, e.g. IPv4 or IPv6 addresses. The Internet Protocol (IP), which runs on this layer, forms the backbone of the Internet. This layer is also responsible for dividing datagrams and segments into smaller packets which the Data Link and Physical layers transmit.  

At the Network layer, data become *packets*. 

## Layer 2 – Data Link

ARP, MAC

{% figure "The second line in this [Wireshark](https://www.wireshark.org) screenshot displays the Data Link layer of the networking process." %}{% image "8844028eecf5858b4787500656edaa3417d52502.png", "The second line in this [Wireshark](https://www.wireshark.org) screenshot displays the Data Link layer of the networking process." %}{% endfigure %}

The Data Link layer, as opposed to the Network layer, facilitates communication between hardware addresses instead of logical addresses. This type of communication happens on local networks. Every Network Interface Card (NIC) has a Media Access Control (MAC) address burnt into it. 

In this layer, data is prepared for transmission, and data received is checked for errors. It also limits the size of data, which is called *frames* at this layer. 

Each frame stores the source and destination addresses in its *header*, the bits for transport in its *body*, and error correction information in its *trailer*. All layers add their own headers, but the Data Link layer is the only one to add a trailer.

## Layer 1 – Physical

{% figure "The amount of cables that cross our world is shocking. There are around 1.3 million kilometers of [undersea cable](https://www.submarinecablemap.com/) spanning six continents. That doesn’t include the uncountable length of private and public optical and copper cables over land." %}{% image "0234a802bdc2c30ed1553c0605c69557db2fe1a0.jpeg", "The amount of cables that cross our world is shocking. There are around 1.3 million kilometers of [undersea cable](https://www.submarinecablemap.com/) spanning six continents. That doesn’t include the uncountable length of private and public optical and copper cables over land." %}{% endfigure %}

At the Physical layer, data flows in *bits*. This layer is hardly concerned with the content of what is stored in those bits. It sends bits through electrical or optical signals through cables or the air. On the receiving end, it translates those signals into bits.

Although this layer handles the least amount of abstraction, e.g. pulses of light, we’ve come full circle, in a sense, back to the user. Of all the layers, Layer 7 (Application) and Layer 1 (Physical) come into contact with the end-user the most. 

Think about it: working with the internet, people spend most of their time fiddling with WiFi or Bluetooth on the one end, and on the other, digging through emails (SMTP) or scrolling through Google (HTTP). The consequence, however, with a lot of human interfacing is a lot of human error. Thus, the bottom and the top layers of the OSI model are the places where people mess up the most.

# Analogy

The layers of the OSI model are comparable to human communication, because essentially, humans are open systems, and they use a model to send information to each other as well.  

Physical - air that carries sounds or a page that holds words.

Data Link - we make sounds with our mouths and pick them up with our ears. We read with our eyes and write with our hands.

Network - each person has a name (a MAC address) that others use to address them.

Transport - any conversation happens in a setting. It can be a conference (broadcast/UDP) or an interrogation room (TCP). 

Session - eye contact helps maintain and hold attention in a conversation. Your attention gives you the ability to “tune in” to certain noises and ignore others.

Presentation - the language you speak or understand.

Application - the way we use the information we communicate (e.g. memories, thoughts, ideas, imaginations).



# In practice

As mentioned earlier, the OSI model is not so clearly-cut in practice as it is in the specification. In practice, the [TCP/IP protocol](https://www.rfc-editor.org/rfc/rfc1180) is more widely implemented. Nevertheless, the OSI model is still useful as what its name suggests: a model. It’s a model for gaining a basic understanding of how the great big internet works, so that when it doesn’t work the way we expect, we know what to do.

🛳💥

# Thanks

[Pixabay](https://pixabay.com) and [Unsplash](https://unsplash.com) for the 🏞

[https://www.freecodecamp.org/news/osi-model-networking-layers-explained-in-plain-english/](https://www.freecodecamp.org/news/osi-model-networking-layers-explained-in-plain-english/)

[https://web.archive.org/web/20210201064044/https://www.itu.int/rec/T-REC-X.225-199511-I/en](https://web.archive.org/web/20210201064044/https://www.itu.int/rec/T-REC-X.225-199511-I/en)

[https://www.geeksforgeeks.org/session-layer-in-osi-model/](https://www.geeksforgeeks.org/session-layer-in-osi-model/)

[https://tryhackme.com/room/introtonetworking](https://tryhackme.com/room/introtonetworking)

[https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-2000-server/cc959885(v=technet.10)?redirectedfrom=MSDN](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-2000-server/cc959885(v=technet.10)?redirectedfrom=MSDN)

[https://en.wikipedia.org/wiki/OSI_model](https://en.wikipedia.org/wiki/OSI_model?oldformat=true)



