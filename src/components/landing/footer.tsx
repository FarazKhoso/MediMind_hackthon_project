import { Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './logo';

const footerLinks = {
  'About': [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' },
  ],
  'For Doctors': [
    { name: 'Join our network', href: '#' },
    { name: 'Doctor Login', href: '#' },
  ],
  'Support': [
    { name: 'Help Center', href: '#' },
    { name: 'Contact Us', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#' },
  { icon: Twitter, href: '#' },
  { icon: Linkedin, href: '#' },
  { icon: Youtube, href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-gray-400">
              Your trusted partner in health, connecting you with the best
              doctors online.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-white">{title}</h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-700 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MediConnect. All rights reserved.
          </p>
          <div className="mt-4 flex gap-4 sm:mt-0">
            {socialLinks.map((social, index) => (
              <Link key={index} href={social.href} className="hover:text-white">
                <social.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
