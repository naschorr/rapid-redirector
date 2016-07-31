# Immobile
Immobile is a Chrome extension that makes automatic webpage redirection simple. It does this through two main functions. 

First, it will automatically try to determine if the newly visited page is meant for mobile devices, and then redirect the user to the desktop version of that page. Currently, it only looks for the presence of 'm' or 'mobile' subdomains before redirecting the user to a a new domain that doesn't have the offending subdomain. For example, it would redirect 'm.reddit.com' to 'reddit.com.'

However, since this won't cover all cases, the extension also allows you to create your own redirections that will be performed when certain pages are navigated to. These *redirection rules* consist of two parts: a source domain and destination domain. It works by checking for an instance of the source domain in the URL of the page you just accessed, and then swapping out the source for the destination domain. This lets you further expand the mobile redirection capabilities, as well as new rules to aid in your own browsing.

## Installation
Just download and unzip the repo, navigate to chrome://extensions/, enable developer mode, and load the unpacked extension.

Alternatively, open up your Chrome extension list, and then drag and drop the rFormula1-Sidebar-Spoiler-Stopper.crx file into the list. After that, it should be ready to go (temporarily).

A proper Chrome Web Store release is coming soon!

## Usage
After installation, clicking on the icon ![extension icon small](https://raw.githubusercontent.com/naschorr/Immobile/master/code/images/icon_16.png) will bring up a popup interface with two basic options:
<p align="center"><img src="https://raw.githubusercontent.com/naschorr/Immobile/master/resources/popup.png"/></p>

The 'Disable' button refers to what will happen to the popup's redirection ability after the button is pressed. In this case, pressing 'Disable' will disable redirection. Likewise, pressing 'Enable' would enable redirection.

The 'Add Redirection Rule' button will take you to the interface that allows you to add new rules. Clicking on that leads us to:

<p align="center"><img src="https://raw.githubusercontent.com/naschorr/Immobile/master/resources/options.png"/></p>

Here, you can see several components of the page. The 'Add a rule:' section up top lets you add new rules, while the 'Current rules' portion below lets you review and delete exising rules.

Adding a rule is simple, all you need to do is enter in your desired source and destination domains, and finally hit 'Add.' However, you may see some errors pop up for some rules you may be trying to add in.

<p align="center"><img src="https://raw.githubusercontent.com/naschorr/Immobile/master/resources/warning.png"/></p>

Warnings will look like this, and have some text telling you what's happened, and why the rule couldn't be added. In this case, the rule was empty. However, you'll also get warnings for trying to enter in duplicate rules, as well as trying to add in a rule that would produce a cycle with another rule, where the destination of one rule points to the source of another rule.

However, you may also see alerts like this:
<p align="center"><img src="https://raw.githubusercontent.com/naschorr/Immobile/master/resources/alert.png"/></p>

This simply means that while your rule is valid, it may have some issues later on. In this case, the differing subdomains in the amazon.com -> smile.amazon.com rule will lead to a failed redirection, since the end result after substituting and redirecting would be 'www.smile.amazon.com.' This is easily fixed by adding the 'www' subdomain to 'amazon.com.'

If you ever need to delete a rule, you can just hit the delete button to the right of the rule, as seen here:
<p align="center"><img src="https://raw.githubusercontent.com/naschorr/Immobile/master/resources/deletion.png"/></p>

