import { NextPage } from "next";
import Head from "next/head";

const About: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>About ZynoFlix</title>
        <meta
          name="description"
          content="Learn more about ZynoFlix, the cutting-edge OTT platform revolutionizing short films."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto p-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-blue-600">
            ZynoFlix
          </a>
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="text-gray-600 hover:text-blue-600">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="text-gray-600 hover:text-blue-600">
                About
              </a>
            </li>
            <li>
              <a
                href="/legal-policy"
                className="text-gray-600 hover:text-blue-600"
              >
                Legal Policy
              </a>
            </li>
            <li>
              <a
                href="/privacy-policy"
                className="text-gray-600 hover:text-blue-600"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-600 hover:text-blue-600">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main className="flex-grow max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
        <h1 className="text-3xl font-bold mb-6">Welcome to ZynoFlix</h1>
        <p className="mb-4">
          ZynoFlix is a cutting-edge OTT (Over-The-Top) platform that is
          revolutionizing the way we consume short films. With a focus on
          quality content and user-friendly interface, ZynoFlix is here to cater
          to the discerning viewer who appreciates the art of storytelling in
          its most concentrated form.
        </p>
        <p className="mb-4">
          At ZynoFlix, we understand the power of short films to captivate,
          inspire, and evoke emotions in a limited time frame. Our platform
          showcases a diverse range of short films across genres such as drama,
          comedy, thriller, horror, sci-fi, and more. Whether you're in the mood
          for a thought-provoking drama or a light-hearted comedy, ZynoFlix has
          something for everyone.
        </p>
        <p className="mb-4">
          What sets ZynoFlix apart from other OTT platforms is our commitment to
          supporting emerging filmmakers and providing a platform for their
          unique voices to be heard. We believe in the importance of nurturing
          talent and showcasing original and innovative content that challenges
          the status quo.
        </p>
        <p className="mb-4">
          In addition to an extensive library of short films, ZynoFlix also
          offers exclusive behind-the-scenes content, filmmaker interviews, and
          interactive features that allow viewers to engage with their favorite
          films and filmmakers on a deeper level.
        </p>
        <p className="mb-4">
          Our user-friendly interface makes it easy for viewers to discover new
          content, create personalized playlists, and share their favorite films
          with friends and family. With seamless streaming capabilities and
          high-quality video playback, ZynoFlix ensures that viewers have the
          best possible viewing experience.
        </p>
        <p className="mb-4">
          So whether you're a filmmaker looking to showcase your work, a viewer
          in search of compelling short films, or simply someone who appreciates
          the art of storytelling, ZynoFlix is the go-to destination for all
          your short film needs. Join us on this exciting journey as we continue
          to push the boundaries of storytelling and celebrate the magic of
          short films.
        </p>
      </main>
      <footer className="bg-white shadow-md mt-10">
        <div className="max-w-6xl mx-auto p-4 text-center text-gray-600">
          &copy; 2024 Fuero Networks Technologies Private Limited. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
};

export default About;
