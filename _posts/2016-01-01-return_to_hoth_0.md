---
title: "Return to Hoth"
layout: campaign
category: campaign
started: 2016-01-01
excerpt_separator: <!--more-->
---

<div id="cards"></div>


![]({{ site.baseurl }}/assets/images/rebel/diala-passil_256x409.png)
![]({{ site.baseurl }}/assets/images/rebel/gaarkhan_256x409.png)
![]({{ site.baseurl }}/assets/images/rebel/jyn-odan_256x409.png)

### A campaign playing through the Return to Hoth Expansion pitting the heroes Fenn Signis, Diala Passil, Gaarkhan, and Jyn Odan against the Imperials and their Military Might.

<!--more-->

{% for post in site.categories.return_to_hoth_0 reversed %}
    {% if post.url %}
[{{ post.title }}]({{ site.baseurl }}{{ post.url }})
    {% endif %}
{% endfor %}    