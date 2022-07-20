---
title: "How I (Painfully) Installed Windows 10 on Virtualbox"
date: 2022-07-18
excerpt: 
pageId: e599eb48505d4d9487ff71e54829829d
tags:
  - Virtualization
---

I had installed Ubuntu before. I had even installed MacOS. But I had no clue Windows 10 on Virtualbox would the nastiest to do. It took a lot of head-banging just to figure out what the problem was. For historical purposes, I’m leaving the first part of this article as I originally wrote it under “What I tried,” so that hopefully, someone out there with the same problem as myself will benefit from a walk-through of the thought process. 

**TL;DR** - Hyper-V (WSL, Docker) and Virtualbox are enemies right now (and enemies of Virtualbox are my enemies). [Disabling Hyper-V](https://forums.virtualbox.org/viewtopic.php?t=98642) is the one tweak that will allow a Windows 10 guest to run. Then, the installation steps are straightforward:

1. [Download](https://www.microsoft.com/en-us/software-download/windows10) the official Windows 10 ISO image.
1. While you wait, create a VM with the default settings and a little more RAM and CPU cores if you can afford it.
1. Start the machine, and attach the Step 1 `.iso` file.
1. Run Windows 10 setup and wait for installation to complete.

# What I tried

Microsoft offers Windows 10 for [download](https://www.microsoft.com/en-us/software-download/windows10). On their main download page, they provide an executable which can create a configurable ISO image. 

{% figure "Step one: open VirtualBox and create a new machine." %}{% image "Untitled-5c500922.png", "Step one: open VirtualBox and create a new machine." %}{% endfigure %}

Obviously, when creating the VM, choose Windows 10 as the operating system. For RAM setup, 2048 MB seemed a little low, so I increased it to 4096 MB. I stuck with the defaults for the hard drive setup. As in my {% mentionPageId "b21947d7-3c48-4da6-892f-1aaa602153d6" %} walk-through, find the Storage menu under Settings, then choose a disk file for the disk marked “Empty”. Then, having attached the ISO created earlier to the newly-created machine, I booted it up.

{% image "Untitled-2fee8ccd.png" %}

{% image "Untitled-5abb3427.png" %}

The following screens for installation were straightforward to understand, so I’m not including them.

Then I stopped writing this thing. I had run into a brick wall. 

# The Problem

The VM refused to finish installation. It would be eternally stuck on the Windows loading screen, then hit a boot loop. This was frustrating considering I expected my host PC to perform better. Somewhere, I read that Windows installs frequently take several days, so I left the VM running, to no avail. I tried different ISOs, turning off audio, increasing CPU and RAM, using fixed allocated disks.

In desperation, I did something I would never attempt otherwise: I watched a YouTube tutorial to see what I was doing wrong and if the process was indeed this frustrating. I could tell nothing from it because the guy used cuts during the loading screens!

No tweak worked. Windows 10 simply refused to install. So I gave up. 

A month later, while I was installing other VMs, I figured I should try installing Windows 10 again. I dug a little deeper into the issue and found that a specific line in the Virtualbox log indicated an issue with virtualization: 

```plain text
HMR3Init: Attempting fall back to NEM (Hyper-V is active)
```

What is VT-x? Alongside AMD-V, it is virtualization technology that a processor manufacturer (e.g. Intel or AMD) provides. Without it, Virtualbox has to fall back to a slower [emulated mode](https://www.reddit.com/r/virtualbox/comments/tcvtlr/comment/iaw1v57/?utm_source=share&utm_medium=web2x&context=3). A quick way to tell if this is happening is to check the status bar of the machine when it is running for a turtle. 

{% figure "The turtle looks like this." %}{% image "Untitled-3795f356.png", "The turtle looks like this." %}{% endfigure %}

# The Solution

Searching for the log message lead to a [forum post](https://forums.virtualbox.org/viewtopic.php?t=98642) that eliminated the turtle for me. But before you follow that link, it may important to understand a little more of the context for the problem and the caveats of the solution. 

When another service is using it, VT-x becomes unavailable, hence the log message. In Windows 10 (my host OS), there is a technology called *Hyper-V* for virtualization which confusingly conflicts with Virtualbox. When it is running, it takes all the VT-x for itself, leaving Virtualbox in miserable turtle-land. There are [ways](https://www.how2shout.com/how-to/use-virtualbox-and-hyper-v-together-on-windows-10.html) to work around this conflict, but as of right now, they make Virtualbox slower. This is not ideal for my lab, where I will need my guest OSes functioning optimally. Thus, I disabled Hyper-V. 

Unfortunately, this broke something that I have been using for quite some time: Windows Subsystem for Linux. For those who use Docker, it will no longer work as well, because both it and WSL require Hyper-V to function. For a final patch to this, read on to the end.

I also deleted the old OS, drives and all, and created a new one with the following settings, which I found to be optimal on my host machine after days of trial and error. Stars indicate non-default settings:
| Setting | Value |
|---|---|
| Base memory (RAM) | 4096 MB* |
| Processors (CPUs) | 2* |
| Video memory | 128 MB |
| Virtual disk size | 50 GB |
| Virtual disk type | Dynamically allocated |

# The Results

{% figure "800x600 pixels of magnificence" %}{% image "Untitled-d8fccb13.png", "800x600 pixels of magnificence" %}{% endfigure %}

Windows 10 installed! 

Evidently, in the lower right corner of the window, the turtle all but disappeared. With Hyper-V off, setup happened much quicker (50x!) than before. And I had the satisfaction of resolving a month-long problem. This reminded me of the principle that problem-solving sometimes, counterintuitively, takes some time to distance you from the heat and mental ruts of the moment. 

⚡💾

