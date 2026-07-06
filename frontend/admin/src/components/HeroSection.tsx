import Link from 'next/link';
import { MapPin, User, ShieldCheck, FileText, CreditCard, AlertTriangle, FileCheck, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const services = [
  { name: 'Verify Providers', icon: <ShieldCheck className="h-8 w-8 text-gray-600" />, path: '/verification' },
  { name: 'Manage Bookings', icon: <FileText className="h-8 w-8 text-gray-600" />, path: '/bookings' },
  { name: 'Process Payments', icon: <CreditCard className="h-8 w-8 text-gray-600" />, path: '/invoices' },
  { name: 'Resolve Disputes', icon: <AlertTriangle className="h-8 w-8 text-gray-600" />, path: '/disputes' },
];

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div className="text-2xl font-bold text-gray-900">Urban Home Services</div>
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
          <Link href="/bookings" className="text-gray-600 hover:text-gray-900">Bookings</Link>
          <Link href="/verification" className="text-gray-600 hover:text-gray-900">Providers</Link>
          <Link href="/invoices" className="text-gray-600 hover:text-gray-900">Invoices</Link>
          <Link href="/disputes" className="text-gray-600 hover:text-gray-900">Disputes</Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center px-3 py-2 border border-gray-200 rounded-full text-sm">
            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600">Germany</span>
          </div>
          <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50">
            <User className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </nav>

      {/* Hero Grid */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Content */}
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-gray-900">
            {t('hero.title')}
          </h1>

          {/* Service Grid */}
          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {services.map((service, index) => (
                <Link
                  key={index}
                  href={service.path}
                  className="flex flex-col items-center space-y-2 hover:bg-gray-100 p-4 rounded-lg transition"
                >
                  <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                    {service.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{service.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <FileCheck className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">GoBD Invoicing</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700">1200+ Verified Providers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">GDPR Compliant</span>
            </div>
          </div>
        </div>

        {/* Right Column: Image Collage */}
        <div className="grid grid-cols-2 gap-4">
          <img
            src="https://source.unsplash.com/random/600x400/?admin-verification"
            alt="Provider Verification"
            className="rounded-xl object-cover w-full h-64 col-span-2"
          />
          <img
            src="https://source.unsplash.com/random/600x300/?booking-management"
            alt="Booking Management"
            className="rounded-xl object-cover w-full h-48"
          />
          <img
            src="https://source.unsplash.com/random/600x300/?invoice-generation"
            alt="Invoice Generation"
            className="rounded-xl object-cover w-full h-48"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;