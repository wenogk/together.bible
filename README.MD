# Bible Together

I started this open source project to allow people to open the bible on their browser and be connected to everyone else who is reading it at the same time, no matter where they are or what language / version of the bible they are reading. The point is to not allow them to really communicate with each other by voice/video/text chat but rather give them the feeling that they are not alone as they read the Bible.

Some of the web apps features are:
  * Ability to select and open multiple languages / versions of the bible
    * Will be using api.bible
  * Connect to everyone else who is using the site
    * Completely anonymous, no logins or registration, just open the site and get connected.
    * Simulate everyone's mouse movements on the page (i.e the user can see everyone else's cursor live on the site)
    * Ability to highlight parts of the text and the highlights are shared live with everyone else who is on the same chapter of the same version.
    * Displays a notification, live, when someone starts reading a chapter with "Someone from ___ is reading ___ "
    * An "Amen" button which when clicked plays a sound on everyone's computer/phone and does a nice floating heart runHeartAnimation
  * Decentralized data transmission using GunJS. No persisting database storage used at all for any of the functions of the site.
  * Mobile-first experience
  * Persistence of last read version/chapter of the bible on browser local storage
