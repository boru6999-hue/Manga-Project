# Manga Project – UI / UX Flow

## Зорилго
Энэхүү md file нь хэрэглэгч болон админ
системтэй хэрхэн харилцах UX урсгалыг тодорхойлно.
Frontend UI, Backend API, Navigation бүтэц энэ flow-д тулгуурлана.


##  Нэвтрээгүй хэрэглэгч

Landing Page
 → Manga List
   → Manga Detail
     → Login / Register

##  Нэвтэрсэн хэрэглэгч

Home
 → Manga List
   → Manga Detail
     → Like
     → Comment
     → Add to Watchlist
     → Add to Favourite

##  Хэрэглэгч Бүртгүүлэх /login/

Login Page
 → Validation
   → Success → Home
   → Error → Login


##  Хэрэглэгч Бүртгүүлэх /register/

Register Page
 → Validation
   → Success → Login
   → Error → Register

## Төлбөр төлөх 

Wallet Page
 → Add Balance
   → Payment
     → Success → Wallet Updated
     → Failed → Error Message

## Watchlist & Favourite Flow

Profile
 → Watchlist
   → Manga Detail

Profile
 → Favourite
   → Manga Detail

## Admin Flow

Admin Login
    → Dashboard
    → Manga CRUD
    → Category CRUD
    → Tag CRUD
    → Banner Management
    → User Management

## Хоосон data /Empty State/

Action
    → Error
    → Show Error Message
    → Retry / Redirect

Empty Data
    → Show Empty State UI


## Navigation Rules

- Navbar бүх page дээр харагдана
- Unauthorized user admin page-д нэвтрэх боломжгүй
- Error үед хэрэглэгч ойлгомжтой мессеж авна

## UX Principles

- Хэрэглэгч 3-с их даралтгүйгээр зорилгодоо хүрэх
- Чухал action тод харагдах
- Error message ойлгомжтой байх

