"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const JoinUs = () => {
  return (
    <>
      {/* ===== JoinUs Start ===== */}
      <section className="overflow-hidden px-6 py-16 md:px-12 lg:py-20 xl:py-24 2xl:px-0">
        <div className="mx-auto max-w-7xl rounded-lg bg-gradient-to-t from-[#F8F9FF] to-[#DEE7FF] px-8 py-12 dark:bg-blacksection dark:bg-gradient-to-t dark:from-transparent dark:to-transparent">
          <div className="flex flex-wrap gap-10 md:flex-nowrap md:items-center md:justify-between">
            {/* Left Section */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="md:w-[65%] lg:w-1/2"
            >
              <h2 className="mb-6 text-4xl font-extrabold leading-tight text-black dark:text-white xl:text-5xl">
                Join Coachem Today & Simplify Your Coaching Process
              </h2>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Coachem is the ultimate solution for coaches in sports like
                tennis and padel. Streamline your lesson scheduling, track
                progress, manage client bookings, and stay in touch with
                notifications. Increase productivity and keep your students
                engaged!
              </p>
            </motion.div>

            {/* Right Section */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { opacity: 1, x: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:w-[40%]"
            >
              <div className="flex items-center justify-end xl:justify-between">
                <Image
                  width={299}
                  height={299}
                  src="/images/join_us_1.png"
                  alt="Coaching"
                  className="hidden xl:block"
                />
                <a
                  href="/auth/signup"
                  className="inline-flex items-center gap-3 rounded-full bg-black px-8 py-4 text-lg font-medium text-white hover:opacity-90 dark:bg-white dark:text-black"
                >
                  Sign up free
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* ===== JoinUs End ===== */}
    </>
  );
};

export default JoinUs;