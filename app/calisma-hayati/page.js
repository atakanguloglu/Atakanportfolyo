import Link from "next/link";
import TimelineWithModal from "./TimelineWithModal";

export const metadata = {
  title: "Çalışma Hayatım",
  description: "Kariyer ve deneyim zaman çizelgesi",
};

// Tarih sıralı: en yeni yukarıda. 🟢 + numara formatı.
const timelineData = [
  {
    year: "2024 – Şimdi",
    title: "Yazılım Uzman Yardımcısı",
    subtitle: "TMSF (Yaz Bilgi Sistemleri A.Ş.)",
    description: "Ar-Ge Departmanında ASP.NET, C#, ABP Framework ve yapay zeka entegrasyonları üzerine çalışıyorum. Kurumsal projelerde API geliştirme, DevOps süreçleri, RabbitMQ tabanlı mesajlaşma ve SignalR ile gerçek zamanlı sistemler üzerinde aktif rol alıyorum. IIS sunucu yönetimi ve deployment süreçlerinde deneyim sahibiyim.",
  },
  {
    year: "Haziran 2024 – Ekim 2024",
    title: "Artificial Intelligence Engineering & ASP.NET C# (Staj)",
    subtitle: "TMSF (Yaz Bilgi Sistemleri A.Ş.)",
    description: "ASP.NET C# ve web teknolojileri üzerine staj sürecimde Docker tabanlı yapay zeka sunucu dağıtım aracı ve Türkçe AI modeli geliştirdim. Geliştirilen sistemler, .NET Core ve ABP Framework altyapılarına entegre edilerek kurumsal projelerde kullanılabilir hale getirildi.",
  },
  {
    year: "2024 – Şimdi",
    title: "T3 AI'LE – Yerli Yapay Zeka Projesi",
    subtitle: "T3 Vakfı",
    description: "Python tabanlı yapay zeka projelerinde veri analizi, makine öğrenimi ve derin öğrenme alanlarında çalışmalar yürütüyorum. Yerli yapay zeka çözümlerinin geliştirilmesine katkı sağlıyorum.",
  },
  {
    year: "Mart 2023 – Haziran 2024",
    title: "Yazılım Teknolojileri Eğitmeni (C++)",
    subtitle: "T3 Vakfı",
    description: "Lise düzeyinde 40 öğrenciye C++ programlama eğitimi verdim. Öğrencilerin yazılım ve otomasyon teknolojileriyle tanışmalarını sağlayarak sınav ve proje süreçlerine rehberlik ettim.",
  },
  {
    year: "2020 – 2024",
    title: "Gönüllü Stajyer Mühendis",
    subtitle: "T3 Vakfı",
    description: "Çeşitli mühendislik ve yazılım projelerinde gönüllü olarak görev alarak yazılım geliştirme ve proje süreçleri hakkında saha deneyimi kazandım.",
  },
  {
    year: "2023",
    title: "Otomasyon Sistemleri Stajyeri",
    subtitle: "DAC-EL Mühendislik",
    description: "Siemens, Mitsubishi ve Banner tabanlı endüstriyel otomasyon sistemleri üzerine çalışmalar gerçekleştirdim. PLC ve otomasyon yazılımlarına yönelik uygulamalı deneyim kazandım.",
  },
  {
    year: "2023",
    title: "Takım Kurucusu & Proje Yöneticisi",
    subtitle: "TEKNOFEST Pre Take Off – Türkiye 3.'lüğü",
    description: "Yapay zeka destekli yüz ve cisim tanıma sistemleri geliştiren projenin kurucusu ve geliştiricisi olarak görev aldım. Projemiz savunma sanayi ve havacılık kategorisinde Türkiye üçüncüsü oldu.",
  },
  {
    year: "2023 – 2024",
    title: "Akademik Teşvik Sistemi Geliştiricisi",
    subtitle: "İstanbul Nişantaşı Üniversitesi",
    description: "15.000 aktif kullanıcısı bulunan akademik teşvik sisteminin analiz, tasarım ve geliştirme süreçlerinde görev aldım. Sistem PHP, Node.js ve Angular teknolojileriyle geliştirildi.",
  },
];

export default function CalismaHayatiPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
          Çalışma Hayatım
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-xl mx-auto mb-16">
          Kariyer ve deneyimlerim, tarih sırasıyla.
        </p>

        <TimelineWithModal timelineData={timelineData} />

        <p className="text-center mt-16">
          <Link href="/" className="text-primary-500 hover:underline font-medium">
            ← Ana sayfaya dön
          </Link>
        </p>
      </div>
    </div>
  );
}
