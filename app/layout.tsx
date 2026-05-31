import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { Atmosphere } from "@/common/decoration/Atmosphere";
import { FilmRails } from "@/common/decoration/FilmRails";
import { QueryProvider } from "@/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const pressStart = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Framely — guess the movie",
  description:
    "A cinematic daily movie guessing game. Match the secret film by genre, year, box office, rating, studio and cast — or name it from a sliver of its poster.",
  applicationName: "Framely",
  keywords: ["movie game", "guess the movie", "wordle for movies", "poster quiz", "tmdb"],
};

export const viewport: Viewport = {
  themeColor: "#060608",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html
    lang="en"
    className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${pressStart.variable} antialiased`}
  >
    <body className="min-h-dvh overflow-x-hidden bg-fr-bg text-fr-fg">
      <QueryProvider>
        <Atmosphere />
        <FilmRails />
        <div className="relative z-10 flex min-h-dvh flex-col">{children}</div>
      </QueryProvider>
    </body>
  </html>
);

export default RootLayout;
