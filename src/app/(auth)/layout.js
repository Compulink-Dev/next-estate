export const metadata = {
  title: "Estate Auth",
  description: "Estate Auth",
};

export default function RootLayout({ children }) {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-200">
      {children}
    </div>
  );
}
