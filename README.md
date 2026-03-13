# SEO Analiz Raporu - Reklam Yonetim Paneli

Modern ve kullanicili bir reklam yonetim paneli. Google Ads, Meta Ads ve TikTok Ads kampanyalarinizi tek bir yerden yonetin.

## Ozellikler

- **Dashboard** - Genel bakis ve onemli metrikler
- **Kampanya Yonetimi** - Kampanyalari olusturun, duzenleyin ve takip edin
- **Hesap Yonetimi** - Farkli platform hesaplarini baglayin ve yonetin
- **Analitik** - Detayli performans raporlari ve grafikleri
- **Raporlar** - Ozellestirilebilir rapor sablonlari
- **Kullanici Yonetimi** - Kullanici ekleme, silme ve yetkilendirme
- **Takim Yonetimi** - Takim uyelerini davet edin ve yonetin
- **Ayarlar** - Profil ve hesap ayarlari

## Teknolojiler

- **Frontend:** Next.js 15, React 19, TypeScript
- **UI:** Tailwind CSS, shadcn/ui
- **Veritabani:** MariaDB/MySQL
- **Autentikasyon:** Cookie-based session

## Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn
- MariaDB/MySQL veritabani

### Adimlar

1. Repoyu klonlayin:
```bash
git clone <repo-url>
cd seoanalizraporu
```

2. Bagimliliklari yukleyin:
```bash
npm install
```

3. Ortam degiskenlerini ayarlayin:
```bash
cp .env.example .env.local
```

4. `.env.local` dosyasini duzenleyin:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sifreniz
DB_NAME=seoanaliz
```

5. Veritabani semasini olusturun:
```bash
npm run db:init
```

6. Gelistirme sunucusunu baslatin:
```bash
npm run dev
```

7. Tarayicinizda acin: `http://localhost:3000`

## Ortam Degiskenleri

| Degisken | Aciklama |
|----------|----------|
| `DB_HOST` | Veritabani sunucu adresi |
| `DB_PORT` | Veritabani portu (default: 3306) |
| `DB_USER` | Veritabani kullanici adi |
| `DB_PASSWORD` | Veritabani sifresi |
| `DB_NAME` | Veritabani adi |

## Giris Bilgileri

Varsayilan yonetici hesabi:

- **Kullanici adi:** `admin`
- **Sifre:** `admin123`

> Guvenlik nedeniyle ilk giristen sonra sifrenizi degistiriniz.

## Proje Yapisi

```
seoanalizraporu/
├── app/                    # Next.js App Router
│   ├── api/               # API rotalari
│   ├── dashboard/         # Dashboard sayfalari
│   └── page.tsx          # Ana sayfa
├── components/            # React bilesenleri
│   ├── ui/               # shadcn/ui bilesenleri
│   └── ...               # Ozel bilesenler
├── lib/                   # Yardimci kutuphaneler
│   ├── db.ts             # Veritabani baglantisi
│   └── services/        # Is mantigi servisleri
├── database/             # Veritabani dosyalari
│   └── schema.sql        # Veritabani semasi
└── public/               # Statik dosyalar
```

## Komutlar

| Komut | Aciklama |
|-------|----------|
| `npm run dev` | Gelistirme sunucusunu baslat |
| `npm run build` | Uretim derlemesi olustur |
| `npm run start` | Uretim sunucusunu baslat |
| `npm run lint` | Kod kalitesi kontrolu |
| `npm run db:init` | Veritabani tablolarini olustur |

## Lisans

Bu proje ozel kullanim icindir.