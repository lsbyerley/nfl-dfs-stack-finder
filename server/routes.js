// Dependecies
var request = require('request');
var jwt = require('jwt-simple');
var moment = require('moment');
var cheerio = require('cheerio');
var fs = require('fs');

// Opens App Routes
module.exports = function(app, config) {
    
    function buildPlayerModels(json,date) {
        
        var players = [];
        //console.log(json);
        if (json.PlayerModels) {
            //console.log(json.PlayerModels);
			    
		    for (var i = 0; i < json.PlayerModels.length; i++) {
		        
                var player = json.PlayerModels[i];
                var source_id = parseInt(player.Properties.SourceId);
                var proj = (player.Properties.AvgPts) ? parseFloat(player.Properties.AvgPts) : 0;
                var salary = (player.Properties.Salary) ? parseFloat(player.Properties.Salary) : 0;
                var ceiling = (player.Properties.Ceiling) ? parseFloat(player.Properties.Ceiling) : 0;
                var floor = (player.Properties.Floor) ? parseFloat(player.Properties.Floor) : 0;
                var score = (player.Properties.Score) ? parseFloat(player.Properties.Score) : 0;
                var multiplier = (source_id === 11) ? 10 : 1000
                var point_per = parseFloat(((proj*multiplier) / salary)).toFixed(1);

                var p = {
                    "name": player.Properties.Player_Name,
                    "team": player.Properties.Team,
                    "opp": player.Properties.Opposing_TeamFB,
                    "pos": player.Properties.Position,
                    "source_id": source_id,
                    "proj": proj,
                    "salary": salary,
                    "point_per": point_per,
                    "ceiling": ceiling,
                    "floor": floor,
                    "score": score
                }
                players.push(p);
                
		    }
		    
		    var data = {
		        "success": true,
		        "date": date,
		        "PlayerModels": players
		    }
		    return data;
		    
		}
		
    }
    
    app.get('/api/playerlist/:modelId', function(req, res) {
        
        var modelId = req.params.modelId;
        var date = moment().format("MM_DD_YYYY");
        var url = 'http://www.fantasylabs.com/api/playermodel/1/'+date+'/?modelId='+modelId+'&existingKey=a868ae9f-eced-46f0-afae-5c1b79030778'
        
        request(url, function(error, response, data){
            
            if (error) throw error;
            var json = JSON.parse(data);
            var p_data = buildPlayerModels(json,date);
            res.send(p_data);

        });
        
    });
    
    app.get('/api/playertestdata', function(req, res) {
       
       var date = moment().format("MM_DD_YYYY");
       
       fs.readFile('public/json/testdata.json', (error, data) => {
			if (error) throw error;
			var json = JSON.parse(data);
			var p_data = buildPlayerModels(json,date);
            res.send(p_data);
		});
        
    });

};