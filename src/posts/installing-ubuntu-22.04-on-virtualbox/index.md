---
title: "Installing Ubuntu 22.04 on VirtualBox"
date: 2022-07-22
excerpt: 
pageId: b21947d73c484da6892f1aaa602153d6
tags:
  - Virtualization
---

Ubuntu has a special place in my heart. It was the first Linux distribution I ever installed. Someone gave me an old fat Toshiba laptop, and since it was running the ancient Windows Vista and thus was practically useless, I followed a guide to flash Ubuntu. With it, I self-hosted a personal website that I never got to production because I spent all my time designing a loading screen. But I digress.

Ubuntu is a well-known Linux distribution based off Debian. Due to its popularity, it’s useful as a starting point for understanding virtualization. Although I installed Ubuntu here, this serves as a model for any VirtualBox operating system because so much is the same. 

# Virtualization and VirtualBox

[*Virtualization*](https://www.ibm.com/cloud/learn/virtualization-a-complete-guide), in a nutshell, is the process of using software to fake hardware. Through virtualization, a computer can allocate a fraction of its resources, like RAM and CPU, to *virtual machines* which behave as though they are real computers, hence the term “virtual.”

In virtualization-land, virtual machines are called *guests* and the machine that is running them is called the *host*. This is easy to remember if you think of virtual machines as parasites. They are guests which leech the resources from a host device.

With those definitions out of the way, *VirtualBox* is a powerful open-source (free!) application to virtualize. Alright, enough theory!

# Getting Started

I had VirtualBox installed from a while back, so all I needed to do to get started was to ensure it was up-to-date. You can download it for your OS [here](https://www.virtualbox.org/wiki/Downloads). 

Installing a virtual operating system, like building a computer, requires a few parts. Since we’re working virtually, however, we start with the “soul,” or the disc that holds the OS’s code, since it can take a while to download.

The Ubuntu website provides a [download page](https://ubuntu.com/download/desktop) with ISO files, which are exactly what VirtualBox needs. I chose the latest version of Ubuntu desktop (at the time of this writing, Ubuntu 22.04 LTS). Depending on when you read this, the LTS version might not be the latest one. Choose LTS if you’re concerned about longer-term stability and support.

{% figure "I don’t drink coffee, so I won’t suggest you grab yourself a cup." %}{% image "Untitled-4559e069.png", "I don’t drink coffee, so I won’t suggest you grab yourself a cup." %}{% endfigure %}

It’s time for a challenge. Depending on your WiFi speed, if you feel confident, you should be able to finish the following steps before the download finishes. I excused myself from this, however, because I had to take screenshots for this article.  

After opening VirtualBox and clicking on the blue badge-shaped “New” button, there are two ways to set up a virtual machine: guided and advanced. Whichever option you choose will not affect your ability to follow along. I chose guided.

{% figure "The first screen of guided setup" %}{% image "Untitled-29cdde22.png", "The first screen of guided setup" %}{% endfigure %}

If you name your VM like I did (Ubuntu 22.0 Desktop), VirtualBox will intelligently select its type and version. Make sure your settings match the ones of the ISO you downloaded. For the remaining screens, I stuck with the recommended defaults. To make your VM run smoother, increase its RAM if you can afford to.

After the first screens of set up, I navigated to Settings > Storage and virtually inserted the disk by attaching the ISO file, which, in your case, should be just downloaded by now if you finished the challenge in time. I didn’t know, however, that if I had just clicked “Start,” VirtualBox would have prompted me to insert the ISO anyway.

{% figure "This is the hard way to insert the ISO file." %}{% image "Untitled-4dcaafa0.png", "This is the hard way to insert the ISO file." %}{% endfigure %}

When I started the VM, a setup screen appeared. 

{% figure "It’s alive!" %}{% image "Untitled-3b302ece.png", "It’s alive!" %}{% endfigure %}

{% image "Untitled-8fbfd1fc.png" %}

{% aside %}
If your cursor gets “captured” by the VM, just hit the right `Ctrl` key.
{% endaside %}

{% figure "One of the reasons for Ubuntu’s popularity is its aesthetic." %}{% image "Untitled-ee24f296.png", "One of the reasons for Ubuntu’s popularity is its aesthetic." %}{% endfigure %}

After a few minutes, it booted up. Then, the install screen appeared, where I chose to “Install Ubuntu.” And since its virtual disk was empty, I selected “Erase disk and install Ubuntu.” The rest of the defaults I left alone, since everything was self-explanatory.

{% figure "The installation completed after a while." %}{% image "Untitled-6bc979a6.png", "The installation completed after a while." %}{% endfigure %}

And we’re done! On the next boot, I detached the Ubuntu ISO disk because the machine didn’t need it anymore. This is how the fully-installed desktop finally looked:

{% figure "Gorgeous." %}{% image "Screen_Shot_2022-07-22_at_11.56.23_AM-6d0fa7e9.png", "Gorgeous." %}{% endfigure %}

After all this, your question might be “why would anyone ever find this useful?” Obviously, running a computer in a computer is less efficient. It also does not absolutely secure your host machine from specialized attacks on the guest operating system.

Nevertheless, virtual machines are useful abstractions because they allow people, to a certain degree, to try different operating systems without fully installing them onto hardware or even run multiple systems at once. Back-end developers will be familiar with technologies like Vagrant and Docker which aim to isolate systems from each other. Finally, for the security engineer, virtual machines are a convenient way to set up a device to test attacking on. There are a host of other uses. Ubuntu is just a starting point! 

Virtual machines are a computing analogue to dreams. They are abstract and often transient, but they leave their mark on the world nonetheless.

{% aside %}
After installing Ubuntu successfully, I found that there was a problem with the setup of my Windows 10 host. For the keen-eyed, my first screenshots of the VM window showed a turtle icon in the status bar, meaning that it was not running optimally. I managed to fix that in {% mentionPageId "e599eb48-505d-4d94-87ff-71e54829829d" %}.
{% endaside %}

