exports.index = function(req, res){
  req.session.user = req.session.user || null;
  res.render('home',{
    title: '极客行动官方网站'
  }
  );
};
