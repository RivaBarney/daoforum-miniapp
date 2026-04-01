import type { ReactNode } from "react";
import { Merriweather, Source_Sans_3 } from "next/font/google";
import { Providers } from "@/app/providers";
import "@/app/globals.css";

const headingFont = Merriweather({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-heading"
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <head>
        <meta name="base:app_id" content="69ccba1197b57b220304870f" />
        <meta
          name="talentapp:project_verification"
          content="de257575c0020570e7859c0e524bb3e700e5e61d0546bde3d0bd7cfa66e234e3c9773490ce99f1abb372f46bf79296ec2fe50f938eb2345e6c246e20716e9375"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
