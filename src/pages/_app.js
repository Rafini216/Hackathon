import "@/styles/globals.css";
import Sidebar from "../components/Sidebar";

export default function App({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-row">
      <Sidebar />
      <main className="">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
