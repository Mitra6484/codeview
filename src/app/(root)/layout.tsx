import StreamClientProvider from "@/components/providers/StreamClientProvider";
import LayoutWrapper from "@/components/LayoutWrapper";
import { SignedIn } from "@clerk/nextjs";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StreamClientProvider>
      <SignedIn>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </SignedIn>
    </StreamClientProvider>
  );
}
export default Layout;