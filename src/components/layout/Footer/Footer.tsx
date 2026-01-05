import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { COMPANY_NAME } from '@/lib/constants';
import { cn } from '@/lib/cn';

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Customers', path: '/customers' },
    { label: 'Invoices', path: '/invoices' },
    { label: 'Reports', path: '/reports' },
  ];

  const supportLinks = [
    { label: 'Settings', path: '/settings' },
    { label: 'Help Center', path: '#' },
    { label: 'Privacy Policy', path: '#' },
    { label: 'Terms of Service', path: '#' },
  ];

  return (
    <footer className={cn('hidden lg:block bg-neutral-900 text-white mt-auto', className)}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/logo.jpg" 
                alt={COMPANY_NAME} 
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-bold text-lg text-white">Superior Scents</h3>
                <p className="text-xs text-neutral-400">DMV, LLC</p>
              </div>
            </div>
            <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
              Premium scent solutions for businesses across the DMV area. 
              Elevating spaces with luxurious fragrances since 2020.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 flex items-center justify-center transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500"></span>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-sm text-neutral-400 hover:text-white hover:pl-2 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500"></span>
              Support
            </h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.path}
                    className="text-sm text-neutral-400 hover:text-white hover:pl-2 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500"></span>
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-400">
                  123 Scent Avenue<br />
                  Washington, DC 20001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="tel:+12025550100" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  (202) 555-0100
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@superiorscents.com" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  info@superiorscents.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-500">
              &copy; {currentYear} {COMPANY_NAME}. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-600">
              <span>Powered by</span>
              <span className="font-semibold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                WebBase Solutions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient line */}
      <div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500"></div>
    </footer>
  );
};

export default Footer;
