const http = require('https')
     ,locapos = require('locapos')
     ,locapos_token = ''
     ,client = new locapos(locapos_token)
     ,trace_key = 'b938b25';

setRelayData();

function setRelayData(){
    setInterval(function(){
        var url = 'https://data-live.flightradar24.com/zones/fcgi/feed.js?faa=1&mlat=1&flarm=1&adsb=1&gnd=1&air=1&vehicles=1&estimated=1&maxage=7200&gliders=1&stats=1&selected=b938b25&ems=1';
        http.get(url, function(resp){
            var body = '';
            resp.setEncoding('utf8');

            resp.on('data', function(chunk){
                body += chunk;
            });
            resp.on('end', function(resp){
                if (body.length == 0){
                    console.log('null');
                    return;
                }

                try{
                    
                    var latest = JSON.parse(body)
                        ,lat = latest[trace_key][1]
                        ,lon = latest[trace_key][2]
                        ,dir = latest[trace_key][3]
                        ,fl  = latest[trace_key][4]
                        ,spd = latest[trace_key][5]
                        ,fno = latest[trace_key][13];

                    //send to locapos
                    client.locations.update(lat, lon, dir, {},function(err,res) {
                        if (res) {console.log(fno + ' ' + lat + ', ' + lon + ' FL:' + fl + ' SPD:'+ spd);}
                    });
                } catch(e){
                    console.log('error!!');
                }
            });
        }).on('error', function(e){
            console.log(e.message);
        });
    }, 20000);
}


/*
//array structure

["86E7BC",  ADSHEX
57.8307,    latitude
-174.5558,  longitude
250,        HDG(DEG)
38000,      FL(FT)
460,        SPEED(KT)
"3545",     ?
"F-EST",    FL24-RADERSITE
"B789",     Aircraft
"JA873A",   REG NO
1478826237, ?
"SEA",      Departure 
"NRT",      Arrival
"NH177",    Flight number
0,          ?
0,          ?
"ANA177",   Flight number
0]          ?
*/
