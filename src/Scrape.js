require('dotenv').config()
const axios = require('axios');
const baseURL = "https://api.yelp.com/v3/businesses/search";
const descURL = "https://www.yelp.com/biz/";
const loc = "Seattle"
const category="restaurants"

// accept a category and location OR any of a location, category, price 
// and will forward a description, addy, url, phone #, pricing, pictures, tags (type of cuisine, etc.), hours - In a Business Object
getBiz([category], loc);

// Category and Location
function getBiz(categories, loc){
    var URL = baseURL + "?location=" + loc
    if (categories.length >= 1){
        URL = URL + "&categories=" + categories[0]
        for (var i = 1; i < categories.length; i++){
            URL = URL + "," + categories[i]
        }
    }
    getExperience(URL);
}

function getExperience(searchURL){
    console.log("Getting biz from Yelp Fusion")
    // make http call to url
    axios.get(searchURL, {
        headers: {
            'Authorization' : 'Bearer ' + process.env.YELP_API_KEY
        }
    }).then(
        (response) => {
            var randomNum = Math.floor(Math.random() * response.data.businesses.length)
            var randomBiz = response.data.businesses[randomNum]
            // console.log(randomBiz)
            // var bizDescription = scrapeDescription(randomBiz.id)
            // randomBiz.push({
            //     description: bizDescription
            // });
            console.log(randomBiz);
            return randomBiz;
        },
        (error) => {
            console.log(error);
        }
    );
}

// Scrapes description and hours from Yelp business page
async function scrapeDescription(id){
    let response = await axios(descURL + id).catch((err) => console.log(err));

    if(response.status !== 200){
        console.log("Error occurred while fetching data");
        return;
    };
    //TODO parse description and hours here
    response = response.data
    // console.log(response)
    //hours table - Class contains OpenhoursOpenhoursrow
    //description - Class starts w 
    // $('[class^="business"]').get()
}

