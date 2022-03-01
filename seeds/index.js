// requirements
const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelper')
const Campground = require('../models/campground');
const { arrayBuffer } = require('stream/consumers');

// connect mongoose
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then()

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// seed a new campground name
const sample = array => array[Math.floor(Math.random() * array.length)];


// seed a campground
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
           // author should be your userID
            author: '62160ea4f78d9a9461dbef58',
            // old ID 61f95e0753baad5ea16eb062
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab placeat consequuntur molestias nemo ea quam at.",
           price,
           geometry: {
              type: "Point",
              coordinates: [
                 cities[random1000].longitude,
                 cities[random1000].latitude,
              ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/wjbetech/image/upload/v1644062879/YelpCamp/br6i9nwqktt7wqexnywm.jpg',
                    filename: 'YelpCamp/ok5gf4lh27miwd5a9gpo'
                },
                {
                    url: 'https://res.cloudinary.com/wjbetech/image/upload/v1644062879/YelpCamp/ok5gf4lh27miwd5a9gpo.jpg',
                    filename: 'YelpCamp/br6i9nwqktt7wqexnywm'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
