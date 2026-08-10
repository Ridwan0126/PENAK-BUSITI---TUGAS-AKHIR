import Header from "../components/Header";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Header / Navbar tetap di atas */}
      <Header />

      {/* Kontainer Gambar dengan jarak (pt-20) agar tidak tertutup navbar */}
      <div className="flex-1 flex items-center justify-center p-4 pt-20 md:pt-24">
        <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
          <img
            className="w-full h-full object-cover"
            src="/images/tamp.jpg"
            alt="Page not found"
          />
        </div>
      </div>

      {/* Footer tetap di bawah */}
      <Footer />
    </div>
  );
}
