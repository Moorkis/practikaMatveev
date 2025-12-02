create database practic default charset cp1251;
use practic;

create table orders(
id_order int primary key auto_increment,
fio_order varchar(150),
email varchar(100)
);
