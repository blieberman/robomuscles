var express = require('express');
var router = express.Router();
var mongoOp     =   require('../model/mongo');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Robo API' });
});

/* Call back function for return JSON response     */
function callback(err, data, res){
	// Mongo command to fetch all data from collection.
    if(err) {
    	response = {"error" : true,"message" : "Error fetching data"};
    } else {
        response = {"error" : false,"message" : data};
    }
    res.json(response);   
}

/* Parse the request to find all query parameters */
function getCondition(req){
	 var condition = {};
	 // Add subzone to query
	 if(req.query.subzone != null){
     	condition.subzone=req.query.subzone;
     }
	 // Add zone to query
     if(req.query.zone != null){
     	condition.zone=req.query.zone;
     }
	 // Add biomimic to query
	 if(req.query.biomimic != null){
     	condition.biomimic=req.query.biomimic;
     }     
	 // Add region to query
     if(req.query.region !=  null){
     	condition.region=req.query.region;
     }
     // Add wavexp to query
     if(req.query.waveexp != null){
     	condition.waveexp=req.query.waveexp;
     }
	 // Add site to query
     if(req.query.site != null){
     	condition.site=req.query.site;
     }
	 // Add location to query
     if(req.query.location !=  null){
     	condition.location=req.query.location;
     }
     
	 // Add country to query
     if(req.query.country !=  null){
     	condition.country=req.query.country;
     }	 
     
     return condition
}

/* Parse the request to query between start and end date */
function getTimeCondition(req){
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
	return { 'data.Time' : { $lte : endDate , $gte : startDate}};
}

/* Parse the request to query for potential math operations on data */
function getMathOp(req){
	var date_grouping = getDateGrouping(req);
	if (req.query.mathOp == "min") {
		return { _id: date_grouping , retVal: { $min : "$temp" }};
	}
	if (req.query.mathOp == "max") {
		return { _id: date_grouping, retVal: { $max : "$temp" }};
	}
	if (req.query.mathOp == "avg") {
		return { _id: date_grouping, retVal: { $avg : "$temp" }};
	}
}

/* Parses the request to group on date interval: yearly, daily, or monthly */
function getDateGrouping(req){
	var condition = {};
	
	condition.year = "$year" ;
	if (req.query.interval == "yearly"){ return condition; }
	
	condition.month = "$month";
	if (req.query.interval == "monthly"){return condition; }
	
	condition.day = "$day";	
	return condition; 
}

/* Parses the obj to concat according to: yearly, daily, or monthly */
function getDateConcat(req){
	if (req.query.interval == "yearly"){ 
		return { $concat : ["$_id.year"] }; }
	
	if (req.query.interval == "monthly"){
		return { $concat : ["$_id.year", "-", "$_id.month"]}; }
	
	return { $concat : ["$_id.year", "-", "$_id.month","-","$_id.day"] }
}

/* Parses the date into years, months and days */
function parseDates(req){
	var condition = {};
	condition.temp = "$data.Temperature(C)";
	condition.year = 	{ $substr: ["$data.Time", 0, 4] };
	condition.month = 	{ $substr: ["$data.Time", 5, 2] };
	condition.day = 	{ $substr: ["$data.Time", 8, 2] };
	
	return condition;
}

/* Get the data entries using the request parameters */
router.get('/document/data', function(req,res){
	var response = {};
     	var condition = getCondition(req);
		mongoOp.aggregate( {$match: condition},
							function(err,data){ callback(err,data,res);}); 
});

/* Get the data entries using the request parameters */
router.get('/data', function(req,res){
	var response = {};
     	var condition = getCondition(req);
     	var time_condition = getTimeCondition(req);
     	
        if (!req.query.mathOp && !req.query.interval) {
			mongoOp.aggregate( {$match: condition},    // Filters on everything but date
  				{$unwind: "$data"},    			// Creates individual docs for time & temp
  				{$match: time_condition},    	// Filters on dates
  				{$project:    					// Creates new doc format
  					{ 	_id:0,    				//  -- leave out ID
  				  		time: "$data.Time",    	//  -- Add time & temp fields
  				  		temp: "$data.Temperature(C)"}},

			function(err,data){ callback(err,data,res);});
		} else if (req.query.mathOp && req.query.interval) {
			var math_operation = getMathOp(req);
			var date_interval = parseDates(req);
        	mongoOp.aggregate( {$match: condition},    // Filters on everything but date
                {$unwind: "$data"},   		 	// Creates individual docs for time & temp
                {$match: time_condition},    	// Filters on dates
                {$project : date_interval }, 	// Breaks down into: temp, year, month, day
				{$group: math_operation },    	// Performs math operation and does grouping
				{$sort : { '_id.year': 1, 
						   '_id.month': 1, 
						   '_id.day': 1 }},
				{$project: { _id : 0, 
							 date: getDateConcat(req), 
							 ret_val : "$retVal" }},
				function(err,data){ callback(err,data,res);} );
		} else {
			response = {"error": true, "message" : "Requires BOTH an operation & date interval or NEITHER."};
        	res.json(response);
		}
})

/* Upload new data using post paramaters */
router.post('/upload', function(req,res){
    var response = {};
    var db = new mongoOp();
    db.zone = req.body.zone;
    db.biomimic = req.body.biomimic;
    db.subzone = req.body.subzone;
    db.site = req.body.site;
    db.location = req.body.location;
    db.country = req.body.country;
    db.data = req.body.data;

    db.save(function(err){
        // save() will run insert() command on MongoDB
        if(err) {
            response = {"error": true, "message" : "Error adding data"};
        } else {
            response = {"error": false, "message" : "Data added"};
        }
        res.json(response);
    });
});

/* Get distinct filter options using the request paramaters */
router.get('/filter/:param', function(req,res){
     var condition = getCondition(req);
     var param = req.params.param;
     var response = {};
     mongoOp.distinct( param, 
     				  condition,
     				  function(err,data){ callback(err,data,res);})});

module.exports = router;
