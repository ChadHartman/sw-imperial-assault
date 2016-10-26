---
title: "Return to Hoth"
layout: campaign
categories: campaign
started: 2016-10-16
excerpt_separator: <!--more-->
---

<div id="cards"></div>

![]({{ site.baseurl }}/assets/images/rebel/biv-bodhrik_256x409.png)
![]({{ site.baseurl }}/assets/images/rebel/diala-passil_256x409.png)
![]({{ site.baseurl }}/assets/images/rebel/saska-teft_256x409.png)
![]({{ site.baseurl }}/assets/images/rebel/verena-talos_256x409.png)
![]({{ site.baseurl }}/assets/images/imperial/precision-training_256x409.png)

<!--more-->

### A campaign playing through the Return to Hoth Expansion pitting the heroes Biv Bodhrik, Diala Passil, Saska Teft, and Verena Talos against the Imperials and their Precision Training.

{% for post in site.categories.return_to_hoth_1 reversed %}
    {% if post.url %}
[{{ post.title }}]({{ site.baseurl }}{{ post.url }})
    {% endif %}
{% endfor %}    