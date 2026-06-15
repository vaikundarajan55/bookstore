function Footer() {
  return (
    <footer className="mt-8 py-4 px-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
      <p className="text-xs text-gray-400">
        © 2024 <span className="font-semibold text-gray-500">Acme HQ</span>. All rights reserved.
      </p>
      <div className="flex items-center gap-4">
        {['Privacy', 'Terms', 'Support'].map(link => (
          <a key={link} href="#" className="text-xs text-gray-400 hover:text-violet-500 transition-colors">
            {link}
          </a>
        ))}
      </div>
    </footer>
  )
}
export default Footer;