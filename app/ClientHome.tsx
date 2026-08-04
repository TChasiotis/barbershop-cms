"use client"; //n

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  PanInfo,
} from "framer-motion";
import {
  MapPin,
  Clock,
  Phone,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Star,
  Globe,
} from "lucide-react";

// --- CUSTOM INSTAGRAM ICON ---
const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

export default function ClientHome({
  services,
  products,
  gallery = [],
}: {
  services: any[];
  products: any[];
  gallery?: any[];
}) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<"el" | "en">("en");

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // --- ΛΕΞΙΚΟ ΣΤΑΤΙΚΩΝ ΚΕΙΜΕΝΩΝ (Dummy Data) ---
  const t = {
    el: {
      nav: {
        about: "Σχετικά",
        gallery: "Η Δουλειά Μας",
        services: "Υπηρεσίες",
        products: "Προϊόντα",
        reviews: "Κριτικές",
        contact: "Επικοινωνία",
        map: "Τοποθεσία",
        book: "Κράτηση",
      },
      hero: { address: "Λεωφόρος Τεχνολογίας 12, Αθήνα" },
      about: {
        title: "Η Φιλοσοφια Μας",
        text: "Στο Urban Fade, επαναπροσδιορίζουμε την κλασική περιποίηση ανδρών. Με πάθος για τη λεπτομέρεια και προσήλωση στην αισθητική, δημιουργούμε το τέλειο περιβάλλον για τον σύγχρονο άνδρα. Δεν είναι απλά ένα κούρεμα, είναι μια εμπειρία.",
      },
      gallery: { title: "Η Δουλειά Μας" },
      services: { title: "Οι Υπηρεσίες Μας" },
      products: {
        title: "Premium Προϊόντα",
        sub: "Επαγγελματική περιποίηση στο σπίτι.",
      },
      reviews: {
        title: "Τι λένε οι πελάτες μας",
      },
      contact: {
        title: "Επικοινωνία & Ωράριο",
        address1: "Λεωφόρος Τεχνολογίας 12",
        address2: "Αθήνα, 10431",
        days: "Δευ - Παρ",
        sat: "Σάββατο",
        sun: "Κυριακή",
        closed: "Κλειστά",
      },
    },
    en: {
      nav: {
        about: "About",
        gallery: "Our Work",
        services: "Services",
        products: "Products",
        reviews: "Reviews",
        contact: "Contact",
        map: "Location",
        book: "Book Now",
      },
      hero: { address: "12 Tech Avenue, Athens" },
      about: {
        title: "Our Philosophy",
        text: "At Urban Fade, we redefine classic men's grooming. With a passion for detail and a commitment to aesthetics, we create the perfect environment for the modern man. It's not just a haircut, it's an experience.",
      },
      gallery: { title: "Our Work" },
      services: { title: "Our Services" },
      products: {
        title: "Premium Products",
        sub: "Professional care at home.",
      },
      reviews: {
        title: "Client Testimonials",
      },
      contact: {
        title: "Contact & Hours",
        address1: "12 Tech Avenue",
        address2: "Athens, 10431",
        days: "Mon - Fri",
        sat: "Saturday",
        sun: "Sunday",
        closed: "Closed",
      },
    },
  };

  const currentT = t[lang];

  // Χρήση των τοπικών screenshots για την Gallery
  const galleryImages =
    gallery && gallery.length > 0
      ? gallery.map((img: any) => img.url)
      : [
          "/scshots/scshot1.jpg",
          "/scshots/scshot2.jpg",
          "/scshots/scshot3.jpg",
          "/scshots/scshot4.jpg",
          "/scshots/scshot5.jpg",
        ];

  // Dummy Reviews
  const reviews = [
    {
      name: "Michael Chen",
      text: {
        el: "Η καλύτερη εμπειρία που είχα ποτέ. Η προσοχή στη λεπτομέρεια είναι απίστευτη και ο χώρος αποπνέει ηρεμία. Το συστήνω ανεπιφύλακτα.",
        en: "The best grooming experience I've ever had. The attention to detail is incredible and the space is so relaxing. Highly recommended.",
      },
    },
    {
      name: "David Ross",
      text: {
        el: "Επιτέλους ένα κουρείο που καταλαβαίνει ακριβώς τι θέλω. Εξαιρετικοί επαγγελματίες και τρομερή ατμόσφαιρα.",
        en: "Finally a barbershop that understands exactly what I want. Excellent professionals and a great atmosphere.",
      },
    },
    {
      name: "Alex Papadopoulos",
      text: {
        el: "Άψογη εξυπηρέτηση και το καλύτερο fade που μου έχουν κάνει. Τα προϊόντα τους είναι επίσης κορυφαία.",
        en: "Flawless service and the best fade I've ever gotten. Their grooming products are also top-notch.",
      },
    },
  ];

  const nextImage = () =>
    setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () =>
    setGalleryIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length,
    );

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.x < -50) nextImage();
    else if (info.offset.x > 50) prevImage();
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 font-sans selection:bg-zinc-900 selection:text-white">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-zinc-900 origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* BACKGROUND IMAGES */}
      <div className="fixed top-0 left-0 w-full h-screen z-0 bg-zinc-900">
        {/* Desktop Hero Image */}
        <img
          src="/hero/hero_desktop.jpg"
          alt="Hero Background Desktop"
          className="hidden md:block w-full h-full object-cover object-center opacity-60"
        />
        {/* Mobile Hero Image */}
        <img
          src="/hero/hero_mobile.jpg"
          alt="Hero Background Mobile"
          className="block md:hidden w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-zinc-50/90"></div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-[70]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-64 bg-white z-[80] shadow-2xl flex flex-col px-6 py-8"
            >
              <div className="flex justify-between items-start mb-8 border-b border-zinc-100 pb-5">
                <div className="flex flex-col">
                  {/* Πλαϊνό Μενού Λογότυπο */}
                  <img
                    src="/logo/logo_removebg.png"
                    alt="Urban Fade Logo"
                    className="h-10 w-auto object-contain mb-3"
                  />
                  <span className="text-xl font-black tracking-tighter text-zinc-950">
                    URBAN FADE
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mt-0.5">
                    Premium Barbershop
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-zinc-400 hover:text-zinc-900 p-1 -mr-2 transition-colors mt-2"
                >
                  <X size={28} />
                </button>
              </div>

              <nav className="flex flex-col gap-6 text-lg font-medium text-zinc-700 flex-1">
                <a
                  href="#about"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-zinc-950 transition-colors"
                >
                  {currentT.nav.about}
                </a>
                <a
                  href="#gallery"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-zinc-950 transition-colors"
                >
                  {currentT.nav.gallery}
                </a>
                <a
                  href="#services"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-zinc-950 transition-colors"
                >
                  {currentT.nav.services}
                </a>
                <a
                  href="#products"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-zinc-950 transition-colors"
                >
                  {currentT.nav.products}
                </a>
                <a
                  href="#reviews"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-zinc-950 transition-colors"
                >
                  {currentT.nav.reviews}
                </a>
                <a
                  href="#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-zinc-950 transition-colors"
                >
                  {currentT.nav.contact}
                </a>
                <a
                  href="#map"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-zinc-950 transition-colors"
                >
                  {currentT.nav.map}
                </a>
              </nav>

              <div className="border-t border-zinc-100 pt-6 mt-auto flex justify-between items-center">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
                  Language
                </span>
                <button
                  onClick={() => setLang(lang === "el" ? "en" : "el")}
                  className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 px-4 py-2 rounded-full transition-colors"
                >
                  <Globe size={18} className="text-zinc-500" />
                  <span className="font-bold text-sm tracking-wider">
                    {lang === "el" ? "EN" : "EL"}
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-zinc-100/50"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between relative">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 -ml-2 text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
          >
            <Menu size={28} />
          </button>

          {/* Λογότυπο Κεντρικού Navbar */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <img
              src="/logo/logo_removebg.png"
              alt="Urban Fade Logo"
              className="h-8 md:h-12 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-3 z-10">
            <button
              onClick={() => setLang(lang === "el" ? "en" : "el")}
              className="hidden sm:flex items-center gap-1.5 p-2 text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors text-sm font-semibold uppercase tracking-wider"
            >
              <Globe size={18} />
              <span>{lang === "el" ? "EN" : "EL"}</span>
            </button>
            <a
              href={`/booking?lang=${lang}`}
              className="bg-zinc-950 text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              {currentT.nav.book}
            </a>
          </div>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <section className="relative h-[85vh] md:h-screen flex items-center justify-center overflow-hidden pt-20 z-10">
        <div className="z-10 text-center px-6 py-8 md:py-12 md:px-16 mt-16 md:mt-0 bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-xl mx-4 max-w-4xl">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-8xl font-extrabold tracking-tighter text-zinc-900 mb-6 drop-shadow-sm uppercase"
          >
            URBAN <br className="md:hidden" /> FADE
          </motion.h1>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 text-zinc-800 font-bold flex-wrap"
          >
            <span className="flex items-center gap-2">
              <MapPin size={18} /> {currentT.hero.address}
            </span>
            <span className="hidden sm:block text-zinc-400">|</span>
            <span className="flex items-center gap-2">
              <Phone size={18} /> +30 210 1234567
            </span>
            <span className="hidden sm:block text-zinc-400">|</span>
            <span className="flex items-center gap-2 text-zinc-800">
              <InstagramIcon size={18} /> @urbanfade_official
            </span>
          </motion.div>
        </div>
      </section>

      {/* ABOUT US */}
      <section
        id="about"
        className="py-24 bg-zinc-50 relative z-20 shadow-[0_-20px_30px_-15px_rgba(0,0,0,0.05)] scroll-mt-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto px-6 text-center"
        >
          <h2 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-8">
            {currentT.about.title}
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-zinc-700 font-medium">
            {currentT.about.text}
          </p>
        </motion.div>
      </section>

      {/* 3D GALLERY */}
      <section
        id="gallery"
        className="py-24 bg-zinc-100 overflow-hidden relative z-20 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
            {currentT.gallery.title}
          </h2>
        </div>
        <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center max-w-5xl mx-auto px-6 cursor-grab active:cursor-grabbing">
          <AnimatePresence mode="popLayout">
            {galleryImages.map((img, index) => {
              const isActive = index === galleryIndex;
              const isPrev =
                index ===
                (galleryIndex - 1 + galleryImages.length) %
                  galleryImages.length;
              const isNext =
                index === (galleryIndex + 1) % galleryImages.length;
              if (!isActive && !isPrev && !isNext) return null;
              return (
                <motion.div
                  key={index}
                  drag={isActive ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: isActive ? 1 : 0.4,
                    scale: isActive ? 1 : 0.8,
                    x: isActive ? "0%" : isPrev ? "-60%" : "60%",
                    zIndex: isActive ? 30 : 20,
                    rotateY: isActive ? 0 : isPrev ? 15 : -15,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute w-[75vw] md:w-[400px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
                  style={{ perspective: 1000 }}
                >
                  <img
                    src={img}
                    alt={`Gallery ${index}`}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div className="hidden md:flex absolute bottom-[-3rem] gap-6 z-40">
            <button
              onClick={prevImage}
              className="p-3 rounded-full bg-white shadow-md hover:bg-zinc-100 transition"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="p-3 rounded-full bg-white shadow-md hover:bg-zinc-100 transition"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="py-24 bg-white relative z-20 scroll-mt-24"
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-16 text-center">
            {currentT.services.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
            {services && services.length > 0 ? (
              services.map((service, index) => {
                const sName =
                  lang === "el" ? service.name : service.nameEn || service.name;
                const sPrice =
                  lang === "el"
                    ? service.price
                    : service.priceEn || service.price;

                const formattedDurationEl = service.duration
                  ?.replace("λ.", "min")
                  ?.replace("ώ.", "h");
                const sDuration =
                  lang === "el"
                    ? formattedDurationEl
                    : service.durationEn || formattedDurationEl;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    className="flex flex-col border-b border-zinc-100 pb-4 group"
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                        {sName}
                      </h3>
                      <span className="text-lg font-bold text-zinc-900">
                        {sPrice}
                      </span>
                    </div>
                    <span className="text-sm text-zinc-500 flex items-center gap-1">
                      <Clock size={14} /> {sDuration}
                    </span>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-2 text-center text-zinc-400 py-10">
                No services added yet. Go to Admin Panel to add services.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PRODUCTS CAROUSEL */}
      <section
        id="products"
        className="py-24 bg-zinc-50 relative z-20 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              {currentT.products.title}
            </h2>
            <p className="text-zinc-500 mt-2">{currentT.products.sub}</p>
          </div>

          {products && products.length > 0 ? (
            <div
              className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {products.map((product, index) => {
                const pDesc =
                  lang === "el" ? product.desc : product.descEn || product.desc;

                return (
                  <div
                    key={index}
                    className="flex-none w-[75vw] sm:w-[40vw] md:w-[280px] snap-center bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex flex-col items-center text-center"
                  >
                    <div className="w-full h-56 bg-zinc-50 rounded-xl mb-6 p-4 flex items-center justify-center overflow-hidden">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-contain drop-shadow-md"
                      />
                    </div>
                    <h3 className="font-semibold text-zinc-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-zinc-500 mb-4 flex-grow">
                      {pDesc}
                    </p>
                    <span className="text-lg font-bold text-zinc-900">
                      {product.price}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-zinc-400 py-10">
              No products added yet. Go to Admin Panel to add products.
            </div>
          )}
        </div>
      </section>

      {/* REVIEWS */}
      <section
        id="reviews"
        className="py-24 bg-zinc-900 text-zinc-50 relative z-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="text-yellow-500 fill-yellow-500"
                  size={24}
                />
              ))}
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              {currentT.reviews.title}
            </h2>
          </div>
          <div
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {reviews.map((review, index) => (
              <div
                key={index}
                className="flex-none w-[85vw] md:w-[350px] snap-center bg-zinc-800 rounded-2xl p-8 border border-zinc-700"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-yellow-500 fill-yellow-500"
                      size={16}
                    />
                  ))}
                </div>
                <p className="text-zinc-300 italic mb-6 leading-relaxed">
                  "{review.text[lang]}"
                </p>
                <p className="font-semibold text-white">- {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP & FOOTER */}
      <section id="contact" className="bg-zinc-950 text-white relative z-20">
        <div className="grid md:grid-cols-2 min-h-[500px]">
          <div className="p-12 flex flex-col justify-center bg-zinc-950 border-t border-zinc-900">
            <h3 className="text-2xl font-bold mb-8">
              {currentT.contact.title}
            </h3>
            <div className="space-y-6 text-zinc-400">
              <div className="flex items-start gap-4">
                <MapPin className="text-white mt-1" />
                <p>
                  {currentT.contact.address1}
                  <br />
                  {currentT.contact.address2}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-white" />
                <p>+30 210 1234567</p>
              </div>

              <div className="flex items-center gap-4">
                <InstagramIcon className="text-white" size={24} />
                <span className="hover:text-white transition-colors cursor-pointer">
                  @urbanfade_official
                </span>
              </div>
              <div className="flex items-start gap-4 pt-4 border-t border-zinc-800">
                <Clock className="text-white mt-1" />
                <ul className="space-y-1 w-full max-w-[250px]">
                  <li className="flex justify-between">
                    <span>{currentT.contact.days}:</span>{" "}
                    <span className="text-white">10:00 - 21:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>{currentT.contact.sat}:</span>{" "}
                    <span className="text-white">09:00 - 18:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>{currentT.contact.sun}:</span>{" "}
                    <span className="text-zinc-600">
                      {currentT.contact.closed}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            id="map"
            className="w-full h-[400px] md:h-full md:grayscale md:hover:grayscale-0 grayscale-0 transition-all duration-500 bg-zinc-900 flex items-center justify-center"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3144.965706489432!2d23.72574921532321!3d37.97353457972379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bd1a0ad14323%3A0xe160bf0de21f1e00!2sSyntagma%20Square!5e0!3m2!1sen!2sgr!4v1689000000000!5m2!1sen!2sgr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
}
