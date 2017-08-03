const CryptoJS = require("crypto-js");
const express = require('express');
const app = express();

app.use(express.static('build'));
app.set('views', './build');

app.get('/new', (req, res) => {
  // generate new passphrase
  const passphrase = getNewPassphrase();

  // attach passphrase as a hash url and redirect
  res.redirect(`/#${passphrase}`);
});

app.get('/decrypt/:passphrase/:message', (req, res) => {
  const encryptedMessage = decodeURIComponent(req.params.message);
  const passphrase = req.params.passphrase;
  const decrypted = decrypt(encryptedMessage, passphrase);
  if(decrypted[2].expDate && !hasExpired(decrypted[2].expDate)) {
    res.json({name: decrypted[0].name, message: decrypted[1].message, expDate: decrypted[2].expDate});
  } else if (!decrypted[2].expDate) {
    res.json({name: decrypted[0].name, message: decrypted[1].message})
  } else {
      throw 'expired';
  }
});

app.get('/encrypt/:passphrase/:name/:message/:expDate?', (req, res) => {
  const expDate = req.params.expDate;
  const passphrase = req.params.passphrase;
  const name = req.params.name;
  const message = req.params.message;
  const dataToEncrypt = [{name: name}, {message: message}, {expDate: expDate}];
  const encrypted = encrypt(dataToEncrypt, passphrase);
  res.json({encryptedMessage: encrypted});
});

app.get('*', (req, res) => {
	res.sendFile(`${process.cwd()}/build/index.html`);
})

encrypt = (data, passphrase) => {
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), passphrase);
  return encryptedData.toString();
}

decrypt = (encryptedData, passphrase) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData.toString(), passphrase);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}

getNewPassphrase = () => {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

hasExpired = (expDate) => {
  today = new Date();
  expDate = new Date(expDate);
  today.setHours(0,0,0,0);
  expDate.setHours(0,0,0,0);
  return (expDate.getTime() < today.getTime());
}

const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log(`App listening on port ${port}!`);
})