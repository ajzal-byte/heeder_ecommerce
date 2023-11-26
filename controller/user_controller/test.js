//register: storing name, email and password and redirecting to home page after signup
app.post('/user/create', function (req, res) {
  bcrypt.hash(req.body.passwordsignup, saltRounds, function (err,   hash) {
 db.User.create({
   name: req.body.usernamesignup,
   email: req.body.emailsignup,
   password: hash
   }).then(function(data) {
    if (data) {
    res.redirect('/home');
    }
  });
 });
});