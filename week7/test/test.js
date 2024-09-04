var expect  = require("chai").expect;
var request = require("request");

describe('API Endpoint Tests', function() {
    it('should return movies for valid numeric year range', function(done) {
        request.get('http://localhost:3040/getMoviesByYear?startYear=2000&endYear=2020', function(error, response, body) {
            if (error) return done(error);
            if (response.statusCode !== 200) return done(new Error('Status code is not 200'));

            const jsonResponse = JSON.parse(body);
            if (jsonResponse.statusCode !== 200) return done(new Error('API response status code is not 200'));

            done();
        });
    });

    it('should return an error for non-numeric startYear and endYear', function(done) {
        request.get('http://localhost:3040/getMoviesByYear?startYear=abc&endYear=xyz', function(error, response, body) {
            if (error) return done(error);
            if (response.statusCode !== 400) return done(new Error('Status code is not 400'));

            const jsonResponse = JSON.parse(body);
            if (jsonResponse.statusCode !== 400 || !jsonResponse.message.includes('Invalid year range')) {
                return done(new Error('API did not return the expected error message'));
            }

            done();
        });
    });

    it('should return an error for invalid year range (startYear > endYear)', function(done) {
        request.get('http://localhost:3040/getMoviesByYear?startYear=2025&endYear=2020', function(error, response, body) {
            if (error) return done(error);
            if (response.statusCode !== 400) return done(new Error('Status code is not 400'));

            const jsonResponse = JSON.parse(body);
            if (jsonResponse.statusCode !== 400 || !jsonResponse.message.includes('Invalid year range')) {
                return done(new Error('API did not return the expected error message'));
            }

            done();
        });
    });
});

describe("Fetch Movies Button Clicks", function() {
    it("should fetch movies based on year range", function(done) {
        var url = "http://localhost:3040/getMoviesByYear?startYear=2000&endYear=2020";
        request(url, function(error, response, body) {
            if (response.headers['content-type'].includes('application/json')) {
                body = JSON.parse(body);
                expect(response.statusCode).to.equal(200);
                expect(body.data).to.be.an('array');
            } else {
                expect.fail("Expected JSON response but got HTML");
            }
            done();
        });
    });
    
    it("should return error when startYear is greater than endYear", function(done) {
        var url = "http://localhost:3040/getMoviesByYear?startYear=2025&endYear=2020";
        request(url, function(error, response, body) {
            if (response.headers['content-type'].includes('application/json')) {
                body = JSON.parse(body);
                expect(response.statusCode).to.equal(400);
                expect(body.message).to.equal('Invalid year range');
            } else {
                expect.fail("Expected JSON response but got HTML");
            }
            done();
        });
    });
});

describe("Check UI Elements", function() {
    it("should have the correct page title", function(done) {
        var url = "http://localhost:3040/";
        request(url, function(error, response, body) {
            expect(body).to.include('<title>');  // Check if the title tag is present
            done();
        });
    });

    it("should have the Deakin University card image", function(done) {
        var url = "http://localhost:3040/";
        request(url, function(error, response, body) {
            expect(body).to.include('<img src="images/Deakin-University.jpeg"');   // Check if the Deakin image is present
            done();
        });
    });
});

describe("Add Two Numbers", function() {
    var url = "http://localhost:3040/addTwoNumbers/3/5";
    it("returns status 200 to check if api works", function(done) {
        request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done()
        });
    });
    it("returns statusCode key in body to check if api give right result should be 200", function(done) {
        request(url, function(error, response, body) {
            body = JSON.parse(body)
            expect(body.statusCode).to.equal(200);
            done()
        });
    });
    it("returns the result as number", function(done) {
        request(url, function(error, response, body) {
            body = JSON.parse(body)
            expect(body.result).to.be.a('number');
            done()
        });
    });
    it("returns the result equal to 8", function(done) {
        request(url, function(error, response, body) {
            body = JSON.parse(body)
            expect(body.result).to.equal(8);
            done()
        });
});
    it("returns the result not equal to 15", function(done) {
        request(url, function(error, response, body) {
            body = JSON.parse(body)
            expect(body.result).to.not.equal(15);
            done()
        });
    });
});

describe("Add Two strings", function() {
    var url = "http://localhost:3040/addTwoNumbers/a/b";
    it("should return status 200", function(done) {
        request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done()
        });
    });
    it("returns statusCode key in body to check if api gives right result should be 400", function(done) {
        request(url, function(error, response, body) {
            body = JSON.parse(body)
            expect(body.statusCode).to.equal(400);
            done()
        });
    });
    it("returns the result as null", function(done) {
        request(url, function(error, response, body) {
            body = JSON.parse(body)
            expect(body.result).to.be.a('null');
            done()
        });
    });
});


