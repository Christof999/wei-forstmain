import { motion } from 'framer-motion'

// Scroll-getriggerte Einblend-Animation (nur transform/opacity -> performant).
export default function Reveal({ children, delay = 0, y = 28, className, as = 'div', id }) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      id={id}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </MotionTag>
  )
}
