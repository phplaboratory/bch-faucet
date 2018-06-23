/**
 * Created by taras on 8/7/17.
 */

var txdata="0100000001711ec051d83ec201829023ce4db7bf3180b596e39c7ed749b357f56cd13812c8000000006a47304402205e06292ef0e34495ded35b55a961d3de7b6a5a71a3f4e45ee38c5fbfb787865c02203ab37f1be9c22cc8b2bd64579bea67d479086b4d182b40193b9d4680258b43444121021c8fbae4ec4a476bcd17aec017ba7b40b8313f47b6b24cc0b1ae020bf8cece13ffffffff0a40420f00000000001976a914b6ef39d624b511b8bab3ebea02dadb3be9ad73c788ac40420f00000000001976a9145eb08e5ff2528d1969ce38e8562efbd2af018fcd88ac40420f00000000001976a914c45d8aa660c0af705f7c0fbeb2aea31d57ef537188ac40420f00000000001976a914f7831d76044503436ebdfbc179c6a908366760e888ac40420f00000000001976a91413e0409526f34e404d8c1da5a64921b9fcf3997c88ac40420f00000000001976a914e0760be9a5ceeb30096b3a47c5e260782becb16388ac40420f00000000001976a91420fd1ce45e1aef86e8cc01f58c70621e4316d2a688ac40420f00000000001976a914ebf2d4d91b9c9e08376c172daedde67d966624fe88ac40420f00000000001976a914d14bb830d930ed63ad430b7f5baf8743a44e9d7488ac40420f00000000001976a9141ea01305cdfb2e6fea791dee93e150ea0766a5e588ac00000000";

/*

 mxCDrg9T85z2gHBBvfhFCSuwuxzLQiRpZd Ky9X6PEY2Ni9YLwUxWorYrEiMccZHThHPfzxe5FqDsxFbAcpi2rM
 mp9dKRTi9LKcap4fdkTmhALZoBghu1pJgy L1rH2t7yBzXbGjLj3CnZm3ZSt9z2Q44TtwRJQ38F2vQHgFcUjbV6
 myREo37KbX8Qii9awqPTrmH8NAKsbUEtAm Kwy52FLgEeBnk1EvoHtG9KRNyjGEFzgX4QV21LXiVvo12Z9UaPKX
 n45gGUKCgwPiSMBw326hYsuxSwX9e4CQbP L3QpsdG2vB3iLCgoK6Sj8rrqeq8L2fQD2EpY2svZySzBraCC16Wx
 mhL3n27phyd7ZfAUtV3ZJDdS8bXS11FTXw L5U27yzUhsZvy4cvUXpLMMpN6hRrG8eKX9MXYjKyVNFvVCQ2auow
 n1yo53LBwqbUiDieJDddxUbHRRFWdbKoZy L4vpccpqakGfSmqXSdtciiaoKenYFjdVJGLQEa8QyvPcWJjr5C6J
 miXP8nLE7qApgmVqkV4AyeHRTE3ecPwuEG Kyp3zRgsDLZdkFq7s7Cj6EeqgjiKJJWUuYfWZ13C5dzGSswgooEP
 n32XzMjS8EwJfWrMP15h3ectm9jnA8rdX6 KyPVwKYGgFN4JYx5YNZggEqkhaC13L5qaZB8MRrT5frFcKmPN2Gm
 mzbcEEFnZqEJug7XYLif4eF73wixiEw4Xe KxAwF2od22CzNBGcfF7pwsYTyXdvh55FYkAg3VuQf5aXcnjf2cDE
 miJtKy2Y9rhUtLUhjipsjFu3qoeNKXV7Ey L2aaDVtNPvpF82U3YNsg9WnFqzUGgRqNQudUxsdUWq8QTK6KkgoV

 
 */


var request = require('request');

// Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}

// Configure the request
var options = {
    //url: 'http://66.70.180.6:3001/insight-api/tx/send',
    url: 'http://104.154.27.106:3001/insight-api/tx/send',
    method: 'POST',
    headers: headers,
    form: {'rawtx': txdata }
}

// Start the request
request(options, function (err, response, body) {
    if(err) { return  console.log(err);}
    console.log(response.statusCode);
    if (response.statusCode == 200) {
        // Print out the response body
        console.log(body);
    } else if (response.statusCode == 201) {
        console.log(body);
    } else {
        console.log(response.statusCode,err );
    }
})
