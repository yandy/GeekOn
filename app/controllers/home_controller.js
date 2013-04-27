
exports.index = function(req, res){ 
    req.session.user = req.session.user || null;
    res.render('home',{ 
                        title: 'Welcome',
                        user: req.user
                      }
      )
  }