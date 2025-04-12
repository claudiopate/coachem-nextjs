"use client";
import Image from "next/image";
import { useState } from "react";

const Hero = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <section className="overflow-hidden pb-20 pt-35 md:pt-40 xl:pb-25 xl:pt-15">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          <div className="flex lg:items-center lg:gap-8 xl:gap-32.5">
            <div className=" md:w-1/2">
            <h4 className="mb-4.5 text-lg font-medium text-black dark:text-white">
              🚀 Coachem - The Ultimate Sports Coaching Platform
            </h4>
            <h1 className="mb-5 pr-16 text-3xl font-bold text-black dark:text-white xl:text-hero">
              All-in-one solution for{" "}
              <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg dark:before:bg-titlebgdark">
                coaches and athletes
              </span>
            </h1>
            <p>
              Coachem helps you streamline your coaching business with <strong>smart scheduling</strong>, 
              <strong>automated bookings</strong>, <strong>attendance tracking</strong>, 
              and <strong>real-time notifications</strong>. Keep your students engaged and updated 
              with progress reports and personalized training plans — all in one place.
            </p>

            <div className="mt-10">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-wrap gap-5">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    placeholder="Enter your email address"
                    className="rounded-full border border-stroke px-6 py-2.5 shadow-solid-2 focus:border-primary focus:outline-hidden dark:border-strokedark dark:bg-black dark:shadow-none dark:focus:border-primary"
                  />
                  <button
                    aria-label="get started button"
                    className="flex rounded-full bg-black px-7.5 py-2.5 text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho"
                  >
                    Try it Free
                  </button>
                </div>
              </form>

              <p className="mt-5 text-black dark:text-white">
                No credit card needed. Start managing your sessions in minutes.
              </p>
            </div>
            </div>

            <div className="animate_right hidden md:w-1/2 lg:block">
              <div className="relative 2xl:-mr-7.5">
                <div className=" relative aspect-700/444 w-full">
                  <Image
                    className="shadow-solid-l dark:hidden"
                    src="/images/hero/first_coach.jpg"
                    alt="Hero"
                    fill
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
