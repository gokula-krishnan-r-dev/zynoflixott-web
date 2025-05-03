'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { 
  FaFilm, 
  FaScroll, 
  FaUserTie, 
  FaHistory, 
  FaSkull, 
  FaLaughSquint, 
  FaUpload,
  FaEnvelope
} from 'react-icons/fa';

const FilmCallPage = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const genres = [
    { id: 'horror', name: 'Horror', icon: <FaSkull className="h-10 w-10 text-red-600" /> },
    { id: 'thriller', name: 'Thriller', icon: <FaUserTie className="h-10 w-10 text-purple-600" /> },
    { id: 'comedy', name: 'Comedy', icon: <FaLaughSquint className="h-10 w-10 text-yellow-500" /> },
    { id: 'historical', name: 'Historical Drama', icon: <FaHistory className="h-10 w-10 text-amber-700" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Submit Your Film to Zynoflix OTT
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              We're looking for the next big story. Is it yours?
            </p>
            <button 
              onClick={() => document.getElementById('submission-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg hover:shadow-xl"
            >
              Submit Your Film
            </button>
          </div>
        </div>
        <div className="absolute inset-0 -z-10">
          <div className="w-full h-full bg-[url('/film-background.jpg')] bg-cover bg-center opacity-30"></div>
        </div>
      </div>

      {/* What We're Looking For */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="border-b-4 border-purple-600 pb-2">What We're Looking For</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {genres.map((genre) => (
              <div 
                key={genre.id}
                className={`bg-gray-800/50 backdrop-blur-md p-6 rounded-xl hover:bg-gray-700/70 transition duration-300 border border-gray-700 hover:border-purple-500 cursor-pointer ${
                  activeCategory === genre.id ? 'border-purple-500 bg-gray-700/70' : ''
                }`}
                onClick={() => setActiveCategory(genre.id === activeCategory ? null : genre.id)}
              >
                <div className="flex flex-col items-center text-center">
                  {genre.icon}
                  <h3 className="text-xl font-semibold mt-4 mb-2">{genre.name}</h3>
                  <p className="text-gray-400">
                    {genre.id === 'horror' && 'Terrifying tales that haunt viewers long after watching'}
                    {genre.id === 'thriller' && 'Edge-of-seat suspense with unexpected twists'}
                    {genre.id === 'comedy' && 'Fresh humor that delivers genuine laughs'}
                    {genre.id === 'historical' && 'Compelling stories that bring history to life'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 flex flex-col md:flex-row md:items-start gap-6 bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
            <div className="flex-shrink-0 flex justify-center">
              <FaScroll className="h-16 w-16 text-purple-500" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-center md:text-left">What Makes a Great Submission</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span><strong className="text-white">Compelling Script:</strong> Stories that captivate from beginning to end with unique perspectives</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span><strong className="text-white">Technical Quality:</strong> Clear audio, good lighting, and thoughtful cinematography</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span><strong className="text-white">Authentic Characters:</strong> Well-developed characters that audiences can connect with</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span><strong className="text-white">Original Concepts:</strong> Fresh takes that stand out from the typical narratives</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Submission Process */}
      <section className="py-20 px-4 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="border-b-4 border-purple-600 pb-2">How to Submit</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md p-8 rounded-xl border border-gray-700 hover:border-purple-500 transition duration-300">
              <div className="h-16 w-16 flex items-center justify-center bg-purple-900/50 rounded-full mb-6 mx-auto">
                <FaUpload className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">1. Upload Your Film</h3>
              <p className="text-gray-400 text-center">
                Upload your short film to the Zynoflix OTT platform through your creator account
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md p-8 rounded-xl border border-gray-700 hover:border-purple-500 transition duration-300">
              <div className="h-16 w-16 flex items-center justify-center bg-purple-900/50 rounded-full mb-6 mx-auto">
                <FaEnvelope className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">2. Email Us</h3>
              <p className="text-gray-400 text-center">
                Send the link to your film along with a brief synopsis to <span className="text-purple-400">zynoflixproduction@gmail.com</span>
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md p-8 rounded-xl border border-gray-700 hover:border-purple-500 transition duration-300">
              <div className="h-16 w-16 flex items-center justify-center bg-purple-900/50 rounded-full mb-6 mx-auto">
                <FaFilm className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">3. Get Featured</h3>
              <p className="text-gray-400 text-center">
                Selected films will be featured prominently on the Zynoflix OTT platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Submission Form */}
      <section id="submission-form" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="border-b-4 border-purple-600 pb-2">Submit Your Film</span>
          </h2>
          
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md p-8 rounded-xl border border-gray-700">
            <p className="text-center text-xl mb-8">
              Ready to showcase your talent? Fill out the form below to get started.
            </p>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 text-white"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 text-white"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Film Title</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 text-white"
                  placeholder="Title of your film"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Genre</label>
                <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 text-white">
                  <option value="" disabled selected>Select a genre</option>
                  <option value="horror">Horror</option>
                  <option value="thriller">Thriller</option>
                  <option value="comedy">Comedy</option>
                  <option value="historical">Historical Drama</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Film Synopsis</label>
                <textarea 
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 text-white h-32"
                  placeholder="Brief description of your film"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Film Link</label>
                <input 
                  type="url" 
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 text-white"
                  placeholder="URL to your film on Zynoflix platform"
                />
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg transition duration-300 shadow-lg hover:shadow-xl"
                >
                  Submit Your Film
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-black/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="border-b-4 border-purple-600 pb-2">Frequently Asked Questions</span>
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-2">What types of films are eligible?</h3>
              <p className="text-gray-300">
                We accept short films in horror, thriller, comedy, and historical drama genres. The film should be between 10-30 minutes in length and must be original content.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-2">Do I retain the rights to my film?</h3>
              <p className="text-gray-300">
                Yes, you retain the intellectual property rights to your film. By submitting, you grant Zynoflix OTT a non-exclusive license to stream your content on our platform.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-2">Is there a submission deadline?</h3>
              <p className="text-gray-300">
                Submissions are accepted on a rolling basis, but for consideration in our next featured showcase, please submit by the end of the current quarter.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-2">Will I be compensated if my film is selected?</h3>
              <p className="text-gray-300">
                Selected filmmakers will receive revenue shares based on viewership metrics, plus potential opportunities for commissioned work on future Zynoflix original productions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            This Is Your Chance to Shine
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the Zynoflix family and showcase your storytelling talent to audiences worldwide.
          </p>
          <button 
            onClick={() => document.getElementById('submission-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg hover:shadow-xl"
          >
            Submit Your Film Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default FilmCallPage;