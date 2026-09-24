"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

function isIphoneSafari() {
  const userAgent = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(userAgent) && !window.matchMedia("(display-mode: standalone)").matches;
}

export function PwaProvider() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [showIosTip, setShowIosTip] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    const syncConnection = () => setIsOffline(!navigator.onLine);
    const onInstallPrompt = (event: Event) => { event.preventDefault(); setInstallEvent(event as InstallPromptEvent); };
    const onInstalled = () => setInstallEvent(null);
    const initialStateTimer = window.setTimeout(() => {
      syncConnection();
      setShowIosTip(isIphoneSafari());
    }, 0);
    window.addEventListener("online", syncConnection);
    window.addEventListener("offline", syncConnection);
    window.addEventListener("beforeinstallprompt", onInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("online", syncConnection);
      window.removeEventListener("offline", syncConnection);
      window.removeEventListener("beforeinstallprompt", onInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.clearTimeout(initialStateTimer);
    };
  }, []);

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    if ((await installEvent.userChoice).outcome === "accepted") setInstallEvent(null);
  }

  return <>
    {isOffline && <div role="status" className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-warning)] bg-[var(--color-surface-raised)] px-4 py-3 text-center text-sm text-[var(--color-ink)]">Kamu sedang offline. Draf jurnal tetap tersimpan di perangkat ini.</div>}
    {(installEvent || showIosTip) && <aside aria-label="Instal maunonton" className="fixed inset-x-3 bottom-[calc(6.9rem+env(safe-area-inset-bottom))] z-40 mx-auto max-w-sm rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] p-4 shadow-[var(--shadow-card)]">
      <p className="text-sm font-semibold text-[var(--color-ink)]">Tambahkan maunonton ke layar utama</p>
      {installEvent ? <div className="mt-2 flex items-center justify-between gap-3"><p className="text-xs leading-5 text-secondary">Buka jurnalmu seperti aplikasi, dengan layar penuh.</p><Button size="sm" onClick={install}>Instal</Button></div> : <p className="mt-1 text-xs leading-5 text-secondary">Di Safari iPhone: buka <strong className="text-[var(--color-ink)]">Bagikan</strong> lalu pilih <strong className="text-[var(--color-ink)]">Tambahkan ke Layar Utama</strong>.</p>}
    </aside>}
  </>;
}
