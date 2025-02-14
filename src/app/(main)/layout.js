import Header from "../../components/Header";

export const metadata = {
  title: "Estate Main",
  description: "Estate Main",
};

export default function RootLayout({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
