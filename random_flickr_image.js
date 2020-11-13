///////////////////////////////////////////////////////////////////////
// As an alternative to entering the api key and your username here  //
// you can also pass them into the widget as a widget parameter by   //
// using "Edit Widget" of the home screen.                           //
// Put paramters as follows: USERNMAE;API_KEY                        //
///////////////////////////////////////////////////////////////////////

// Insert your Flickr API key
const apiKey = ''
// Insert the username of the user you want to load pictures from
const username = ''
// Refresh interval in hours
const refreshInterval = 6
// Imagesize suffix. Find a list of valid suffixes: https://www.flickr.com/services/api/misc.urls.html
const sizeIndicator = 'b'
// Set true, if the image title should be shown at the bottom of the widget; otherwise false.
const showImageTitle = true


// URL prototype to use for loading a list of photos from the photoset with given ID
const getPhotosUrl = (key, photosetId, userId) => `https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${key}&photoset_id=${photosetId}&user_id=${userId}&format=json&nojsoncallback=1`
// URL prototype to use for loading the list of available photosets
const getPhotosetsUrl = (key, userId) => `https://www.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${key}&user_id=${userId}&format=json&nojsoncallback=1`
// URL prototype to use for loading the image
const imgUrlPrototype = (server, id, secret, size) => `https://live.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`
// URL prototype to use translate the given username into the user's flickr-ID needed in order to loaded pictures and photosets
const findByUsernameUrl = (key, user) => `https://www.flickr.com/services/rest/?method=flickr.people.findByUsername&api_key=${key}&username=${user}&format=json&nojsoncallback=1`


const widget = await createWidget()
if (!config.runsInWidget) 
{
	await widget.presentMedium()
}
Script.setWidget(widget)
Script.complete()


/*
 * Returns an instance of ListWidget that contains the contents of this widget.
 * The widget returned consists of a background image, a greyscaled gradient and
 * the image title in the slightly darker part of the grandient in the lower 
 * left corner of the widget.
 */
async function createWidget(items)
{
	let widget = new ListWidget()
	let selection = await getRandomPic()
	if(selection)
	{
		widget.backgroundImage = selection.image
	}
	widget.addSpacer()
	
	let startColor = new Color("#1c1c1c00")
	let endColor = new Color("#1c1c1cb4")
	let gradient = new LinearGradient()
	gradient.colors = [startColor, endColor]
	gradient.locations = [0.25, 1]
	widget.backgroundGradient = gradient
	widget.backgroundColor = new Color("1c1c1c")
	
	if(selection)
	{
		if(showImageTitle)
		{
			let titleText = widget.addText(selection.title)
			titleText.font = Font.thinSystemFont(12)
			titleText.textColor = Color.white()
			titleText.leftAlignText()
		}
	}
	else
	{
		let titleText = widget.addText("Could not load any images. Make sure to enter a valid username and API key!")
		titleText.font = Font.mediumSystemFont(12)
		titleText.textColor = Color.white()
		titleText.leftAlignText()
	}
	
	let interval = 1000 * 60 * 60 * refreshInterval
	widget.refreshAfterDate = new Date(Date.now() + interval)
	
    return widget
}

/*
 * Get a random image. Images inside of the JSON file are addressed in the 
 * following way:
 * 
 * server: 7372
 * id: 12502775644
 * secret: acfd415fa7
 */
async function getRandomPic()
{
	try
	{
		let userId = await getUserId()
		const photosetId = await getPhotosetId(userId)
		if(photosetId)
		{
			let data = await new Request(getPhotosUrl(getApiKey(), photosetId, userId)).loadJSON()
			if(data)
			{
				let photos = data.photoset.photo
				let num = Math.floor((Math.random() * (photos.length - 1)));
				let pic = photos[num]
				let imgUrl = buildImgUrl(pic['server'], pic['id'], pic['secret'])
				console.log(`Loading img ${imgUrl}`)
				let imgRequest = new Request(imgUrl)
				let img = await imgRequest.loadImage()
				return {image: img, title: pic['title']}
			}
			console.log("Could not get a valid photo ID to load a photo from!")
			return null
		}
		console.log("Could not get a valid photoset ID to chose a picture from!")
		return null
	}
	catch (e)
	{
		console.error(`getRandomPic: ${e}`)
		return null
	}
}

/*
 * Gets the complete image URL by inserting values into the placeholders of
 * the defined image URL prototype.
 */
function buildImgUrl(server, id, secret)
{
	return imgUrlPrototype(server, id, secret, sizeIndicator)
}

/*
 * Get random photosetId from available photosets
 */
async function getPhotosetId(userId)
{
	try
	{
		let data = await new Request(getPhotosetsUrl(getApiKey(), userId)).loadJSON()
		let photosets = data.photosets.photoset
		let num = Math.floor((Math.random() * (photosets.length - 1)));
		let set = photosets[num]
		let photosetId = set['id']
		console.log(`Chosen photosetId: ${photosetId}`)
		return photosetId
	}
	catch (e)
	{
		console.error(`getPhotosetId: ${e}`)
		return null
	}
}

/* 
 * Resolves the configured username into a flickr user-ID.
 * Returns null, if not resolvable!
 */
async function getUserId()
{
	try
	{
		let data = await new Request(findByUsernameUrl(getApiKey(), getUsername())).loadJSON()
		let id = data.user.id
		let idStr = encodeURIComponent(id)
		console.log(`Resolved user-ID: ${idStr}`)
		return idStr
	}
	catch(e)
	{
		console.error(`getUserId: ${e}`)
		return null
	}
}

/*
 * Gets the API key. Either by retrieving a configured paramter or by 
 * returning the configured API key constant at the top.
 * The parameter may contain username and API key separated by ';'
 */
function getApiKey()
{
	try
	{
		if(args.widgetParameter)
		{
			let params = args.widgetParameter.split(';')
			return params[1].trim()
		}
		
		return apiKey
	}
	catch(e)
	{
		console.error(`getApiKey: ${e}`)
		return null
	}
}

/*
 * Gets the username. Either by retrieving a configured paramter of by
 * returning the configured unsername constant at the top.
 * The paramter may contain username and API key separated by ';'
 */
function getUsername()
{
	try
	{
		if(args.widgetParameter)
		{
			let params = args.widgetParameter.split(';')
			return params[0].trim()
		}
		
		return username
	}
	catch(e)
	{
		console.error(`getUsername: ${e}`)
		return null
	}
}