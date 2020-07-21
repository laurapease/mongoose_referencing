const Performer = require('../models/performer');

const newPerformer = (req, res) => {
  Performer.find({}, (err, performers) => {
    res.render('performers/new', {
      performers
    })
  })
}

const create = (req, res) => {
  // Need to "fix" date formatting to prevent day off by 1
  // This is due to the <input type="date"> returning the date
  // string in this format:  "YYYY-MM-DD"
  const s = req.body.born;
  req.body.born = `${s.substr(5, 2)}-${s.substr(8, 2)}-${s.substr(0, 4)}`;
  Performer.create(req.body, function (err, performer) {
    res.redirect('/performers/new');
  });
}

module.exports = {
  new: newPerformer,
  create
}