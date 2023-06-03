const Reports = require("../models/report");
const asyncHandler = require("express-async-handler");
const { getVideoDetails } = require("../services/report.service");

const report = asyncHandler(async (req, res) => {
    const { courseId, videoId, report, userId } = req.body;
    const data = await Reports.findOne({ videoId });
    if (data) {
      (async (videoId, newData) => {
        await Reports.findOneAndUpdate(
          { videoId },
          { $push: { reports: { data: newData, userId: userId } } },
          { new: true }
        );
      })(videoId, report);
    } else {
      const result = await Reports.create({
        courseId,
        videoId,
        reports: [{ data: report, userId: userId }],
      });
    }
});

const getReport = asyncHandler(async (req,res) => {
    const result = await Reports.find({$expr: {$gt: [{$size: "$reports"}, 0]}});
    let response=[];
    for(id of result){   
      let data =await getVideoDetails(id.courseId,id.videoId,id.reports);
      if(data){
        response.push(data);
      }
    }
    res.json(response);

});

module.exports = { report, getReport };
