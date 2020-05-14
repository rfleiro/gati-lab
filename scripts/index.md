---
title: Scripts from the Gati Lab
layout: default
group: scripts
---

<br><br>

**Below is a little script I started writing back at the LMB. It visualizes 3D classification jobs from [RELION](https://www3.mrc-lmb.cam.ac.uk/relion/index.php?title=Main_Page) and should be compatible with the most recent version (3.1). I tried to keep the script flexible, but it turns out to still be relatively rigid. If something breaks, please feel free to reach out.**

[Download here: class-wiz.py](https://github.com/gatic/gati-lab/blob/master/scripts/class-wiz.py)

**The output PDF file has various flavors of information. It starts with some plots about the convergence behavior:**

<img class="img-fluid mx-auto d-block" src="{{site.baseurl}}/static/img/scripts/accuracy.png" alt="accuracy">

<img class="img-fluid mx-auto d-block" src="{{site.baseurl}}/static/img/scripts/carpetplot.png" alt="carpet">


**...to histograms about every single column in the last data.star file. The classification sometimes does interesting things, such as classifying particles based on defocus, coordinates etc.**

<img class="img-fluid mx-auto d-block" src="{{site.baseurl}}/static/img/scripts/histo.png" alt="histo">
