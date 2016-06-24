var Article = require('../models/Article');

exports.articlePost = function articlePost(req, res) {
  req.assert('title', 'Title cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  new Article({
    title: req.body.title,
    posts: req.body.posts,
    raw_posts: req.body.raw_posts,
    user_id: req.body.user_id
  }).save()
    .then(function ifSaved(post) {
      res.send({ msg: 'Article has been saved', post });
    })
    .catch(function ifErr(err) {
      return res.status(400).send({
        msg: `Error code: ${err.code}`
      });
    });
};

exports.articleGet = function articleGet(req, res) {
  new Article()
    .byStatus('draft')
    .then(function allFetched(articles) {
      res.send({ articles });
    })
    .catch(function fetchErr(errFetch) {
      console.log(errFetch);
      res.status(400).send({
        msg: 'Error while fetching data'
      });
    });
};

exports.articleDetail = function articleDetail(req, res) {
  new Article()
      .bySlug(req.params.slug)
      .then(function detailFetched(article) {
        res.send({ article });
      })
      .catch(function fetchErr(errFetch) {
        console.log(errFetch);
        res.status(400).send({
          msg: 'Error while fetching data'
        });
      });
};
