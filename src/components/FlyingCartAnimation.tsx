import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { handleImageError } from '../lib/imageUtils';

interface FlyingParticle {
  id: string;
  startX: number;
  startY: number;
  image: string;
}

interface FlyingCartContextType {
  triggerFlyToCart: (startX: number, startY: number, image: string) => void;
  cartPulse: boolean;
}

const FlyingCartContext = createContext<FlyingCartContextType | undefined>(undefined);

export function FlyingCartProvider({ children }: { children: ReactNode }) {
  const [particles, setParticles] = useState<FlyingParticle[]>([]);
  const [cartPulse, setCartPulse] = useState(false);

  const triggerFlyToCart = (startX: number, startY: number, image: string) => {
    const id = crypto.randomUUID();
    setParticles((prev) => [...prev, { id, startX, startY, image }]);

    // Trigger cart badge pulse when particle arrives
    setTimeout(() => {
      setCartPulse(true);
      setTimeout(() => setCartPulse(false), 450);
    }, 550);
  };

  const removeParticle = (id: string) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <FlyingCartContext.Provider value={{ triggerFlyToCart, cartPulse }}>
      {children}

      {/* Floating flying particles overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        <AnimatePresence>
          {particles.map((p) => {
            // Dynamically calculate exact center of the header shopping bag icon
            let targetX = typeof window !== 'undefined' ? window.innerWidth - 80 : 300;
            let targetY = 28;

            if (typeof document !== 'undefined') {
              const cartIconElem = document.getElementById('header-cart-icon');
              if (cartIconElem) {
                const rect = cartIconElem.getBoundingClientRect();
                targetX = rect.left + rect.width / 2;
                targetY = rect.top + rect.height / 2;
              }
            }

            return (
              <motion.div
                key={p.id}
                initial={{
                  x: p.startX - 24,
                  y: p.startY - 24,
                  scale: 1,
                  opacity: 1,
                  rotate: 0,
                  boxShadow: '0 10px 25px -5px rgba(184, 134, 11, 0.4)'
                }}
                animate={{
                  x: targetX - 16,
                  y: targetY - 16,
                  scale: 0.18,
                  opacity: 0.15,
                  rotate: 360
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.58,
                  ease: [0.22, 1, 0.36, 1]
                }}
                onAnimationComplete={() => removeParticle(p.id)}
                className="absolute w-12 h-12 rounded-2xl border-2 border-[#B8860B] bg-white shadow-2xl overflow-hidden p-0.5 pointer-events-none z-[9999]"
              >
                <img
                  src={p.image}
                  alt="Adding to bag"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="w-full h-full object-cover rounded-xl"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </FlyingCartContext.Provider>
  );
}

export function useFlyingCart() {
  const context = useContext(FlyingCartContext);
  if (!context) {
    return {
      triggerFlyToCart: () => {},
      cartPulse: false
    };
  }
  return context;
}
