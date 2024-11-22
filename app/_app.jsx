import Image from "next/image";
import '@/app/globals.css'
import Navbar from '@/components/Navbar';

export default function Home({ Component,pageProps }) {
    return (
      <>
        <meta name="referrer" content="no-referrer" />
        <Navbar />
        <Component {...pageProps} />
      </>
    );
  }
