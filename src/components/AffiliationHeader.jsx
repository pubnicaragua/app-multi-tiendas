function AffiliationHeader() {
    return (
      <div className="relative">
        <div
          className="w-full h-64 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://th.bing.com/th/id/R.48f8ad056dd8bab163d9a52dd77a0cd3?rik=5j5AIvy5jhrCaA&pid=ImgRaw&r=0')",
            position: "relative",
          }}
        >
          <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
          <div className="relative z-10 h-full flex flex-col justify-center py-10 px-4 md:px-12 text-white">
            <div className="flex items-center mb-4">
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="m15 18-6-6 6-6"></path>
                </svg>
              </button>
              <h2 className="text-xl font-medium">Afiliación de Tiendas</h2>
            </div>
            <h1 className="text-3xl font-semibold">Únete a nuestra red</h1>
            <p className="mt-2">Haz crecer tu negocio con nuestra plataforma</p>
          </div>
        </div>
      </div>
    )
  }
  
  export default AffiliationHeader
  
  