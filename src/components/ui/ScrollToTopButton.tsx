import { useEffect, useState, useCallback } from 'react'
import { ChevronUp } from 'lucide-react'

interface Props {
  threshold?: number // pixels before showing the button
}

const ScrollToTopButton = ({ threshold = 400 }: Props) => {
  const [visible, setVisible] = useState(false)

  const onScroll = useCallback(() => {
    const y = window.scrollY || document.documentElement.scrollTop
    setVisible(y > threshold)
  }, [threshold])

  useEffect(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  const handleClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={handleClick}
      className={[
        'fixed bottom-6 right-6 z-40 print:hidden transition-opacity duration-200',
        'rounded-full border border-white/10 bg-eerie-black-2/80 backdrop-blur',
        'text-light-gray hover:text-white-1 focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-orange-yellow/70',
        'p-2 shadow-vcard-2',
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      ].join(' ')}
    >
      <ChevronUp size={20} />
    </button>
  )
}

export default ScrollToTopButton

