# Random Flickr Image Widget
A widget for [Scriptable](https://scriptable.app) that chooses a random image from a random album out of the configured user's albums on flickr.

In order to use this widget, you will need a flickr API key!
If you do not have a key yet, get a free one at flickr's [App Garden](https://www.flickr.com/services/apps/create/).

## How to get started
At first get a flickr API key at flickr's [App Garden](https://www.flickr.com/services/apps/create/). You will need to tell Flickr what you a planing to do with this API key but it won't cost you anything as long as you are using it personally and the given constraints for personal keys fulfill your needs.

## Configuring the widget
There are mandatory settings and optional settings you have to or can configure when using Random-Flickr-Image-Widget. 

### What you have to configure
As mandatory settings you will have to set your Flickr acount's username and your API key. Make sure to follow the link I posted above to create one if you do not have one already. 
Setting up the mandatory parameters can be achieved in two way:
1. Write your username and API key into the widget's parameter field. 
To do so, press and hold your finger upon the widget until the context menu comes up. Select "Edit Widget." In the appearing settings screen enter your username and API key separated by a semicolon.
2. Edit the Script itself. 
To do so, open scriptable and open the source code using the three dotted button. Into line where you find the text `const apiKey` paste your Flickr API key between the two apostrophe characters. Make sure NOT to delete the apostophes! Into the line where you find the text `const username` enter your Flickr username between the two apostrophe characters. Make sure NOT to delete the apostrophes!

### What you can configure optionally
As optional settings you will be able to configure:
* the interval in which a new image will be pull out of the albums of your account
* the target resolution you would like your images to be loaded with. Hint: in order to save cellular data consumption, you may reduce the indicator. But by reducing the images will look way less sharp. 
* Whether or not to present the titles of the images that are pulled from an album. In some cases you do not want so see that IMG_123.jpg is currently presentd if you did not fill in reasonable titles to your images when uploading. 
