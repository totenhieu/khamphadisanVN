import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PageLayout = ({ children, withTopPadding = true }: { children: ReactNode; withTopPadding?: boolean }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className={withTopPadding ? "pt-16 flex-1" : "flex-1"}>{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
