"use client";

import { useEffect, useState } from 'react';
import Script from 'next/script';

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

const GoogleTranslate = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Only set up the translate element if it hasn't been loaded yet
        if (!isLoaded) {
            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        includedLanguages: 'ta,hi,te,ml,kn,en', // Languages you want to support
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false,
                    },
                    'google_translate_element'
                );
            };
            setIsLoaded(true);
        }
    }, [isLoaded]);

    return (
        <>
            <Script
                src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="lazyOnload"
                onLoad={() => {
                    // Script has loaded
                    console.log('Google Translate script loaded');
                }}
            />
            <div id="google_translate_element" className="google-translate-container" />
        </>
    );
};

export default GoogleTranslate; 