//importing the express library-express creates web server in node.js
const express=require('express');
const cors=require('cors');
//an instance of express is ntg but app(object)
const app=express();
//port number
const port=3000;
app.use(cors());
//to access frontend files to urls
app.use(express.static('frontend'));
//for videos
const videos=[
    {
        title: "The Sustainability Changemaker Blueprint: Meet India's Eco-Fixers",
        url: "https://youtu.be/tPItfzHP5DE?si=Iry9WjJfGghOXBcw",
        thumbnail: "https://img.youtube.com/vi/tPItfzHP5DE/hqdefault.jpg"

    },
    {
        title: "Climate Change:Your Carbon Footprint Explained",
        url: "https://youtu.be/a9yO-K8mwL0?si=FLOlKv4HAhlegZn7",
        thumbnail: "https://img.youtube.com/vi/a9yO-K8mwL0/hqdefault.jpg"
    },
    {
        title: "Sustainability On a Budget",
        url: "https://youtu.be/juM8sRvSsaw?si=5Bw-9V8hFRIRI9I3",
        thumbnail: "https://img.youtube.com/vi/juM8sRvSsaw/hqdefault.jpg"
    },
    {
        title: "The EASIEST ways to cut your carbon footprint in half",
        url: "https://youtu.be/U9cjO_Y7tGw?si=h6FwIHK2w8dHHgI3",
        thumbnail: "https://img.youtube.com/vi/U9cjO_Y7tGw/hqdefault.jpg"
    },
    {
        title: "Carbon-Reduction Targets of India",
        url: "https://youtu.be/WtDJvlaOnaE?si=xm9DzorzQHDrjbez",
        thumbnail: "https://img.youtube.com/vi/WtDJvlaOnaE/hqdefault.jpg"
    },

]
//for articles
const articles=[
    {
        title: "Carbon Footprint-its impact on Climate",
         url: "https://www.footprintnetwork.org/our-work/climate-change/",
        thumbnail: "https://www.footprintnetwork.org/content/uploads/2023/06/NFBA-2023-World-EF-land-type-600x450-1.png"
    },
    {
        title: "Climate Change and Sustainability — Articles",
        url: "https://www.sir.advancedleadership.harvard.edu/articles/category/Climate+Change+and+Sustainability",
        thumbnail: "https://images.squarespace-cdn.com/content/v1/609e8ef1a8610975744dc9c2/1761342448953-0PXK3XT013LJR7LCJZEE/ai-generated-8560473_1280.jpg?format=2500w"
    }

]
//to access videos
app.get('/api/videos',(req,res)=>res.json(videos));
//to access articles
app.get('/api/articles',(req,res)=>res.json(articles));

//start the server
app.listen(port,()=>console.log('server running successfully'));