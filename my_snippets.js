var updateQuery = Transaction.update({'spent': true}, {'spent': false});
updateQuery.limit(1);
updateQuery.exec(function (err, tx) {        console.log(err,tx);      });

 User.register({
 username: 'taras',
 email: 'php.laboratory@gmail.com',
 password: "Dfg984Dswg"
 })
 .then(function (user) {
 sails.log('created new user', user);
 })
 .catch(function (error) {
 sails.log.error(error);
 });
