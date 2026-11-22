import { NameLoader } from "./components/ui/NameLoader";

/** Route skeleton for /: the intro's black stage with the name-wave loader. */
export default function RootLoading() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center" aria-busy="true" aria-label="Loading">
      <NameLoader className="text-white/90" />
    </div>
  );
}
