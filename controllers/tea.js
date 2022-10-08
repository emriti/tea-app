const os = require('os');

//GET '/tea'
const getAllTea = (req, res, next) => {
    res.json({message: "GET all tea, " + os.hostname() });
};

//POST '/tea'
const newTea = (req, res, next) => {
    res.json({message: "POST new tea, " + os.hostname()});
};

//DELETE '/tea'
const deleteAllTea = (req, res, next) => {
    res.json({message: "DELETE all tea, " + os.hostname()});
};

//GET '/tea/:name'
const getOneTea = (req, res, next) => {
    res.json({message: "GET 1 tea, os: " + os.hostname() + ", name: " + req.params.name});
};

//POST '/tea/:name'
const newComment = (req, res, next) => {
    res.json({message: "POST 1 tea comment, os: " + os.hostname() + ", name: " + req.params.name});
};

//DELETE '/tea/:name'
const deleteOneTea = (req, res, next) => {
    res.json({message: "DELETE 1 tea, os: " + os.hostname() + ", name: " + req.params.name});
};

//export controller functions
module.exports = {
    getAllTea, 
    newTea,
    deleteAllTea,
    getOneTea,
    newComment,
    deleteOneTea
};