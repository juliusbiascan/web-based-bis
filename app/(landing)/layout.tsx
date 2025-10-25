import Footer from "@/features/landing/components/landing/footer";
import Header from "@/features/landing/components/landing/header";

const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default AuthLayout;