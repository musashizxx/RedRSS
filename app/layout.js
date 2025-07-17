import './globals.css'

export const metadata = {
  title: 'RSS Feed Platform',
  description: 'RedLine RSS',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="bg-gray-50 min-h-screen antialiased">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  RedLine RSS Feed
                </h1>
              </div>
              <div className="text-sm text-gray-500">
                #Geliştiriliyor
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500 text-sm">
              <p>#Geliştiriliyor</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
