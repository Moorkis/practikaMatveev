
const nodePath = process.argv[0]; // Наши параметры
const appPath = process.argv[1];
const username = process.argv[2];
const userage = process.argv[3];



// подключение express
const express = require("express");
// создаем объект приложения
const app = express();
// определяем обработчик для маршрута "/"
app.get("/", function(request, response){ // заходим на главную страницу
     
    // отправляем ответ
    response.sendFile(__dirname+"/html/index.html"); // подгружаем страницу index.html
});
app.get('/about',function(request,response){
    response.sendFile(__dirname+"/html/about.html"); // подгружаем страницу about.html
});
app.get('/contacts',function(request,response){
    response.sendFile(__dirname+"/html/contacts.html"); // подгружаем страницу contacts.html
});
// начинаем прослушивать подключения на 3000 порту
app.listen(3000);
app.use(express.static(__dirname + '/html')); // Открываем доступ к папке с файлами Html/css/js
