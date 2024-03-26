## Instalasi

### Spesifikasi
- PHP ^8.1
- Laravel 10.x
- Database MySQL

### Cara Install

1. Clone atau download source code
    - Para terminal, clone repo `git clone git@github.com:blacklistcrew/ppoblv10.git`
    - atau `git clone https://github.com/blacklistcrew/ppoblv10.git`
    - Jika tidak menggunakan Git, silakan **Download Zip** dan *extract* pada direktori web server (misal: xampp/htdocs)
2. `cd ppoblv10`
3. `composer install`
4. Atur settingan di file env `cp .env.example .env`
    - Jika tidak menggunakan Git, bisa rename file `.env.example` menjadi `.env`
5. Pada terminal `php artisan key:generate`
6. Buat **database pada mysql** untuk aplikasi ini
7. **Setting database** pada file `.env`
8. `php artisan migrate --seed`
9. `php artisan serve`
10. Akses web melalui browser
11. Login user `admin` pass `admin`
12. Selesai

Silahkan dikembangkan sendiri