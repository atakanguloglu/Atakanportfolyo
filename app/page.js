import Image from "next/image";
import Link from "next/link";

import { cookies } from "next/headers";
import Blog from "./_components/Blogs";
import Clients from "./_components/Clients";
import Testimonial from "./_components/Testimonial";
import ContactForm from "./_components/ContactForm";
import Portfolio from "./_components/Portfolio";
import TechLogosBackground from "./_components/TechLogosBackground";
import { getAuthFromRequest } from "@/app/lib/auth-request";
import { getSiteProfileImageUrl } from "@/app/lib/site-profile";
import { getMessages, t, LOCALE_COOKIE, DEFAULT_LOCALE } from "@/app/lib/i18n";

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
  const profileImage = await getSiteProfileImageUrl();
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value || DEFAULT_LOCALE;
  const messages = getMessages(locale);
  const T = (key) => t(messages, key);

  return (
    <>
      <div
        className="relative overflow-hidden pt-6 sm:pt-8 lg:pt-32 bg-gradient-to-bl from-primary-50/80 via-white to-primary-100/80 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"
        id="home"
      >
        <TechLogosBackground />
        <div className="container mx-auto px-4 sm:px-6 mb-32 relative">
          <div className="flex flex-col lg:flex-row lg:gap-x-32">
            <div className="lg:w-3/5 grid content-between">
              <div className="lg:mb-32">
                <h1 className="text-gray-900 dark:text-white font-semibold text-5xl lg:text-7xl">
                  {T("home.hero.greeting")}
                  <br />
                  {T("home.hero.name")}
                </h1>
                <div className="text-lg text-gray-600 dark:text-gray-300 my-6">
                  {T("home.hero.intro")}
                </div>
                <Link
                  href="#contact"
                  className="p-button bg-primary-500 hover:bg-primary-600 border-primary-500 hover:border-primary-600 font-bold no-underline"
                >
                  {T("home.hero.cta")}
                </Link>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 my-4 lg:my-0">
                <div className="flex justify-center flex-col items-center gap-y-2 p-6 bg-primary-100 dark:bg-gray-800 rounded-xl">
                  <div className="font-bold text-2xl text-gray-900 dark:text-white">5+ Y.</div>
                  <div className="text-gray-700 dark:text-gray-300 font-medium">{T("home.stats.experience")}</div>
                </div>
                <div className="flex justify-center flex-col items-center gap-y-2 p-6 bg-primary-100 dark:bg-gray-800 rounded-xl">
                  <div className="font-bold text-2xl text-gray-900 dark:text-white">30+</div>
                  <div className="text-gray-700 dark:text-gray-300 font-medium">{T("home.stats.projects")}</div>
                </div>
                <div className="flex justify-center flex-col items-center gap-y-2 p-6 bg-primary-100 dark:bg-gray-800 rounded-xl">
                  <div className="font-bold text-2xl text-gray-900 dark:text-white">20+</div>
                  <div className="text-gray-700 dark:text-gray-300 font-medium">{T("home.stats.clients")}</div>
                </div>
              </div>
            </div>
            {/* Masaüstünde hero'da profil; mobilde sadece Hakkımda'daki (linkli) görünsün */}
            <div className="hidden lg:flex lg:w-2/5 bg-white dark:bg-gray-800 rounded-2xl justify-center items-center">
              <div className="relative aspect-square text-center max-h-[460px]">
                <Image
                  src={profileImage}
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
          className="container mx-auto px-4 sm:px-6 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_36px_105px_0_rgba(43,56,76,0.10)] dark:shadow-none dark:border dark:border-gray-700 relative -mb-8 sm:-mb-12 lg:-mb-16"
          id="about"
        >
          <div className="flex items-center flex-col lg:flex-row lg:gap-x-32 p-4 lg:p-28">
            <div className="lg:w-2/5 flex justify-center items-center bg-[#F0F1F3] dark:bg-gray-700">
              <div className="relative aspect-square flex flex-col justify-center max-h-[460px]">
                <Image
                  src={profileImage}
                  alt="Atakan Güloğlu - Portfolyo"
                  width={460}
                  height={460}
                  className="object-contain h-full w-auto max-w-full"
                  priority
                />
                <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-9 flex gap-1 bg-white dark:bg-gray-800 w-auto mx-auto p-3 rounded shadow-[0_12px_64px_0_rgba(28,25,25,0.12)] dark:border dark:border-gray-600">
                  <Link
                    href="#"
                    className="flex justify-center items-center p-3 no-underline rounded group hover:bg-primary-500"
                  >
                    <i className="pi pi-facebook group-hover:text-white text-primary-500 dark:text-primary-200 text-2xl leading-none"></i>
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/atakan-g%C3%BClo%C4%9Flu-6613331b8/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center p-3 no-underline rounded group hover:bg-primary-500 "
                    title="LinkedIn"
                  >
                    <i className="pi pi-linkedin group-hover:text-white text-primary-500 dark:text-primary-200 text-2xl leading-none"></i>
                  </Link>
                  <Link
                    href="https://www.instagram.com/atakanguloglu_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center p-3 no-underline rounded group hover:bg-primary-500 "
                    title="Instagram"
                  >
                    <i className="pi pi-instagram group-hover:text-white text-primary-500 dark:text-primary-200 text-2xl leading-none"></i>
                  </Link>
                  <Link
                    href="https://github.com/atakanguloglu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center p-3 no-underline rounded group hover:bg-primary-500 "
                    title="GitHub"
                  >
                    <i className="pi pi-github group-hover:text-white text-primary-500 dark:text-primary-200 text-2xl leading-none"></i>
                  </Link>
                  <Link
                    href="#"
                    className="flex justify-center items-center p-3 no-underline rounded group hover:bg-primary-500 "
                  >
                    <i className="pi pi-pinterest group-hover:text-white text-primary-500 dark:text-primary-200 text-2xl leading-none"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="lg:w-3/5 grid mt-16 lg:mt-0">
              <div>
                <h1 className="text-gray-900 dark:text-white font-semibold text-4xl">
                  {T("home.about.title")}
                </h1>
                <div className="text-lg text-gray-600 dark:text-gray-300 my-6">
                  <p className="mb-3">
                    {T("home.about.paragraph1")}
                  </p>
                  <p>
                    {T("home.about.paragraph2")}
                  </p>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <Link
                    href="#portfolio"
                    className="p-button bg-primary-500 hover:bg-primary-600 border-primary-500 hover:border-primary-600 font-bold no-underline"
                  >
                    {T("home.about.myProjects")}
                  </Link>
                  <Link
                    href="/Atakan_Guloglu_ATS_CV.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Atakan_Guloglu_ATS_CV.pdf"
                    className="p-button p-button-outlined text-primary-500 font-bold no-underline dark:!border-primary-400 dark:!text-primary-200 dark:hover:!bg-primary-500/20 dark:hover:!text-primary-100"
                  >
                    <ArrowDownTrayIcon className="size-6 text-primary-500 dark:text-primary-200 mr-3" />
                    {T("home.about.downloadCv")}
                  </Link>
                </div>
                <div className="mt-8 pt-6 pb-6 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{T("home.about.techLabel")}</p>
                  <div className="flex flex-wrap gap-2">
                    {["C#", ".NET", "ABP Framework", "ASP.NET Core", "Python", "Pandas", "OpenCV", "Görüntü İşleme", "Yapay Zeka", "scikit-learn", "TensorFlow", "React", "Next.js", "Node.js", "PostgreSQL", "Docker", "RabbitMQ", "SignalR", "API Entegrasyonu"].map((tech) => (
                      <span key={tech} className="inline-block px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
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
      <div className="bg-gray-50 dark:bg-gray-800/50 pb-10 lg:pb-36 pt-24 lg:pt-52" id="process">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center flex-col lg:flex-row lg:gap-x-32">
            <div className="lg:w-1/2">
              <div className="">
                <h2 className="text-gray-900 dark:text-white font-semibold text-4xl lg:text-5xl mb-6">
                  {T("home.process.title")}
                </h2>
                <div className="text-gray-500 dark:text-gray-400 text-lg">
                  <p className="mb-4">
                    {T("home.process.intro1")}
                  </p>
                  <p>
                    {T("home.process.intro2")}
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/2">
                <div className="flex flex-col gap-6 mt-8 lg:-mt-6">
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-xl group hover:shadow-[32px_32px_124px_0_rgba(43,56,76,0.10)] dark:border dark:border-gray-700">
                    <div className="w-16 h-16 p-5 rounded-md bg-primary-100 dark:bg-gray-700 group-hover:bg-primary-500 mb-8 mx-auto lg:mx-0 flex items-center justify-center">
                      <NewspaperIcon className="size-6 text-primary-500 dark:text-primary-200 group-hover:text-white" />
                    </div>
                    <div className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {T("home.process.step1")}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {T("home.process.step1Desc")}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-xl group hover:shadow-[32px_32px_124px_0_rgba(43,56,76,0.10)] dark:border dark:border-gray-700">
                    <div className="w-16 h-16 p-5 rounded-md bg-primary-100 dark:bg-gray-700 group-hover:bg-primary-500 mb-8 mx-auto lg:mx-0 flex items-center justify-center">
                      <CodeBracketSquareIcon className="size-6 text-primary-500 dark:text-primary-200 group-hover:text-white" />
                    </div>
                    <div className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {T("home.process.step2")}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {T("home.process.step2Desc")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="flex flex-col gap-6">
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-xl group hover:shadow-[32px_32px_124px_0_rgba(43,56,76,0.10)] dark:border dark:border-gray-700">
                    <div className="w-16 h-16 p-5 rounded-md bg-primary-100 dark:bg-gray-700 group-hover:bg-primary-500 mb-8 mx-auto lg:mx-0 flex items-center justify-center">
                      <PencilSquareIcon className="size-6 text-primary-500 dark:text-primary-200 group-hover:text-white" />
                    </div>
                    <div className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {T("home.process.step3")}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {T("home.process.step3Desc")}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-xl group hover:shadow-[32px_32px_124px_0_rgba(43,56,76,0.10)] dark:border dark:border-gray-700">
                    <div className="w-16 h-16 p-5 rounded-md bg-primary-100 dark:bg-gray-700 group-hover:bg-primary-500 mb-8 mx-auto lg:mx-0 flex items-center justify-center">
                      <PresentationChartLineIcon className="size-6 text-primary-500 dark:text-primary-200 group-hover:text-white" />
                    </div>
                    <div className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {T("home.process.step4")}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {T("home.process.step4Desc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-10 lg:py-24 bg-white dark:bg-gray-900" id="portfolio">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-gray-900 dark:text-white font-semibold text-4xl lg:text-5xl mb-6 text-center">
            {T("home.portfolio.title")}
          </h2>
          <div className="text-gray-400 dark:text-gray-400 text-center text-lg lg:w-1/2 mx-auto">
            <p>
              {T("home.portfolio.subtitle")}
            </p>
          </div>
          <Portfolio />
          <div className="mt-12 text-center">
            <Link
              href="/projects"
              className="p-button bg-primary-500 hover:bg-primary-600 border-primary-500 hover:border-primary-600 font-bold no-underline"
            >
              {T("home.portfolio.moreProjects")}
            </Link>
          </div>
        </div>
      </div>

      <div className="py-10 lg:py-24 bg-navy-900">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-white font-semibold text-4xl lg:text-5xl mb-6 text-center w-full lg:w-1/2 mx-auto">
            {T("home.cta.title")}
          </h2>
          <div className="text-primary-200 text-center text-lg w-full lg:w-1/2 mx-auto">
            <p>
              {T("home.cta.subtitle")}
            </p>
          </div>
          <div className="mt-12 text-center">
            <Link
              href="#contact"
              className="p-button bg-primary-500 hover:bg-primary-600 border-primary-500 hover:border-primary-600 font-bold no-underline"
            >
              <span className="inline-block mr-3">{T("home.cta.button")}</span>
              <ArrowRightIcon className="size-6 text-white" />
            </Link>
          </div>
        </div>
      </div>
      <div
        className="relative overflow-hidden py-10 lg:py-24 bg-gradient-to-bl from-primary-50/80 via-white to-primary-100/80 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"
        id="blogs"
      >
        <TechLogosBackground />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <h2 className="text-gray-900 dark:text-white font-semibold text-4xl lg:text-5xl mb-6 text-center">
            {T("home.blogs.title")}
          </h2>
          <div className="text-gray-400 dark:text-gray-400 text-center text-lg w-full lg:w-1/2 mx-auto">
            {T("home.blogs.subtitle")}
          </div>
          <div className="mt-16">
            <Blog />
          </div>
        </div>
      </div>
      <div className="py-10 lg:py-24 bg-gray-50 dark:bg-gray-800/50" id="services">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-32 items-center">
            <div>
              <h3 className="text-gray-950 dark:text-white text-4xl lg:text-5xl font-semibold">
                {T("home.services.title")}
              </h3>
              <div className="text-gray-400 dark:text-gray-400 text-lg mt-6">
                {T("home.services.intro1")}
              </div>
              <div className="text-gray-400 text-lg mt-4">
                {T("home.services.intro2")}
              </div>

              <Link
                href="#contact"
                className="p-button bg-primary-500 hover:bg-primary-600 border-primary-500 hover:border-primary-600 font-bold no-underline mt-12"
              >
                {T("home.services.cta")}
              </Link>
            </div>
              <div className="flex flex-col gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-md border-0 border-white dark:border-gray-700 hover:border-primary-500 hover:shadow-[0_32px_96px_0_rgba(28,25,25,0.16)] dark:border-l-4 border-l-4 border-solid p-8">
                <h3 className="text-gray-900 dark:text-white font-semibold text-lg">{T("home.services.web")}</h3>
                <div className="text-gray-700 dark:text-gray-300 mt-4">
                  {T("home.services.webDesc")}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-md border-0 border-white dark:border-gray-700 hover:border-primary-500 hover:shadow-[0_32px_96px_0_rgba(28,25,25,0.16)] dark:border-l-4 border-l-4 border-solid p-8">
                <h3 className="text-gray-900 dark:text-white font-semibold text-lg">{T("home.services.automation")}</h3>
                <div className="text-gray-700 dark:text-gray-300 mt-4">
                  {T("home.services.automationDesc")}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-md border-0 border-white dark:border-gray-700 hover:border-primary-500 hover:shadow-[0_32px_96px_0_rgba(28,25,25,0.16)] dark:border-l-4 border-l-4 border-solid p-8">
                <h3 className="text-gray-900 dark:text-white font-semibold text-lg">{T("home.services.ai")}</h3>
                <div className="text-gray-700 dark:text-gray-300 mt-4">
                  {T("home.services.aiDesc")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-10 lg:pt-24 pb-10 lg:pb-12 bg-gray-50 dark:bg-gray-800/50 overflow-x-hidden">
        <div className="container mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 dark:text-white font-semibold text-4xl lg:text-5xl mb-6 text-center">
            {T("home.clients.title")}
          </h2>
          <div className="text-gray-600 dark:text-gray-400 text-center text-lg w-full lg:w-1/2 mx-auto">
            {T("home.clients.subtitle")}
          </div>
          <div className="mt-8 w-full overflow-x-hidden">
            <Clients />
          </div>
        </div>
      </div>
      <div className="lg:pt-12 pb-10 lg:pb-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-gray-900 dark:text-white font-semibold text-4xl lg:text-5xl mb-6 text-center">
            {T("home.testimonials.title")}
          </h2>
          <div className="text-gray-600 dark:text-gray-400 text-center text-lg w-full lg:w-1/2 mx-auto mb-2">
            {T("home.testimonials.subtitle")}
          </div>
          <div className="mt-16">
            <Testimonial />
          </div>
        </div>
      </div>
      <div className="pt-10 lg:pt-24 pb-10 lg:pb-24 bg-white dark:bg-gray-900/80 dark:backdrop-blur-sm" id="contact">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-8 lg:p-20 bg-gray-50 dark:bg-gray-800/70 dark:backdrop-blur-xl rounded-2xl shadow-[0_59px_124px_0_rgba(0,0,0,0.08)] dark:shadow-none dark:border dark:border-gray-600/80 relative z-10 -mb-12 border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-32 items-center">
            <div>
              <h3 className="text-gray-900 dark:text-white text-4xl font-semibold">
                {T("home.contact.title")}
              </h3>
              <div className="text-gray-400 dark:text-gray-400 text-lg mt-4 mb-4 lg:mb-0">
                {T("home.contact.subtitle")}
              </div>
              <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mt-2 mb-4">
                {T("home.contact.responseTime")}
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 group hover:bg-white dark:hover:bg-gray-700 rounded-lg hover:border-primary-500 hover:shadow-[0_12px_64px_0_rgba(28,25,25,0.12)] p-6 lg:w-4/5">
                  <div className="flex justify-center items-center p-3 rounded group-hover:bg-primary-500 bg-primary-100 dark:bg-gray-700">
                    <i className="pi pi-map-marker group-hover:text-white text-primary-500 dark:text-primary-200 text-2xl leading-none"></i>
                  </div>
                  <div>
                    <div className="text-gray-700 dark:text-gray-300 text-sm">{T("home.contact.location")}</div>
                    <Link
                      href="https://www.google.com/maps/search/?api=1&query=İstanbul+Türkiye"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 dark:text-white font-medium mt-1 hover:text-primary-600 hover:underline no-underline block"
                    >
                      {T("common.istanbul")}
                    </Link>
                    <span className="text-xs text-gray-500 dark:text-gray-400"> — {T("home.contact.locationMap")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 group hover:bg-white dark:hover:bg-gray-700 rounded-lg hover:border-primary-500 hover:shadow-[0_12px_64px_0_rgba(28,25,25,0.12)] p-6 lg:w-4/5">
                  <div className="flex justify-center items-center p-3 rounded group-hover:bg-primary-500 bg-primary-100 dark:bg-gray-700">
                    <i className="pi pi-at group-hover:text-white text-primary-500 dark:text-primary-200 text-2xl leading-none"></i>
                  </div>
                  <div>
                    <div className="text-gray-700 dark:text-gray-300 text-sm">{T("home.contact.email")}</div>
                    <Link
                      href="mailto:atakan2100120@gmail.com"
                      className="text-gray-900 dark:text-white font-medium mt-1 hover:text-primary-600 hover:underline no-underline block"
                    >
                      atakan2100120@gmail.com
                    </Link>
                  </div>
                </div>
                {auth && (
                  <>
                    <div className="flex items-center gap-3 group hover:bg-white dark:hover:bg-gray-700 rounded-lg hover:border-primary-500 hover:shadow-[0_12px_64px_0_rgba(28,25,25,0.12)] p-6 lg:w-4/5">
                      <div className="flex justify-center items-center p-3 rounded group-hover:bg-primary-500 bg-primary-100 dark:bg-gray-700">
                        <i className="pi pi-phone group-hover:text-white text-primary-500 dark:text-primary-200 text-2xl leading-none"></i>
                      </div>
                      <div className="min-w-0">
                        <div className="text-gray-700 dark:text-gray-300 text-sm">{T("home.contact.phone")}</div>
                        <Link
                          href="tel:+905380803023"
                          className="text-gray-900 dark:text-white font-medium mt-1 hover:text-primary-600 hover:underline no-underline block"
                        >
                          +90 538 080 30 23
                        </Link>
                      </div>
                    </div>
                    <Link
                      href="https://wa.me/905380803023"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 group hover:bg-white dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-green-500 hover:shadow-[0_12px_64px_0_rgba(28,25,25,0.12)] p-6 lg:w-4/5 no-underline"
                    >
                      <div className="flex justify-center items-center p-3 rounded bg-green-100 dark:bg-gray-700 group-hover:bg-green-500">
                        <i className="pi pi-whatsapp group-hover:text-white text-green-600 dark:text-green-400 text-2xl leading-none"></i>
                      </div>
                      <div className="min-w-0">
                        <div className="text-gray-700 dark:text-gray-300 text-sm">{T("home.contact.whatsapp")}</div>
                        <span className="text-gray-900 dark:text-white font-medium mt-1 block">{T("home.contact.whatsappLabel")}</span>
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
                  <i className="pi pi-linkedin group-hover:text-white text-primary-500 dark:text-primary-200 text-2xl leading-none"></i>
                </Link>
                <Link
                  href="https://github.com/atakanguloglu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center p-3 no-underline rounded group hover:bg-primary-500"
                  title="GitHub"
                >
                  <i className="pi pi-github group-hover:text-white text-primary-500 dark:text-primary-200 text-2xl leading-none"></i>
                </Link>
                <Link
                  href="https://www.instagram.com/atakanguloglu_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center p-3 no-underline rounded group hover:bg-primary-500"
                  title="Instagram"
                >
                  <i className="pi pi-instagram group-hover:text-white text-primary-500 dark:text-primary-200 text-2xl leading-none"></i>
                </Link>
              </div>
            </div>
            <div className="pl-0">
              <div className="text-gray-400 dark:text-gray-400 text-lg">
                {T("home.contact.formIntro")}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {T("home.contact.formPrivacy")}
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
