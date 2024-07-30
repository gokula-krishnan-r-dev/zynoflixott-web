import { NextPage } from "next";
import Head from "next/head";

const PrivacyPolicy: NextPage = () => {
  return (
    <div className="min-h-screen bg-body flex flex-col">
      <Head>
        <title>ZynoFlix - Privacy Policy</title>
        <meta
          name="description"
          content="Privacy Policy of ZynoFlix under the law in India"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow max-w-4xl mx-auto bg-body p-8 rounded-lg shadow-lg mt-10">
        <h1 className="text-3xl font-bold mb-6">
          ZynoFlix Privacy Policy Under the Law in India
        </h1>
        <p className="mb-4">
          Privacy is a fundamental right of every individual, and laws regarding
          privacy are crucial to protect personal information. In the case of
          ZynoFlix, an OTT short film application, the privacy policy under the
          law in India plays a vital role in ensuring the protection of user
          data.
        </p>
        <p className="mb-4">
          Under the law in India, the privacy policy of ZynoFlix must adhere to
          certain regulations and guidelines to safeguard the personal
          information of its users. This includes obtaining consent from users
          before collecting any data, clearly stating the purpose of data
          collection, ensuring data security measures are in place, and
          providing users with the option to opt-out of data sharing.
        </p>
        <p className="mb-4">
          Furthermore, the privacy policy must comply with the Information
          Technology (Reasonable Security Practices and Procedures and Sensitive
          Personal Data or Information) Rules, 2011. This regulation governs the
          collection and use of sensitive personal data or information, such as
          passwords, financial information, and biometric data. ZynoFlix must
          ensure that such data is protected and not misused in any way.
        </p>
        <p className="mb-4">
          Additionally, the privacy policy must also follow the provisions of
          the Indian Contract Act, 1872, regarding the terms and conditions of
          service. Users must be informed of their rights and responsibilities
          when using the ZynoFlix application, and any changes to the privacy
          policy must be communicated to the users in a timely manner.
        </p>
        <p className="mb-4">
          In conclusion, the privacy policy of ZynoFlix under the law in India
          is crucial in maintaining the trust and confidence of its users. By
          adhering to the regulations and guidelines set forth by the
          government, ZynoFlix can ensure that the personal information of its
          users is protected and that their privacy rights are upheld.
        </p>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
