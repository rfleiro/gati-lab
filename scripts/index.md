---
title: Scripts from the Gati Lab
layout: default
group: scripts
---

<br><br>

**Below is a script I started writing back at the LMB. It visualizes 3D classification jobs from [RELION](https://www3.mrc-lmb.cam.ac.uk/relion/index.php?title=Main_Page) and should be compatible with the most recent version (3.1). I tried to keep the script flexible, but if something breaks, please feel free to reach out.**

[Download here: class-wiz.py](https://github.com/gatic/gati-lab/blob/master/scripts/class-wiz.py)

**The output PDF file has various flavors of information. It starts with some plots about the convergence behavior:**

<img class="img-fluid mx-auto d-block" src="{{site.baseurl}}/static/img/scripts/accuracy.png" alt="accuracy">

**Show how particles jump around between classes:**

<img class="img-fluid mx-auto d-block" src="{{site.baseurl}}/static/img/scripts/carpetplot.png" alt="carpet">

**Visualize how certain micrographs contribute to classes, which might be important for merging datasets or to look at any kind of systematic drift during data collection:**

<img class="img-fluid mx-auto d-block" src="{{site.baseurl}}/static/img/scripts/micrographs.png" alt="carpet">

**...to histograms about every single column in the last data.star file. Classification sometimes does interesting things, such as classifying particles based on defocus, coordinates (which might be an indication of varying ice thickness) etc.**

<img class="img-fluid mx-auto d-block" src="{{site.baseurl}}/static/img/scripts/histo.png" alt="histo">
