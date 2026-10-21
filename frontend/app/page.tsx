import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary selection:text-background">
      
      {/* 1. KAHRAMAN (HERO) BÖLÜMÜ */}
      <header className="relative overflow-hidden border-b border-main-border bg-gradient-to-b from-background to-card-bg py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center rounded-full bg-theme-900 px-3 py-1 text-sm font-medium text-primary border border-main-border mb-6">
            SenVeBen'e Hoş Geldiniz
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl max-w-3xl mx-auto leading-tight">
            Türkiye'nin Arkadaşlık ve Sosyal Portalı
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Tamamen yenilenen arayüzü ve Taş Port platformuyla aradığınız topluluğu, etkinlikleri ve arkadaşlıkları keşfetmeye hemen başlayın.
          </p>
          <div className="mt-10 flex justify-center gap-x-4">
            <a
              href="/auth/register"
              className="rounded-lg bg-primary px-6 py-3 text-md font-semibold text-background shadow-sm hover:bg-theme-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Üye Ol
            </a>
            <a
              href="/login"
              className="rounded-lg border border-main-border bg-secondary px-6 py-3 text-md font-semibold text-foreground hover:bg-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Giriş Yap
            </a>
          </div>
        </div>
      </header>

      {/* 2. ÖNE ÇIKAN ÖZELLİKLER (FEATURES) BÖLÜMÜ */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Sizin İçin Geliştirilen Platform
          </h2>
          <p className="mt-4 text-md text-muted-foreground">
            Mor ve pembe karmaşasına son verdik. İşte Taş Port sayfasıyla birebir uyumlu yeni özelliklerimiz.
          </p>
        </div>

        {/* ÖZELLİK KARTLARI */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* Kart 1 */}
          <div className="rounded-xl border border-main-border bg-card p-8 shadow-sm transition-transform hover:-translate-y-1 duration-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary border border-main-border mb-5">
              👑
            </div>
            <h3 className="text-xl font-semibold text-foreground">Taş Port Entegrasyonu</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Profiliniz, Taş Port sayfanızla tam entegre çalışır. Tüm panellerinize tek bir noktadan, aynı renk konforuyla erişin.
            </p>
          </div>

          {/* Kart 2 */}
          <div className="rounded-xl border border-main-border bg-card p-8 shadow-sm transition-transform hover:-translate-y-1 duration-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary border border-main-border mb-5">
              💬
            </div>
            <h3 className="text-xl font-semibold text-foreground">Gelişmiş Mesajlaşma</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Üyeler arası kesintisiz ve hızlı iletişim ağı sayesinde topluluk içi etkileşiminizi en üst seviyeye taşıyın.
            </p>
          </div>

          {/* Kart 3 */}
          <div className="rounded-xl border border-main-border bg-card p-8 shadow-sm transition-transform hover:-translate-y-1 duration-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary border border-main-border mb-5">
              🔒
            </div>
            <h3 className="text-xl font-semibold text-foreground">Güvenli Altyapı</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Verileriniz ve hesap güvenliğiniz modern şifreleme yöntemleriyle en üst düzeyde korunur.
            </p>
          </div>

        </div>
      </main>

      {/* 3. ALT BİLGİ (FOOTER) BÖLÜMÜ */}
      <footer className="border-t border-main-border bg-card py-8 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SenVeBen. Tüm hakları saklıdır.</p>
          <div className="flex gap-x-6">
            <a href="/dashboard" className="hover:text-primary transition-colors">Taş Port</a>
            <a href="/login" className="hover:text-primary transition-colors">Giriş</a>
            <a href="/auth/register" className="hover:text-primary transition-colors">Kayıt Ol</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
