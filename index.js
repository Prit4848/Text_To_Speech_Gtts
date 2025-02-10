const express = require('express');
const app = express();
const Gtts = require('gtts');
const fs = require('fs');

app.get('/hear', function (req, res) {
  const text = "दिल्ली में विधानसभा चुनाव के नतीजे सभी 70 सीटों पर आ चुके हैं। दिल्ली में जहां 10 सालों से आप मजबूती से सत्ता पर काबिज थी वहीं इस बार नतीजे बदल गए। भाजपा को 48 सीटें मिली, वहीं आप को इस बार 22 सीटों से साथ हार का सामना करना पड़ा। भाजपा दिल्ली में सरकार बनाने जा रही है। लेकिन मुख्यमंत्री कौन बनेगा? यह अभी तक साफ नहीं हुआ है। लेकिन कुछ सीटें ऐसी है जिस पर प्रत्याशियों को काफी दिलचस्प जीत मिली हैं। ";
  const lang = req.query.lang || 'en';
  const gtts = new Gtts(text, lang);
  const filePath = 'output.mp3';

  gtts.save(filePath, function (err) {
    if (err) {
      console.error('Error:', err);
      return res.status(500).send('Error generating speech');
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    // Delete file after sending
    stream.on('end', () => fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    }));
  });
});

app.listen(3000, function () {
  console.log('Open URL to hear speech: http://localhost:3000/hear?lang=hi');
});
