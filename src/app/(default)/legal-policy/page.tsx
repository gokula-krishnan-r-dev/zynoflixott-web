// pages/legal-policy.tsx
import { NextPage } from "next";
import Head from "next/head";

const LegalPolicy: NextPage = () => {
  return (
    <div className="min-h-screen bg-body flex-col">
      <Head>
        <title>ZynoFlix - Legal Policy</title>
        <meta name="description" content="Legal Policy of ZynoFlix" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow max-w-4xl mx-auto bg-body p-8 rounded-lg shadow-lg mt-10">
        <h1 className="text-3xl font-bold mb-6">
          ZynoFlix OTT Legal Policy: Ensuring Compliance Under the Law
        </h1>
        <p className="mb-4">
          In today's digital age, the popularity of Over-the-Top (OTT) platforms
          has been on the rise. These platforms provide users with a wide range
          of content to stream at their convenience. However, with this
          increased accessibility comes the need for legal policies to ensure
          compliance with the law.
        </p>
        <p className="mb-4">
          ZynoFlix, as a leading OTT platform, has implemented a comprehensive
          legal policy to protect both its users and the content creators. Under
          the act law, ZynoFlix ensures that all content available on its
          platform adheres to copyright laws and intellectual property rights.
          This not only protects the creators of the content but also ensures
          that users are consuming legal and authorized material.
        </p>
        <p className="mb-4">
          Furthermore, ZynoFlix's legal policy also includes guidelines on user
          conduct and privacy. The platform ensures that users' personal
          information is protected and not misused in any way. This protects
          users from potential data breaches and privacy violations.
        </p>
        <p className="mb-4">
          In addition to this, ZynoFlix also has strict guidelines in place for
          advertisements and promotions on its platform. All advertisements are
          screened and approved to ensure that they meet legal requirements and
          do not promote illegal or harmful products or services.
        </p>
        <p className="mb-4">
          Overall, ZynoFlix's legal policy is designed to create a safe and
          secure environment for both users and content creators. By complying
          with the law, ZynoFlix sets a standard for other OTT platforms to
          follow, ensuring that the digital entertainment industry remains
          ethical and lawful.
        </p>
        <p className="mb-4">
          In conclusion, ZynoFlix's legal policy plays a crucial role in
          upholding the integrity of the platform and ensuring compliance with
          the law. By prioritizing legal requirements and user safety, ZynoFlix
          sets itself apart as a responsible and reliable OTT platform in the
          industry.
        </p>
      </main>
    </div>
  );
};

export default LegalPolicy;
