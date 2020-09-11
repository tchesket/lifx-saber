# lifx-saber
nodejs script to control lifx lights on a local network using the beatsaber-http-status mod. Lights will flash blue on left note hits (or more specifically 'NoteA' hits), and likewise red for 'NoteB' hits.



# Disclaimer
I do not know what I am doing, it is only by pure luck that this thing even functions at all, so don't expect things to be perfect; I'm sure there are a million things that could/should be done to improve the code, and I may get to some of them, but also I may not. Feel free to make pull requests if you want.



# Prerequisites
Requires the beatsaber-http-status mod to be installed and Beat Saber to be already running, otherwise program will crash
You can get the http-status mod here: https://github.com/opl-/beatsaber-http-status
Also requires nodejs to be installed. Only tested on my personal Windows 10 machine.



# Usage
From the command-line, navigate to the directory containing lifx-saber.js and run:
  'node lifx-saber.js'
You should then be prompted to enter the IP address of the lifx light on your network that you would like to sync to beat saber. You can enter a specific IP or use a broadcast address (for example, I use 192.168.0.255 to sync all of the lights on my network).



# Credits
This thing, as mentioned above, would not do anything without the http-status mod, so most of the credit goes to the author linked to above. Also most of this code is pieced together from other code I found in random places (on github mostly), so if you see some code that looks like is yours, I'll be happy to mention you here, but right now I can't remember where this all came from :)
