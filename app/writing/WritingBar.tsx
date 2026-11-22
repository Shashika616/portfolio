import Link from "next/link";
import { PROFILE } from "../data/profile";

/** Static glass bar for the writing pages: name home, the profile, the writing index. */
export function WritingBar() {
  return (
    <header className="fixed top-3 inset-x-3 sm:inset-x-6 z-50">
      <nav className="glass-bar glass-bar--light h-14 px-3 sm:px-5 flex items-center justify-between gap-3 rounded-2xl">
        <Link href="/profile" className="display text-lg sm:text-2xl whitespace-nowrap">{PROFILE.name}</Link>
        <div className="flex items-center gap-1 text-[15px]">
          <Link href="/writing" className="h-10 px-3 inline-flex items-center rounded-lg hover:bg-slate-900/5">Writing</Link>
          <Link href="/profile" className="h-10 px-3 inline-flex items-center rounded-lg hover:bg-slate-900/5">Profile</Link>
        </div>
      </nav>
    </header>
  );
}
