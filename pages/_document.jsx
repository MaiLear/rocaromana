import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

class CustomDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" />
                    <link rel="stylesheet" href="/css/react-spring-lightbox.css" />
                    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
                    <script async defer src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&libraries=places&loading=async`}></script>
                    <link
                        rel="stylesheet"
                        href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
                    />

                    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

                    {/* Google Adsence */}
                    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5187122762138955"
                        crossOrigin="anonymous"></script>


                </Head>

                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default CustomDocument;
