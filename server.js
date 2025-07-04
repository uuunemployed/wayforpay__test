const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Дані мерчанта (тестові)
const merchantAccount = "github_com9";
const merchantDomainName = "wayforpay-test-1.onrender.com";
const secretKey = "6653d8afe86b434a14b18f1dcd485feb00ebb10d";

app.post('/api/payment', (req, res) => {
  const orderReference = "ORDER_" + Date.now();
  const orderDate = Math.floor(Date.now() / 1000);
  const amount = "1000.00";
  const currency = "UAH";

  const productName = ["Процессор Intel Core i5-4670 3.4GHz"];
  const productCount = ["1"];
  const productPrice = ["1000.00"];

  // Формуємо рядок для підпису — типи всі рядки, порядок суворий!
  const signatureString = [
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate.toString(),
    amount,
    currency,
    ...productName,
    ...productCount,
    ...productPrice
  ].join(";");

  // Генеруємо підпис HMAC MD5 з секретним ключем
  const merchantSignature = crypto.createHmac("md5", secretKey)
    .update(signatureString)
    .digest("hex");

  console.log("Signature string →", signatureString);
  console.log("Generated Signature →", merchantSignature);

  res.json({
    merchantAccount,
    merchantDomainName,
    authorizationType: "SimpleSignature",
    merchantSignature,
    orderReference,
    orderDate,
    amount,
    currency,
    productName,
    productCount,
    productPrice,
    clientFirstName: "Іван",
    clientLastName: "Денис",
    clientEmail: "denisivan06007@gmail.com",
    clientPhone: "380668136150",
    language: "UA",
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));