/**
 * Created by taras on 8/7/17.
 */
var bitcore = require('bitcore-lib');
var request = require('request');
var srequest = require('sync-request');

var rootCas = require('ssl-root-cas').create();

rootCas
    .addFile(__dirname + '/you-can-start-today_com.ca-bundle')


// Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}

/* input */

var inTxHash="efdc921027b8a68ba0f28088b8aee7b891118aff47bc816238b3fc5d1549ca3c";
var inOutNum=0;
var inSum=0.5;

/* output */
var sum = 0.005;
var n =20;

/* wallet */
var change ="mvNuVGB5gAuVEKix2GdSnXLeMoJfFwxGTb";
var imported = bitcore.PrivateKey.fromWIF('cS6DeWMgVUC3rEetLYYb3SVnXPitMBa8qCUo6Trfy1hQWB1wyrTK');
var scriptPubKey = "76a914a30437529aa203d17d3cd5e5e298f7d569dbd39f88ac";


// These 2 functions were taken from
// https://github.com/bitpay/bitcore-wallet-service/blob/master/lib/model/txproposal.js#L243
var getEstimatedTxSize = function(nbOutputs) {
    // Note: found empirically based on all multisig P2SH inputs and within m & n allowed limits.
    var safetyMargin = 0.02;
    var overhead = 4 + 4 + 9 + 9;
    var inputSize = 147;  //P2PKH
    var outputSize = 34;
    var nbInputs = 1; //Assume 1 input
    var nbOutputs = nbOutputs || 2; // Assume 2 outputs
    var size = overhead + inputSize * nbInputs + outputSize * nbOutputs;
    return parseInt((size * (1 + safetyMargin)).toFixed(0));
};

// Approx utxo amount, from which the uxto is economically redeemable
var getMinFee = function( nbOutputs) {
    var feePerKB = 100000; // https://github.com/phplaboratory/bitcore-wallet-service/blob/master/lib/common/defaults.js#L35
    var lowLevelRate = (feePerKB / 1000).toFixed(0);
    var size = getEstimatedTxSize( nbOutputs);
    return size * lowLevelRate;
};


/*


 ./bitcoin-cli -testnet getnewaddress
 mvNuVGB5gAuVEKix2GdSnXLeMoJfFwxGTb

 ./bitcoin-cli -testnet dumpprivkey mvNuVGB5gAuVEKix2GdSnXLeMoJfFwxGTb
 cS6DeWMgVUC3rEetLYYb3SVnXPitMBa8qCUo6Trfy1hQWB1wyrTK

 ./bitcoin-cli -testnet sendtoaddress mvNuVGB5gAuVEKix2GdSnXLeMoJfFwxGTb 0.10
 478dbf8cad2454dd3c2ca221380f624909a0b76f723260b844fcde1dbf24ecc5


 ./bitcoin-cli -testnet gettransaction 478dbf8cad2454dd3c2ca221380f624909a0b76f723260b844fcde1dbf24ecc5
 {
  }



 */



function uploadtx(tx,keys,sum) {
    for (var i = 0; i < keys.length; i++) {
        var jsondata = {
            "inputHash": tx.id,
            "output": i,
            "inputSum": tx.outputs[i].satoshis ,
            "privateKey": keys[i]["key"],
            "scriptPubKey": tx.outputs[i]._scriptBuffer.toString('hex'),
            "total": bitcore.Unit.fromBTC(sum).toSatoshis(),
            "spent": false
        };
        console.log("json:",jsondata);

        request({
            url: 'https://taras:Dfg984Dswg@you-can-start-today.com/api/v1/transaction',
            agentOptions: {  ca: rootCas },
            method: 'POST',
            json: jsondata
        }, function (error, response, body) {
            if (!error && (response.statusCode == 200 || response.statusCode == 201)) {
              //  console.log("api reply:",body)
            } else {
                console.log("api reply error:",error,body)
            }
        })


    }
}


var broadcast = function (inTxHash,inOutNum,inSum) {
    var nOuts = n;
    var s;
    while ((s = inSum - nOuts * (sum + bitcore.Unit.fromSatoshis(getMinFee(1)).toBTC())- bitcore.Unit.fromSatoshis(getMinFee(nOuts)).toBTC()) < 0) {
        nOuts = nOuts - 1;
    }

    var utxo = {
        "txid": inTxHash,
        "vout": inOutNum,
        "address": change,
        "scriptPubKey": scriptPubKey,
        "amount": inSum
    };
    console.log("utxo",utxo);

    var transaction = new bitcore.Transaction()
        .from(utxo);
    transaction.version = 2;
    transaction.change(change);

    var out = [];
    for (var i = 0; i < nOuts; i++) {
        out[i] = {}
        var privateKey = new bitcore.PrivateKey();
        out[i]["key"] = privateKey.toWIF();
        var address = privateKey.toAddress(bitcore.Networks.testnet);
        transaction.to(address.toString(), bitcore.Unit.fromBTC(sum).toSatoshis() + getMinFee(1));  // Add an output with the given amount of satoshis
    }
    transaction.sign(imported, bitcore.crypto.Signature.SIGHASH_ALL | bitcore.crypto.Signature.SIGHASH_FORKID);
    console.log("==================================")
    console.log("Tx hash:",transaction.id)
    console.log("Raw Tx:",transaction.toString())
    console.log("==================================")



        var res = srequest('POST', 'http://104.154.27.106:3001/insight-api/tx/send', {
            headers: headers, json: {'rawtx': transaction.toString()}
        });

        if(res.statusCode!=200) {
            console.log("Error in insight", res,res.body.toString('utf8'));
            return [transaction.id, 0, 0];
        }


    console.log(res.getBody('utf8'));
    uploadtx(transaction, out, sum);


    /*
    request(
        {
            url: 'http://104.154.27.106:3001/insight-api/tx/send',
            method: 'POST',
            headers: headers,
            form: {'rawtx': transaction.toString()}
        },
        function (err, response, body) {
            if (err) {
                return console.log(err);
            }
            if (response.statusCode == 200) {
                console.log("insight reply:",body);
                uploadtx(transaction,out,sum);
            } else {
                console.log(response.statusCode, body);
        }
        }
    );
    */


    if(transaction.outputs.length >nOuts) {
        return [transaction.id, nOuts, bitcore.Unit.fromSatoshis(transaction.outputs[nOuts].satoshis).toBTC() ];
    } else {
        return [transaction.id, 0, 0];
    }


}


for (var LinTxHash =inTxHash,LinOutNum =inOutNum,s = inSum; s>sum+bitcore.Unit.fromSatoshis(getMinFee(1)).toBTC(); ) {
    var r = broadcast(LinTxHash,LinOutNum,s);
    LinTxHash = r[0], LinOutNum= r[1],s = r[2];
    console.log(LinTxHash,LinOutNum,s);
}



