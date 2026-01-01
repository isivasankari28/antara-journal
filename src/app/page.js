'use client';

import { motion } from 'framer-motion';
import { BreathworkWidget } from '@/components/dashboard/BreathworkWidget';
import InternalWeather from '@/components/dashboard/InternalWeather';
import GardenCalendar from '@/components/garden/GardenCalendar';

export default function Home() {
  const currentHour = new Date().getHours();
  let greeting = "Good Morning";
  if (currentHour >= 12 && currentHour < 18) greeting = "Good Afternoon";
  if (currentHour >= 18) greeting = "Good Evening";

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="space-y-4"
      >
        <h1 className="text-4xl md:text-6xl font-serif text-foreground/80 tracking-tight">
          {greeting}, User.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-light max-w-md mx-auto">
          "Quiet the mind, and the soul will speak."
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl w-full justify-center items-stretch px-4"
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BreathworkWidget />
            <InternalWeather />
          </div>
          {/* Journal Streak or Quote could go here */}
        </div>
        <div className="lg:col-span-1">
          <GardenCalendar />
        </div>
      </motion.div>
    </div>
  );
}
