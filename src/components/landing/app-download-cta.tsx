import Image from 'next/image';

export function AppDownloadCTA() {
  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <div className="grid items-center gap-12 rounded-2xl bg-gradient-to-r from-primary to-teal-600 p-8 text-white md:grid-cols-2 md:p-16">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">
              Book Appointments on the Go
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Download our mobile app for an even faster and more convenient
              experience.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#" className="transform transition-transform hover:scale-105">
                <Image
                  src="https://sehatkahani.com/wp-content/uploads/2024/02/Google-Play-e1708453412581.png"
                  alt="Google Play"
                  width={160}
                  height={48}
                />
              </a>
              <a href="#" className="transform transition-transform hover:scale-105">
                <Image
                  src="https://sehatkahani.com/wp-content/uploads/2024/02/App-Store-e1708453424168.png"
                  alt="App Store"
                  width={160}
                  height={48}
                />
              </a>
            </div>
          </div>
          <div className="hidden items-center justify-center md:flex">
            <Image
              src="https://sehatkahani.com/_next/image/?url=%2F_next%2Fstatic%2Fmedia%2Fapp_shot.c91c52d4.png&w=640&q=75"
              alt="App Screenshot"
              width={300}
              height={600}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
