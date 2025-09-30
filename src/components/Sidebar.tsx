import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EnvelopeIcon, LinkIcon, MapPinIcon, ChevronDownIcon, CodeBracketIcon, DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline'
import { SiGithub, SiLinkedin, SiThreads } from 'react-icons/si'


const Sidebar = () => {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const prefersReducedMotion = useReducedMotion()

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      label: 'Email',
      value: 'you@example.com',
      href: 'mailto:you@example.com'
    },
    /*
    {
      icon: PhoneIcon,
      label: 'Phone',
      value: '+41 (076) 722-7073',
      href: 'tel:+41767227073'
    },
    */
    {
      icon: LinkIcon,
      label: 'LinkedIn',
      value: 'linkedin.com/in/your-handle',
      href: 'https://www.linkedin.com/in/your-handle/'
    },
    {
      icon: CodeBracketIcon,
      label: 'GitHub',
      value: 'github.com/your-handle',
      href: 'https://github.com/your-handle'
    },
    {
      icon: MapPinIcon,
      label: 'Currently in',
      value: 'Your City, Country • UTC±0',
      href: null
    }
  ]

  const socialLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/your-handle/', icon: SiLinkedin },
    { name: 'GitHub',   url: 'https://github.com/your-handle',     icon: SiGithub },
    { name: 'Threads',  url: 'https://www.threads.net/@your-handle', icon: SiThreads },
    // { name: 'X',        url: 'https://x.com/your-handle',       icon: SiX },
  ]

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
      className="lg:w-80 w-full"
      aria-label="Profile and contacts"
    >
      <div className="relative bg-eerie-black-1 rounded-2xl p-6 shadow-2xl shadow-black/50 ring-1 ring-white/10 border border-white/5 backdrop-blur-sm">
        {/* Profile Section */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <img
              src="/images/placeholder-portrait.jpg"
              alt="Your Name"
              loading="lazy"
              className="w-44 h-52 rounded-2xl object-cover ring-1 ring-white/10 shadow-lg shadow-black/30"
            />
          </div>

          <div className="space-y-3">
            <h1 className="sidebar-name">
              Your Name
            </h1>

            <p className="text-gradient-yellow body-small bg-gradient-yellow-1 px-3 py-1 rounded-lg inline-block">
              Your Role or Tagline
            </p>

            <div className="flex items-center justify-center gap-2 text-emerald-400 nav-text">
              <span className="relative inline-flex">
                <span className="absolute inline-block w-2.5 h-2.5 rounded-full bg-emerald-500/40 animate-ping" />
                <span className="relative inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </span>
              <span>Available for impactful projects</span>
            </div>
          </div>
        </div>

        <div className="border-t border-jet opacity-60 my-5" />


        {/* Contact Toggle Button */}
        <button
          onClick={() => setIsContactOpen(!isContactOpen)}
          aria-expanded={isContactOpen}
          aria-controls="contact-panel"
          className="relative w-full flex items-center justify-center bg-gradient-onyx text-orange-yellow py-2 px-3 rounded-lg mb-0 hover:bg-gradient-yellow-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-yellow/70"
        >
          <span className="nav-text">Show Contacts</span>
          <motion.div
            className="absolute right-3"
            animate={{ rotate: isContactOpen ? 180 : 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          >
            <ChevronDownIcon className="w-4 h-4" />
          </motion.div>
        </button>




        {/* Contact Information */}
        <motion.div
          id="contact-panel"
          initial={false}
          animate={{
            height: isContactOpen ? 'auto' : 0,
            opacity: isContactOpen ? 1 : 0
          }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          className="overflow-hidden"
        >
          <div className="space-y-3 mt-5">
            {contactInfo.map((contact, index) => {
              const IconComponent = contact.icon
              return (
                <motion.div
                  key={contact.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: prefersReducedMotion ? 0 : index * 0.1, duration: prefersReducedMotion ? 0 : 0.2 }}
                  className="flex items-center gap-3"
                >
                  <IconComponent className="w-4 h-4 text-light-gray" />
                  <div className="flex-1">
                    <p className="nav-text text-light-gray uppercase tracking-wide text-left">
                      {contact.label}
                    </p>
                    {contact.href ? (
                      <div className="flex items-center justify-between gap-2">
                        <a
                          href={contact.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="body-small text-white-2 hover:text-orange-yellow transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-yellow/70 rounded"
                        >
                          {contact.value}
                        </a>
                        {contact.label === 'Email' ? (
                          <div className="flex items-center gap-2 ml-3">
                            {copied && (
                              <span className="text-emerald-400 nav-text flex items-center gap-1">
                                <CheckIcon className="w-3.5 h-3.5" /> Copied!
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText('you@example.com'); setCopied(true); setTimeout(() => setCopied(false), 1300); }}
                              className="text-light-gray opacity-60 hover:opacity-100 focus:opacity-100 hover:text-orange-yellow transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-yellow/70 rounded"
                              aria-label="Copy email"
                              title="Copy email"
                            >
                              <DocumentDuplicateIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="ml-3 w-4 h-4" />
                        )}
                      </div>
                    ) : (
                      <p className="body-small text-white-2 text-left">{contact.value}</p>
                    )}
                  </div>
                </motion.div>
              )



            })}
          </div>
        </motion.div>

        <div className="border-t border-jet opacity-60 my-5" />


        {/* Social Links */}
        <div className="flex justify-center gap-3">
          {socialLinks.map((social) => {
            const SocialIcon = social.icon
            return (
              <motion.a
                key={social.name}
                href={social.url}
                aria-label={social.name}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                className="w-10 h-10 bg-gradient-onyx rounded-lg flex items-center justify-center hover:bg-gradient-yellow-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-yellow/70"
              >
                <SocialIcon size={20} className="text-light-gray" />
              </motion.a>


            )
          })}
        </div>

        <div className="border-t border-jet opacity-60 my-5" />
        <p className="nav-text text-center text-light-gray mb-1">© {new Date().getFullYear()} Your Name</p>

      </div>
    </motion.aside>


  )
}

export default Sidebar
