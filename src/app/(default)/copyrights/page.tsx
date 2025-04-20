// pages/copyrights.tsx
import { NextPage } from "next";
import Head from "next/head";

const Copyrights: NextPage = () => {
  return (
    <div className="min-h-screen bg-body flex flex-col">
      <Head>
        <title>ZynoFlix - Copyrights and Terms and Conditions</title>
        <meta
          name="description"
          content="Copyrights and Terms and Conditions of ZynoFlix"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex-grow pt-12 max-w-4xl mx-auto bg-body p-8 rounded-lg shadow-lg mt-10">
        <h1 className="text-3xl font-bold mb-6">
          Copyrights and Terms and Conditions
        </h1>
        <p className="mb-4">
          ZynoFlix is a popular OTT platform that offers a wide range of movies,
          TV shows, and original content to its subscribers. As a user of this
          platform, it is essential to understand the copyrights and terms and
          conditions that govern the use of the content available on ZynoFlix.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Copyright Laws</h2>
        <p className="mb-4">
          Copyright laws protect the creators of original content, such as
          movies, TV shows, and music, from unauthorized use and distribution.
          When you subscribe to ZynoFlix, you are granted access to a library of
          content that has been legally obtained and licensed by the platform.
          It is important to respect these copyrights and not engage in
          activities such as illegal downloading or sharing of copyrighted
          material.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Terms and Conditions</h2>
        <p className="mb-4">
          In addition to copyrights, ZynoFlix has its own terms and conditions
          that users must adhere to. These terms and conditions outline the
          rules and guidelines for using the platform, including restrictions on
          sharing login credentials, downloading content for offline viewing,
          and engaging in any form of piracy.
        </p>
        <p className="mb-4">
          By agreeing to the terms and conditions of ZynoFlix, you are
          committing to using the platform responsibly and ethically. Violating
          these terms can result in the suspension or termination of your
          account, as well as legal consequences if you engage in copyright
          infringement.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Responsible Use</h2>
        <p className="mb-4">
          As a responsible user of ZynoFlix, it is important to familiarize
          yourself with the copyrights and terms and conditions that govern the
          platform. By respecting these rules and guidelines, you can enjoy the
          wide range of content available on ZynoFlix while supporting the
          creators and artists who work hard to produce it.
        </p>
      </main>
    </div>
  );
};

export default Copyrights;
