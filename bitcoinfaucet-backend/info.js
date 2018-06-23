/**
 * Created by taras on 8/12/17.
 */

var request = require('request');



var rootCas = require('ssl-root-cas').create();

rootCas
    .addFile(__dirname + '/you-can-start-today_com.ca-bundle')


request({
    url: 'https://taras:Dfg984Dswg@you-can-start-today.com/api/v1/transaction',
    method: 'GET',
    agentOptions: {
        ca: rootCas
    }
    }, function (error, response, body) {
    // console.log(error, response, body)
    //if (!error && response.statusCode == 200) {
        // Print out the response body
         console.log(body)
/*
    } else {
        console.log(response.statusCode, error)
        console.log(body)
    }
    */
})
