<p align="center"><img src="https://github.com/naschorr/rapid-redirector/blob/master/resources/small_tile.png?raw=true"/></p>

# Rapid Redirector
Rapid Redirector is a Chrome extension that makes automated webpage redirection simple. It does this through two main functions. 

First, it will automatically try to determine if the newly visited page is meant for mobile devices, and then redirect the user to the desktop version of that page. Currently, it only looks for the presence of 'm' or 'mobile' subdomains before redirecting the user to a a new domain that doesn't have the offending subdomain. For example, it would redirect 'm.reddit.com' to 'reddit.com.'

However, since this won't cover all cases, the extension also allows you to create your own redirections that will be performed when certain pages are navigated to. These *redirection rules* consist of two parts: a source domain and destination domain. It works by checking for an instance of the source domain in the URL of the page you just accessed, and then swapping out the source for the destination domain. Just like a find and replace command that you might use in a text editor. On top of that, it also allows you to specify the source domains as regular expressions, and then swap the destination domain into the matched text from the regular expression. These let you further expand the mobile redirection capabilities, as well as new rules to aid in your own browsing.

## Installation
Get it on the [Chrome Web Store](https://chrome.google.com/webstore/detail/rapid-redirector/ghdlibhfmakfnlbfeofbcndhkoeagjod)!

Or, just download and unzip the repo, navigate to chrome://extensions/, enable developer mode, and load the unpacked extension.

## Usage
After installation, clicking on the icon ![Extension icon active][small icon active] will bring up a popup interface with two basic options:
<p align="center"><img src="https://raw.githubusercontent.com/naschorr/rapid-redirector/master/resources/popup.png"/></p>

The 'Disable button is pretty self-explanatory, it'll stop all redirection, and allow you to browse the web as if this extension wasn't installed. After clicking on the 'Disable' button, it'll change into an 'Enable' button, which can be click to re-enable the redirection functionality. Also, you can tell which state the extension is in just by looking at the icon at the top right of the screen. The ![Extension icon active][small icon active] icon indicates that redirection is *enabled*, and ![Extension icon inactive][small icon inactive] indicates that redirection is *disabled*.

The 'Add Redirection Rule' button will take you to the interface that allows you to add new rules. Clicking on that leads us to this page:

<p align="center"><img src="https://raw.githubusercontent.com/naschorr/rapid-redirector/master/resources/empty.png"/></p>

Here, you can see two components on the page. The 'Add a rule:' section up top lets you add new rules, and regular expression based rules, while any saved rules will show up below, where the 'No redirection rules available' text is.

Adding a rule is simple, all you need to do is enter in your desired source and destination domains, and finally hit 'Add Rule.' These rules will show up in the table below with the default dark gray arrow, to show that they're just basic find and replace style rules.

<p align="center"><img src="https://raw.githubusercontent.com/naschorr/rapid-redirector/master/resources/add_rule.png"/></p>

Likewise, if your rule utilizes a regular expression, then you can enter the expression into the source domain field, as well as the desired destination domain that you would like to redirect to. After that, just click 'Add Regex.' These rules will show up in the table below with an orange arrow, to denote that they're regular expression based rules.

<p align="center"><img src="https://raw.githubusercontent.com/naschorr/rapid-redirector/master/resources/add_regex.png"/></p>

>This rule will always redirect to the Python 3.5 documentation, even if the link I clicked on was for another version of Python, like 2.7 or 3.3.

However, you may see some errors pop up for some of the rules that you may be trying to add. These errors can be removed by clicking on the X in the top right corner, or by just waiting for them to disappear on their own.

<p align="center"><img src="https://raw.githubusercontent.com/naschorr/rapid-redirector/master/resources/warning.png"/></p>

Warnings will look like this, and have some text telling you what's happened, and why the rule couldn't be added. In this case, the rule was empty. However, you'll also get warnings for trying to enter in duplicate rules, as well as trying to add in a rule that would produce a cycle with another rule, where the destination of one rule points to the source of another rule.

However, you may also see alerts like this:
<p align="center"><img src="https://raw.githubusercontent.com/naschorr/rapid-redirector/master/resources/alert.png"/></p>

This simply means that while your rule is valid, it may have some issues later on. For example, the differing subdomains in the amazon.com -> smile.amazon.com rule will lead to a failed redirection, since the end result after substituting and redirecting would be 'www.smile.amazon.com.' This is easily fixed by adding the 'www' subdomain to 'amazon.com.'

If you ever need to delete a rule, you can just hit the delete button (⌫) to the right of the rule, as seen here:
<p align="center"><img src="https://raw.githubusercontent.com/naschorr/rapid-redirector/master/resources/deletion.png"/></p>

[small icon active]: https://github.com/naschorr/rapid-redirector/blob/master/code/images/icon_16.png?raw=true "Extension icon active"
[small icon inactive]: https://github.com/naschorr/rapid-redirector/blob/master/code/images/icon_inactive_16.png?raw=true "Extension icon inactive"
