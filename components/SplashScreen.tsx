/**
 * Brief branded screen shown while the local database opens on launch (AppInit) — replaces the
 * earlier blank white flash, so the app always "starts" somewhere instead of snapping straight
 * into a screen mid-load.
 */
export function SplashScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-primary text-on-primary">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-on-primary/15 text-3xl font-bold font-heading">
        CG
      </div>
      <p className="font-heading text-xl font-semibold">Career Goals</p>
    </div>
  );
}
