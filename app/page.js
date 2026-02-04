import Image from "next/image";
import Link from "next/link";

// public path kullanıyoruz; IIS/mobilde import hash path bazen yüklenmeyebiliyor
const PROFILE_IMAGE = "/profile.png";

import Blog from "./_components/Blogs";
import Clients from "./_components/Clients";
import Testimonial from "./_components/Testimonial";
import ContactForm from "./_components/ContactForm";
import Portfolio from "./_components/Portfolio";
import TechLogosBackground from "./_components/TechLogosBackground";
import { getAuthFromRequest } from "@/app/lib/auth-request";

import { Button } from "primereact/button";

import {
  ArrowDownTrayIcon,
  ArrowRightIcon,
  CodeBracketSquareIcon,
  NewspaperIcon,
  PencilSquareIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/solid";

export default async function Home() {
  const auth = await getAuthFromRequest();

  return (
    <>
      <div
        className="relative overflow-hidden pt-6 sm:pt-8 lg:pt-32 bg-gradient-to-bl from-primary-50/80 via-white to-primary-100/80"
        id="home"
      >
        <TechLogosBackground />
        <div className="container mx-auto px-4 sm:px-6 mb-32 relative">
          <div className="flex flex-col lg:flex-row lg:gap-x-32">
            <div className="lg:w-3/5 grid content-between">
              <div className="lg:mb-32">
                <h1 className="text-gray-900 font-semibold text-5xl lg:text-7xl">
                  Merhaba, Ben
                  <br />
                  Atakan Güloğlu
                </h1>
                <div className="text-lg text-gray-600 my-6">
                  Yazılım Mühendisiyim. Matematiksel algoritmalar, veritabanı yönetimi, otomasyon ve yapay zeka konularına odaklanıyorum. TEKNOFEST savunma sanayi kategorisinde Türkiye üçüncülüğü, Deneyap'ta eğitmenlik; endüstriyel yazılım projelerinde aktif rol alıyorum.
                </div>
                <Link
                  href="#contact"
                  className="p-button bg-primary-500 hover:bg-primary-600 border-primary-500 hover:border-primary-600 font-bold no-underline"
                >
                  Merhaba De!
                </Link>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 my-4 lg:my-0">
                <div className="flex justify-center flex-col items-center gap-y-2 p-6 bg-primary-100 rounded-xl">
                  <div className="font-bold text-2xl text-gray-900">5+ Y.</div>
                  <div className="text-gray-700 font-medium">Deneyim</div>
                </div>
                <div className="flex justify-center flex-col items-center gap-y-2 p-6 bg-primary-100 rounded-xl">
                  <div className="font-bold text-2xl text-gray-900">30+</div>
                  <div className="text-gray-700 font-medium">Tamamlanan Proje</div>
                </div>
                <div className="flex justify-center flex-col items-center gap-y-2 p-6 bg-primary-100 rounded-xl">
                  <div className="font-bold text-2xl text-gray-900">20+</div>
                  <div className="text-gray-700 font-medium">Mutlu Müşteri</div>
                </div>
              </div>
            </div>
            {/* Masaüstünde hero'da profil; mobilde sadece Hakkımda'daki (linkli) görünsün */}
            <div className="hidden lg:flex lg:w-2/5 bg-white rounded-2xl justify-center items-center">
              <div className="relative aspect-square text-center max-h-[460px]">
                <Image
                  src={PROFILE_IMAGE}
                  alt="Atakan Güloğlu - Portfolyo"
                  width={460}
                  height={460}
                  className="object-contain max-w-full h-full w-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="container mx-auto px-4 sm:px-6 bg-white rounded-2xl shadow-[0_36px_105px_0_rgba(43,56,76,0.10)] relative -mb-8 sm:-mb-12 lg:-mb-16"
          id="about"
        >
          <div className="flex items-center flex-col lg:flex-row lg:gap-x-32 p-4 lg:p-28">
            <div className="lg:w-2/5 flex justify-center items-center bg-[#F0F1F3]">
              <div className="relative aspect-square flex flex-col justify-center max-h-[460px]">
                <Image
                  src={PROFILE_IMAGE}
                  alt="Atakan Güloğlu - Portfolyo"
                  width={460}
                  height={460}
                  className="object-contain h-full w-auto max-w-full"
                  priority
                />
                <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-9 flex gap-1 bg-white w-auto mx-auto  p-3 rounded shadow-[0_12px_64px_0_rgba(28,25,25,0.12)]">
                  <Link
                    href="#"
                    className="flex justify-center items-center p-3 no-underline rounded group hover:bg-primary-500"
                  >
                    <i className="pi pi-facebook group-hover:text-white text-primary-500  text-2xl leading-none"></i>
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/atakan-g%C3%BClo%C4%9Flu-6613331b8/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center p-3 no-underline rounded group hover:bg-primary-500 "
                    title="LinkedIn"
                  >
                    <i className="pi pi-linkedin group-hover:text-white text-primary-500  text-2xl leading-none"></i>
                  </Link>
                  <Link
                    href="https://www.instagram.com/atakanguloglu_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center p-3 no-underline rounded group hover:bg-primary-500 "
                    title="Instagram"
                  >
                    <i className="pi pi-instagram group-hover:text-white text-primary-500  text-2xl leading-none"></i>
                  </Link>
                  <Link
                    href="https://github.com/atakanguloglu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center p-3 no-underline rounded group hover:bg-primary-500 "
                    title="GitHub"
                  >
                    <i className="pi pi-github group-hover:text-white text-primary-500  text-2xl leading-none"></i>
                  </Link>
                  <Link
                    href="#"
                    className="flex justify-center items-center p-3 no-underline rounded group hover:bg-primary-500 "
                  >
                    <i className="pi pi-pinterest group-hover:text-white text-primary-500  text-2xl leading-none"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="lg:w-3/5 grid mt-16 lg:mt-0">
              <div>
                <h1 className="text-gray-900 font-semibold text-4xl">
                  Yazılım Mühendisiyim
                </h1>
                <div className="text-lg text-gray-600 my-6">
                  <p className="mb-3">
                    Yazılım mühendisliği eğitimim süresince matematiksel algoritmalar, veritabanı yönetimi, otomasyon yazılımları ve yapay zeka konularına odaklandım. JokingSoft-Software ve JokingSoft-ARGE takımlarında liderlik yaptım; TEKNOFEST Pre Take Off 2023 savunma sanayi uzay havacılık kategorisinde Türkiye üçüncülüğü elde ettik.
                  </p>
                  <p>
                    Deneyap Atölyeleri'nde Yazılım Teknolojileri Eğitmeni olarak lise öğrencilerine eğitim verdim. Yazılım geliştirici olarak kendimi sürekli geliştiriyor, yeni teknolojileri takip ederek çeşitli projelerde aktif rol alıyor ve endüstriyel çözümler üretmek için çalışıyorum.
                  </p>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <Link
                    href="#portfolio"
                    className="p-button bg-primary-500 hover:bg-primary-600 border-primary-500 hover:border-primary-600 font-bold no-underline"
                  >
                    Projelerim
                  </Link>
                  <Link
                    href="/Atakan_Guloglu_ATS_CV.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Atakan_Guloglu_ATS_CV.pdf"
                    className="p-button p-button-outlined text-primary-500 font-bold no-underline"
                  >
                    <ArrowDownTrayIcon className="size-6 text-primary-500 mr-3" />
                    CV İndir
                  </Link>
                </div>
                {/* Kullandığım teknolojiler — yazılımcı detayı */}
                <div className="mt-8 pt-6 pb-6 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Kullandığım teknolojiler</p>
                  <div className="flex flex-wrap gap-2">
                    {["C#", ".NET", "ABP Framework", "ASP.NET Core", "Python", "Pandas", "OpenCV", "Görüntü İşleme", "Yapay Zeka", "scikit-learn", "TensorFlow", "React", "Next.js", "Node.js", "PostgreSQL", "Docker", "RabbitMQ", "SignalR", "API Entegrasyonu"].map((tech) => (
                      <span key={tech} className="inline-block px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md border border-gray-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 pb-10 lg:pb-36 pt-24 lg:pt-52" id="process">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center flex-col lg:flex-row lg:gap-x-32">
            <div className="lg:w-1/2">
              <div className="">
                <h2 className="text-gray-900 font-semibold text-4xl lg:text-5xl mb-6">
                  Çalışma Sürecim
                </h2>
                <div className="text-gray-500 text-lg">
                  <p className="mb-4">
                    Her projede araştırma, analiz, tasarım ve lansman aşamalarını
                    titizlikle uyguluyorum. Müşteri ihtiyaçlarını anlamak ve
                    kullanıcı odaklı çözümler sunmak önceliğimdir.
                  </p>
                  <p>
                    Süreç boyunca şeffaf iletişim ve zamanında teslimat
                    sağlıyorum.
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/2">
                <div className="flex flex-col gap-6 mt-8 lg:-mt-6">
                  <div className="bg-white p-8 rounded-xl group hover:shadow-[32px_32px_124px_0_rgba(43,56,76,0.10)]">
                    <div className="w-16 h-16 p-5 rounded-md bg-primary-100 group-hover:bg-primary-500 mb-8 mx-auto lg:mx-0 flex items-center justify-center">
                      <NewspaperIcon className="size-6 text-primary-500 group-hover:text-white" />
                    </div>
                    <div className="text-xl font-semibold text-gray-900 mb-3">
                      1. Araştırma
                    </div>
                    <p className="text-gray-600">
                      İhtiyaçları ve hedef kitleyi detaylı analiz ediyorum.
                    </p>
                  </div>
                  <div className="bg-white p-8 rounded-xl group hover:shadow-[32px_32px_124px_0_rgba(43,56,76,0.10)]">
                    <div className="w-16 h-16 p-5 rounded-md bg-primary-100 group-hover:bg-primary-500 mb-8 mx-auto lg:mx-0 flex items-center justify-center">
                      <CodeBracketSquareIcon className="size-6 text-primary-500 group-hover:text-white" />
                    </div>
                    <div className="text-xl font-semibold text-gray-900 mb-3">
                      2. Analiz
                    </div>
                    <p className="text-gray-600">
                      Verileri değerlendirip en uygun çözümü belirliyorum.
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="flex flex-col gap-6">
                  <div className="bg-white p-8 rounded-xl group hover:shadow-[32px_32px_124px_0_rgba(43,56,76,0.10)]">
                    <div className="w-16 h-16 p-5 rounded-md bg-primary-100 group-hover:bg-primary-500 mb-8 mx-auto lg:mx-0 flex items-center justify-center">
                      <PencilSquareIcon className="size-6 text-primary-500 group-hover:text-white" />
                    </div>
                    <div className="text-xl font-semibold text-gray-900 mb-3">
                      3. Tasarım
                    </div>
                    <p className="text-gray-600">
                      Kullanıcı dostu arayüz ve deneyim tasarlıyorum.
                    </p>
                  </div>
                  <div className="bg-white p-8 rounded-xl group hover:shadow-[32px_32px_124px_0_rgba(43,56,76,0.10)]">
                    <div className="w-16 h-16 p-5 rounded-md bg-primary-100 group-hover:bg-primary-500 mb-8 mx-auto lg:mx-0 flex items-center justify-center">
                      <PresentationChartLineIcon className="size-6 text-primary-500 group-hover:text-white" />
                    </div>
                    <div className="text-xl font-semibold text-gray-900 mb-3">
                      4. Lansman
                    </div>
                    <p className="text-gray-600">
                      Projeyi test edip canlıya alıyorum.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-10 lg:py-24 bg-white" id="portfolio">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-gray-900 font-semibold text-4xl lg:text-5xl mb-6 text-center">
            Portfolyo
          </h2>
          <div className="text-gray-400 text-center text-lg lg:w-1/2 mx-auto">
            <p>
              Web siteleri, uygulamalar ve UI/UX projelerimden seçmeler.
            </p>
          </div>
          <Portfolio />
          <div className="mt-12 text-center">
            <Link
              href="/projects"
              className="p-button bg-primary-500 hover:bg-primary-600 border-primary-500 hover:border-primary-600 font-bold no-underline"
            >
              Daha Fazla Proje
            </Link>
          </div>
        </div>
      </div>

      <div className="py-10 lg:py-24 bg-navy-900">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-white font-semibold text-4xl lg:text-5xl mb-6 text-center w-full lg:w-1/2 mx-auto">
            Proje fikriniz mi var? Birlikte konuşalım!
          </h2>
          <div className="text-primary-200 text-center text-lg w-full lg:w-1/2 mx-auto">
            <p>
              Web sitesi, uygulama veya tasarım projeniz için birlikte çalışalım.
              İhtiyacınıza uygun çözümler üretmek için buradayım.
            </p>
          </div>
          <div className="mt-12 text-center">
            <Link
              href="#contact"
              className="p-button bg-primary-500 hover:bg-primary-600 border-primary-500 hover:border-primary-600 font-bold no-underline"
            >
              <span className="inline-block mr-3">Birlikte çalışalım</span>
              <ArrowRightIcon className="size-6 text-white" />
            </Link>
          </div>
        </div>
      </div>
      <div
        className="relative overflow-hidden py-10 lg:py-24 bg-gradient-to-bl from-primary-50/80 via-white to-primary-100/80"
        id="blogs"
      >
        <TechLogosBackground />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <h2 className="text-gray-900 font-semibold text-4xl lg:text-5xl mb-6 text-center">
            Blog
          </h2>
          <div className="text-gray-400 text-center text-lg w-full lg:w-1/2 mx-auto">
            Yazılarım ve güncel paylaşımlarım.
          </div>
          <div className="mt-16">
            <Blog />
          </div>
        </div>
      </div>
      <div className="py-10 lg:py-24 bg-gray-50" id="services">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-32 items-center">
            <div>
              <h3 className="text-gray-950 text-4xl lg:text-5xl font-semibold">
                Neler Yapıyorum?
              </h3>
              <div className="text-gray-400 text-lg mt-6">
                Web siteleri, mobil uygulamalar, e-ticaret; Python ve C# ile otomasyon, API ve backend sistemleri; yapay zeka, görüntü işleme ve veri analitiği — hepsinde çözüm üretiyorum.
              </div>
              <div className="text-gray-400 text-lg mt-4">
                Modern teknolojilerle hızlı, güvenilir ve ölçeklenebilir uygulamalar geliştiriyorum.
              </div>

              <Link
                href="#contact"
                className="p-button bg-primary-500 hover:bg-primary-600 border-primary-500 hover:border-primary-600 font-bold no-underline mt-12"
              >
                Merhaba De!
              </Link>
            </div>
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-md border-0 border-white hover:border-primary-500 hover:shadow-[0_32px_96px_0_rgba(28,25,25,0.16)] border-l-4 border-solid p-8">
                <h3 className="text-gray-900 font-semibold text-lg">Web & Uygulama Geliştirme</h3>
                <div className="text-gray-700 mt-4">
                  Next.js, React, ASP.NET C# ile web siteleri, mobil uyumlu arayüzler ve kurumsal uygulamalar. UX/UI odaklı, ölçeklenebilir çözümler.
                </div>
              </div>
              <div className="bg-white rounded-md border-0 border-white hover:border-primary-500 hover:shadow-[0_32px_96px_0_rgba(28,25,25,0.16)] border-l-4 border-solid p-8">
                <h3 className="text-gray-900 font-semibold text-lg">Otomasyon & Backend</h3>
                <div className="text-gray-700 mt-4">
                  Python, C#, API ve veritabanı ile otomasyon yazılımları, web servisleri (SOAP/REST), mesaj kuyrukları ve backend sistemleri.
                </div>
              </div>
              <div className="bg-white rounded-md border-0 border-white hover:border-primary-500 hover:shadow-[0_32px_96px_0_rgba(28,25,25,0.16)] border-l-4 border-solid p-8">
                <h3 className="text-gray-900 font-semibold text-lg">Yapay Zeka & Görüntü İşleme</h3>
                <div className="text-gray-700 mt-4">
                  Python ile derin öğrenme, görüntü işleme, yüz/cisim tanıma ve veri analitiği. AI entegrasyonu ve özel modeller.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-10 lg:pt-24 pb-10 lg:pb-12 bg-gray-50 overflow-x-hidden">
        <div className="container mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 font-semibold text-4xl lg:text-5xl mb-6 text-center">
            Mutlu Müşteriler
          </h2>
          <div className="text-gray-600 text-center text-lg w-full lg:w-1/2 mx-auto">
            Birlikte çalıştığım markalar ve projeler.
          </div>
          <div className="mt-8 w-full overflow-x-hidden">
            <Clients />
          </div>
        </div>
      </div>
      <div className="lg:pt-12 pb-10 lg:pb-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-gray-900 font-semibold text-4xl lg:text-5xl mb-6 text-center">
            Referanslar
          </h2>
          <div className="text-gray-600 text-center text-lg w-full lg:w-1/2 mx-auto mb-2">
            Müşterilerimden ve iş ortaklarımdan geri bildirimler.
          </div>
          <div className="mt-16">
            <Testimonial />
          </div>
        </div>
      </div>
      <div className="pt-10 lg:pt-24 pb-10 lg:pb-24 bg-white" id="contact">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-8 lg:p-20 bg-gray-50 rounded-2xl shadow-[0_59px_124px_0_rgba(0,0,0,0.08)] relative z-10 -mb-12 border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-32 items-center">
            <div>
              <h3 className="text-gray-900 text-4xl font-semibold">
                Merhaba deyin
              </h3>
              <div className="text-gray-400 text-lg mt-4 mb-4 lg:mb-0">
                Sorularınız, fikirleriniz veya sadece selamlaşmak için yazabilirsiniz.
                Mesajlarınıza kısa sürede dönmeye çalışıyorum.
              </div>
              <p className="text-sm text-primary-600 font-medium mt-2 mb-4">
                Genellikle 24–48 saat içinde yanıt veriyorum.
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 group hover:bg-white rounded-lg hover:border-primary-500 hover:shadow-[0_12px_64px_0_rgba(28,25,25,0.12)] p-6 lg:w-4/5">
                  <div className="flex justify-center items-center p-3 rounded group-hover:bg-primary-500 bg-primary-100">
                    <i className="pi pi-map-marker group-hover:text-white text-primary-500 text-2xl leading-none"></i>
                  </div>
                  <div>
                    <div className="text-gray-700 text-sm">Konum:</div>
                    <Link
                      href="https://www.google.com/maps/search/?api=1&query=İstanbul+Türkiye"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 font-medium mt-1 hover:text-primary-600 hover:underline no-underline block"
                    >
                      İstanbul, Türkiye
                    </Link>
                    <span className="text-xs text-gray-500"> — Haritada aç</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 group hover:bg-white rounded-lg hover:border-primary-500 hover:shadow-[0_12px_64px_0_rgba(28,25,25,0.12)] p-6 lg:w-4/5">
                  <div className="flex justify-center items-center p-3 rounded group-hover:bg-primary-500 bg-primary-100">
                    <i className="pi pi-at group-hover:text-white text-primary-500 text-2xl leading-none"></i>
                  </div>
                  <div>
                    <div className="text-gray-700 text-sm">E-posta:</div>
                    <Link
                      href="mailto:atakan2100120@gmail.com"
                      className="text-gray-900 font-medium mt-1 hover:text-primary-600 hover:underline no-underline block"
                    >
                      atakan2100120@gmail.com
                    </Link>
                  </div>
                </div>
                {auth && (
                  <>
                    <div className="flex items-center gap-3 group hover:bg-white rounded-lg hover:border-primary-500 hover:shadow-[0_12px_64px_0_rgba(28,25,25,0.12)] p-6 lg:w-4/5">
                      <div className="flex justify-center items-center p-3 rounded group-hover:bg-primary-500 bg-primary-100">
                        <i className="pi pi-phone group-hover:text-white text-primary-500 text-2xl leading-none"></i>
                      </div>
                      <div className="min-w-0">
                        <div className="text-gray-700 text-sm">Telefon:</div>
                        <Link
                          href="tel:+905380803023"
                          className="text-gray-900 font-medium mt-1 hover:text-primary-600 hover:underline no-underline block"
                        >
                          +90 538 080 30 23
                        </Link>
                      </div>
                    </div>
                    <Link
                      href="https://wa.me/905380803023"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 group hover:bg-white rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-[0_12px_64px_0_rgba(28,25,25,0.12)] p-6 lg:w-4/5 no-underline"
                    >
                      <div className="flex justify-center items-center p-3 rounded bg-green-100 group-hover:bg-green-500">
                        <i className="pi pi-whatsapp group-hover:text-white text-green-600 text-2xl leading-none"></i>
                      </div>
                      <div className="min-w-0">
                        <div className="text-gray-700 text-sm">Hızlı iletişim:</div>
                        <span className="text-gray-900 font-medium mt-1 block">WhatsApp ile yaz</span>
                      </div>
                    </Link>
                  </>
                )}
              </div>
              <div className="flex gap-1 mt-8">
                <Link
                  href="https://www.linkedin.com/in/atakan-g%C3%BClo%C4%9Flu-6613331b8/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center p-3 no-underline rounded group hover:bg-primary-500"
                  title="LinkedIn"
                >
                  <i className="pi pi-linkedin group-hover:text-white text-primary-500 text-2xl leading-none"></i>
                </Link>
                <Link
                  href="https://github.com/atakanguloglu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center p-3 no-underline rounded group hover:bg-primary-500"
                  title="GitHub"
                >
                  <i className="pi pi-github group-hover:text-white text-primary-500 text-2xl leading-none"></i>
                </Link>
                <Link
                  href="https://www.instagram.com/atakanguloglu_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center p-3 no-underline rounded group hover:bg-primary-500"
                  title="Instagram"
                >
                  <i className="pi pi-instagram group-hover:text-white text-primary-500  text-2xl leading-none"></i>
                </Link>
              </div>
            </div>
            <div className="pl-0">
              <div className="text-gray-400 text-lg">
                Formu doldurarak bana ulaşabilirsin. En kısa sürede dönüş yapacağım.
              </div>
              <p className="text-sm text-gray-500 mt-2">
                E-posta ve mesajlarınız yalnızca iletişim için kullanılır, üçüncü taraflarla paylaşılmaz.
              </p>
              <div className="mt-10">
                <ContactForm />
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
