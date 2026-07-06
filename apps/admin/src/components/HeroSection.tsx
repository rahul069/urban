import { Search, MapPin, User, ShoppingCart, Star, Users, Wrench, Paintbrush, Sparkles, Lock, Droplets } from 'lucide-react';

const services = [
  { name: 'Cleaning', icon: <Sparkles className="h-8 w-8 text-gray-600" /> },
  { name: 'Repairs', icon: <Wrench className="h-8 w-8 text-gray-600" /> },
  { name: 'Painting', icon: <Paintbrush className="h-8 w-8 text-gray-600" /> },
  { name: 'Salon', icon: <User className="h-8 w-8 text-gray-600" /> },
];

const smartProducts = [
  { name: 'Water Purifier', icon: <Droplets className="h-6 w-6 text-gray-600" />, sale: true },
  { name: 'Smart Locks', icon: <Lock className="h-6 w-6 text-gray-600" />, sale: true },
];

const HeroSection = () => {
  return (
    <div className="bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">UC Urban Company</h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">
                  Homes
                </a>
                <a href="#" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">
                  Native
                </a>
                <a href="#" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">
                  Beauty
                </a>
              </div>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-2">
                <div className="flex items-center px-3 py-2 border border-gray-200 rounded-full text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Location</span>
                </div>
                <div className="flex items-center px-3 py-2 border border-gray-200 rounded-full text-sm w-64">
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search for services"
                    className="bg-transparent outline-none text-gray-600 flex-1"
                  />
                </div>
              </div>
              <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50">
                <ShoppingCart className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50">
                <User className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Content */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Home services at your doorstep
            </h1>

            {/* Services Grid */}
            <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {services.map((service, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                      {service.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{service.name}</span>
                  </div>
                ))}
              </div>

              {/* Smart Products */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Native Smart Products</h3>
                <div className="grid grid-cols-2 gap-4">
                  {smartProducts.map((product, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100">
                      {product.icon}
                      <span className="text-sm font-medium text-gray-700">{product.name}</span>
                      {product.sale && (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">Sale</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700">4.8 Service Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">12M+ Customers Globally</span>
              </div>
            </div>
          </div>

          {/* Right Column: Image Collage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 lg:col-span-1 space-y-4">
              <img
                src="https://source.unsplash.com/random/600x400/?cleaning"
                alt="Cleaning service"
                className="rounded-2xl object-cover w-full h-64"
              />
              <img
                src="https://source.unsplash.com/random/600x300/?repair"
                alt="Repair service"
                className="rounded-2xl object-cover w-full h-48"
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <img
                src="https://source.unsplash.com/random/600x800/?salon"
                alt="Salon service"
                className="rounded-2xl object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeroSection;