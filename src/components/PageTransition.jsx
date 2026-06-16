import { motion, useReducedMotion } from 'framer-motion'

// Dezente Seitenwechsel-Animation – ohne initial unsichtbare SSR-Inhalte.
export default function PageTransition({ children }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div>{children}</div>
  }

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
