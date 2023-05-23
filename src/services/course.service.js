const Course = require("../Models/Course");

const getTrendingVideos=(array)=>{
    array.forEach(async(element) => {
        let id = element.courseId
        const result =await Course.findOne({courseId:id});
        console.log(result);
    });
}

module.exports= {getTrendingVideos}