"use client"

import { useState } from "react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import Link from "next/link"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const { scrollY } = useScroll()
  let lastScrollY = 0

  useMotionValueEvent(scrollY, "change", (current) => {
    if (typeof current === "number") {
      const diff = current - lastScrollY
      if (diff > 10) {
        setIsVisible(false)
      } else if (diff < -10) {
        setIsVisible(true)
      }
      setIsScrolled(current > 50)
      lastScrollY = current
    }
  })

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-panel" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg group-hover:shadow-lg transition-shadow">
            O
          </div>
          <span className="font-bold text-lg text-foreground">Oris AI</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            How It Works
          </Link>
          <Link href="#pricing" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="#contact" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            Contact
          </Link>
        </nav>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:shadow-lg transition-shadow"
        >
          Book Consultation
        </motion.button>
      </div>
    </motion.header>
  )
}
