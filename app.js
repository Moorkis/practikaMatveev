const express = require("express");
const mysql = require("mysql2");
const app = express();
const parser = express.urlencoded({ extended: false });
const dbConfig = require("./config/db.config.js");
const fs = require('fs');
const path = require('path')
const conn = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  database: dbConfig.DB,
  password: dbConfig.PASSWORD,
});
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.rambler.ru",
  port: 465,
  secure: true,
  auth: {
    user: "moorkis@rambler.ru",
    pass: "veevtAm124@!",
  },
});

app.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка чтения файла:', err);
      return res.status(500).send('Внутренняя ошибка сервера');
    }
    const message = req.query.message || '';
    const messageWithStyle = message ? 
      `<div style="color: green; font-weight: bold; margin: 10px 0; padding: 10px; background: #f0fff0; border: 1px solid #90ee90; border-radius: 5px;">
         ${message}
       </div>` : 
      '';
    res.send(data.replace('{{message}}', messageWithStyle));
  });
});
app.get("/about", function (request, response) {
  response.sendFile(__dirname + "/html/about.html");
});
app.get("/contacts", function (request, response) {
  response.sendFile(__dirname + "/html/contacts.html");
});
app.listen(3000);
app.use(express.static(__dirname + "/html"));

app.post("/send", parser, (req, res) => {
  const name = req.body.ClientName;
  const mail = req.body.Email;
  const date = req.body.DateOrder;
  conn.query(
    "insert into orders(fio_order, email, date) values (?,?,?)",
    [name, mail, date],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.redirect('/?message=Ошибка при сохранении заявки');
      } else {
        const mailOptions = {
          from: "moorkis@rambler.ru",
          to: mail,
          subject: "Вы записаны в тюнинг ателье",
          text: `Здравствуйте, ${name}! Благодарим вас за выбор нашей компании. Ваш приём состоится ${date}`,
        };
        transporter.sendMail(mailOptions, (error, data) => {
          if (error) {
            console.error("Ошибка отправки письма:", error);
            return res.redirect('/?message=Ошибка отправки на почту');
          } else {
            return res.redirect('/?message=Заявка успешно отправлена! Проверьте вашу почту');
          }
        });
      }
    }
  );
});
app.use((req, res, next) => {
  res.status(404).send("Ошибка 404! Такой страницы не существует");
});
