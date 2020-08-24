const Post = require('../db/models/Post')
 
module.exports = async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('post', {
        post
    });
}