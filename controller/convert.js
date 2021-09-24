const crypto = require('crypto');
const Url = require('../models/url');

module.exports = {
  getShortened: async (req, res) => {
    const inputUrl = req.body.url;
    try {
      // validate input url
      const httpRegex = /^http:\/\//;
      const httpsRegex = /^https:\/\//;

      // add server side validate
      if (
        !inputUrl ||
        (!inputUrl.match(httpRegex) && !inputUrl.match(httpsRegex))
      ) {
        return res.send('Input wrong');
      }

      //check if input url exists in database
      const urlResult = await Url.findOne({ originalUrl: inputUrl });
      // if url already exists in database,
      if (urlResult)
        return res.status(200).json({
          url: urlResult,
        });
      let shortenedUrl = '';
      while (true) {
        // generate shortenerUrl
        shortenedUrl = crypto
          .randomBytes(Math.ceil((5 * 3) / 4))
          .toString('hex')
          .replace(/\+/g, '0')
          .slice(0, 6);

        // check if this url is unique
        const url = await Url.findOne({ shortenedUrl: shortenedUrl });
        if (!url) break;
      }

      await Url.create({
        originalUrl: inputUrl,
        shortenedUrl,
      });
      res.json({
        url: `${process.env.BASE_HOST}/${shortenedUrl}`,
      });
    } catch (error) {}
  },

  getOriginal: async (req, res) => {
    await Url.findOne({ shortenedUrl: req.params.shortenedUrl }).then(
      (data) => {
        // no such url
        if (!data) return res.status(404).send('No such url');
        res.redirect(data.originalUrl);
      },
    );
  },
};
