var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("api.robo.blieberman.me");

// Confirm server is running
describe("Testing connection..",function(){
  it("Responds to /",function(done){
    // calling home page api
    server.get("/").expect(200).end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      done();
    });
  });
  
  it("404 for everything else",function(done){
    // everything else should return 404 error
    server.get("/foo/bar").expect(404).end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(404);
      done();
    });
  });
});

describe("Testing filters..", function(){
	it("Get biomimics.. ", function(done){
		server.get("/filter/biomimic?").expect(200).end(function(err,res){
			test = ['Water Temperature', 'robobarnacle','robocoral', 'robomussel'];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});
	it("Get countries.. ", function(done){
		server.get("/filter/country?biomimic=robocoral").expect(200).end(function(err,res){
			test = ['Belize'];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});
	it("Get locations.. ", function(done){
		server.get("/filter/location?biomimic=robocoral&country=Belize").expect(200).end(function(err,res){
			test = [ "Carrie Bow Cay","Cat Cay","Channel Cay","Manatee Cay"];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});
	it("Get regions.. ", function(done){
		server.get("/filter/region?biomimic=robocoral&country=Belize").expect(200).end(function(err,res){
			test = [ "Carrie Bow Cay","Cat Cay","Channel Cay","Manatee Cay"];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});
	it("Get sites.. ", function(done){
		server.get("/filter/site?biomimic=robocoral&country=Belize").expect(200).end(function(err,res){
			test = ["BZSCCB", "BZSCCC", "BZSCCH", "BZSCMC"];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});
	it("Get zones.. ", function(done){
		server.get("/filter/zone?biomimic=robocoral&country=Belize&region=Cat Cay").expect(200).end(function(err,res){
			test = ["2m", "5m","10m","1m","0m"];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});
	it("Get subzone.. ", function(done){
		server.get("/filter/subzone?biomimic=robocoral&country=Belize&region=Cat Cay").expect(200).end(function(err,res){
			test = ["Backreef","Lagoon"];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});
	it("Get waveexp.. ", function(done){
		server.get("/filter/waveexp?biomimic=robocoral&country=Belize&region=Cat Cay").expect(200).end(function(err,res){
			test = ["N/A"];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});
});

// Confirm server is running
describe("Retrieve data",function(){
	it("Get time and temperature data.. ", function(done){
		server.get("/data?biomimic=robocoral&region=Cat%20Cay&subzone=Backreef&zone=10m&startDate=2002-03-16&endDate=2002-03-17").expect(200).end(function(err,res){
    		test = [
   { temp: 26.3, time: '2002-03-16T19:00:00' },
   { temp: 26.3, time: '2002-03-16T19:10:00' }, 
   { temp: 26.3, time: '2002-03-16T19:20:00' },
   { temp: 26.3, time: '2002-03-16T19:30:00' },
   { temp: 26.3, time: '2002-03-16T19:40:00' },
   { temp: 26.3, time: '2002-03-16T19:50:00' },
   { temp: 26.3, time: '2002-03-16T20:00:00' },
   { temp: 26.3, time: '2002-03-16T20:10:00' },
   { temp: 26.3, time: '2002-03-16T20:20:00' },
   { temp: 26.3, time: '2002-03-16T20:30:00' },
   { temp: 26.3, time: '2002-03-16T20:40:00' },
   { temp: 26.3, time: '2002-03-16T20:50:00' },
   { temp: 26.3, time: '2002-03-16T21:00:00' },
   { temp: 26.3, time: '2002-03-16T21:10:00' },
   { temp: 26.4, time: '2002-03-16T21:20:00' },
   { temp: 26.4, time: '2002-03-16T21:30:00' },
   { temp: 26.4, time: '2002-03-16T21:40:00' },
   { temp: 26.3, time: '2002-03-16T21:50:00' },
   { temp: 26.3, time: '2002-03-16T22:00:00' },
   { temp: 26.3, time: '2002-03-16T22:10:00' },
   { temp: 26.3, time: '2002-03-16T22:20:00' },
   { temp: 26.3, time: '2002-03-16T22:30:00' },
   { temp: 26.3, time: '2002-03-16T22:40:00' },
   { temp: 26.3, time: '2002-03-16T22:50:00' },
   { temp: 26.3, time: '2002-03-16T23:00:00' },
   { temp: 26.3, time: '2002-03-16T23:10:00' },
   { temp: 26.3, time: '2002-03-16T23:20:00' },
   { temp: 26.3, time: '2002-03-16T23:30:00' },
   { temp: 26.3, time: '2002-03-16T23:40:00' },
   { temp: 26.3, time: '2002-03-16T23:50:00' }];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});
	it("Return empty set.. ", function(done){
		server.get("/data?biomimic=robocoral&region=Cat%20Cay&subzone=Backreef&zone=10m").expect(200).end(function(err,res){
    		test = [];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});
});


describe("Testing statistics for DAILY intervals..", function(){
	it("Get minimum.. ", function(done){
		server.get("/data?biomimic=robocoral&region=Cat%20Cay&subzone=Backreef&zone=10m&startDate=2002-03-16&endDate=2002-03-17&mathOp=min&interval=daily").expect(200).end(function(err,res){
			test = [ { _id : { "day": "16",
							  "month": "03",
							  "year": "2002" },
					   "retVal": 26.3 } ];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});
	
	it("Get maximum.. ", function(done){
		server.get("/data?biomimic=robocoral&region=Cat%20Cay&subzone=Backreef&zone=10m&startDate=2002-03-16&endDate=2002-03-17&mathOp=max&interval=daily").expect(200).end(function(err,res){
			test = [ { _id : { "day": "16",
							  "month": "03",
							  "year": "2002" },
					   "retVal": 26.4 } ];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});	
	
	it("Get average.. ", function(done){
		server.get("/data?biomimic=robocoral&region=Cat%20Cay&subzone=Backreef&zone=10m&startDate=2002-03-16&endDate=2002-03-17&mathOp=avg&interval=daily").expect(200).end(function(err,res){
			test = [ { _id : { "day": "16",
							  "month": "03",
							  "year": "2002" },
					   "retVal": 26.309999999999988 } ];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});
});

describe("Testing statistics for MONTHLY intervals..", function(){	
	it("Get minimum.. ", function(done){
		server.get("/data?biomimic=robocoral&region=Cat%20Cay&subzone=Backreef&zone=10m&startDate=2002-03-16&endDate=2002-05-17&mathOp=min&interval=monthly").expect(200).end(function(err,res){
			test = [{ _id: { month: '05', year: '2002' }, retVal: 28.2 },
   					{ _id: { month: '04', year: '2002' }, retVal: 27.3 },
   					{ _id: { month: '03', year: '2002' }, retVal: 26.1 } ];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});	
	
	it("Get maximum.. ", function(done){
		server.get("/data?biomimic=robocoral&region=Cat%20Cay&subzone=Backreef&zone=10m&startDate=2002-03-16&endDate=2002-05-17&mathOp=max&interval=monthly").expect(200).end(function(err,res){
			test = [{ _id: { month: '05', year: '2002' }, retVal: 28.4 },
 				 	{ _id: { month: '04', year: '2002' }, retVal: 28.4 },
  	 				{ _id: { month: '03', year: '2002' }, retVal: 27.7 }];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});
	
	it("Get average.. ", function(done){
		server.get("/data?biomimic=robocoral&region=Cat%20Cay&subzone=Backreef&zone=10m&startDate=2002-03-16&endDate=2002-05-17&mathOp=avg&interval=monthly").expect(200).end(function(err,res){
			test = [{ _id: { month: '05', year: '2002' }, retVal: 28.285590277777636 	},
   					{ _id: { month: '04', year: '2002' }, retVal: 27.81578703703576 	},
  					{ _id: { month: '03', year: '2002' }, retVal: 26.843424657534367	}];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});
});

describe("Testing statistics for YEARLY intervals..", function(){	
	it("Get minimum.. ", function(done){
		server.get("/data?biomimic=robocoral&region=Cat%20Cay&subzone=Backreef&zone=10m&startDate=2002-03-16&endDate=2002-05-17&mathOp=min&interval=yearly").expect(200).end(function(err,res){
			test = [ { _id: { year: '2002' }, retVal: 26.1 }];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});	
	
	it("Get maximum.. ", function(done){
		server.get("/data?biomimic=robocoral&region=Cat%20Cay&subzone=Backreef&zone=10m&startDate=2002-03-16&endDate=2002-05-17&mathOp=max&interval=yearly").expect(200).end(function(err,res){
			test = [{ _id: { year: '2002' }, retVal: 28.4 }];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});
	
	it("Get average.. ", function(done){
		server.get("/data?biomimic=robocoral&region=Cat%20Cay&subzone=Backreef&zone=10m&startDate=2002-03-16&endDate=2002-05-17&mathOp=avg&interval=yearly").expect(200).end(function(err,res){
			test = [{ _id: { year: '2002' }, retVal: 27.696993419560684 }];
			res.status.should.equal(200);
			res.body.message.should.eql(test);
			done();
		});
	});
});

/* Get distinct filter options using the request paramaters 
router.get('/filter/:param', function(req,res){
     var condition = getCondition(req);
     var param = req.params.param;
     var response = {};
     mongoOp.distinct( param, 
     				  condition,
     				  function(err,data){ callback(err,data,res);})}); */
  