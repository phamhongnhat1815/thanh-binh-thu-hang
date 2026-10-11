"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FamilyMap from "./FamilyMap";
import WeddingGift from "./WeddingGift";
import { weddingConfig } from "../lib/wedding-config";
type EventConfig = {
  D?: string;
  A?: string;
  cs?: {
    dw?: string;
    dv?: string;
    a?: string;
  }[];
  [key: string]: unknown;
};
type Wish = {
  name: string;
  message: string;
};
export default function Wedding({
  html,
  events,
  cover = false,
}: {
  html: string;
  events: Record<string, EventConfig>;
  cover?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const musicButton = useRef<HTMLButtonElement>(null);
  const [slots, setSlots] = useState<{
    groom: HTMLElement | null;
    bride: HTMLElement | null;
    gift: HTMLElement | null;
  }>({ groom: null, bride: null, gift: null });
  const [status, setStatus] = useState("");
  useEffect(() => {
    const root = host.current!;
    const removers: (() => void)[] = [];
    const timers: ReturnType<typeof setInterval>[] = [];
    const fit = () => {
      root.style.zoom = String(Math.min(window.innerWidth / 420, 1));
    };
    fit();
    window.addEventListener("resize", fit);
    removers.push(() => window.removeEventListener("resize", fit));
    setSlots({
      groom: root.querySelector<HTMLElement>("#groom-map-slot"),
      bride: root.querySelector<HTMLElement>("#bride-map-slot"),
      gift: root.querySelector<HTMLElement>("#wedding-gift-slot"),
    });
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("ladi-animation");
            e.target.classList.remove("wedding-wait");
            observer.unobserve(e.target);
          }
        }
      },
      { threshold: 0.01 },
    );
    for (const [id, event] of Object.entries(events)) {
      const element = root.querySelector<HTMLElement>(`#${id}`);
      if (!element) continue;
      if (event.D && !reduced) {
        element.classList.add("wedding-wait");
        observer.observe(element);
      }
      const link = event.cs?.find((a) => a.a === "link" && a.dw);
      if (link && element.tagName !== "A") {
        const url = link.dw!;
        element.setAttribute("role", "link");
        element.setAttribute("tabindex", "0");
        element.setAttribute(
          "aria-label",
          url.includes("maps") ? "Xem địa điểm trên bản đồ" : "Mở liên kết",
        );
        element.style.cursor = "pointer";
        const go = () => window.open(url, "_blank", "noopener,noreferrer");
        const key = (e: KeyboardEvent) => {
          if (e.key === "Enter") go();
        };
        element.addEventListener("click", go);
        element.addEventListener("keydown", key);
        removers.push(() => {
          element.removeEventListener("click", go);
          element.removeEventListener("keydown", key);
        });
      }
    }
    const countdown = () => {
      const seconds = Math.max(
        0,
        Math.floor(
          (new Date(weddingConfig.countdownAt).getTime() - Date.now()) / 1000,
        ),
      );
      [
        Math.floor(seconds / 86400),
        Math.floor(seconds / 3600) % 24,
        Math.floor(seconds / 60) % 60,
        seconds % 60,
      ].forEach((n, i) => {
        const e = root.querySelector(`#COUNTDOWN_ITEM${i + 1}`);
        if (e) e.textContent = String(n).padStart(2, "0");
      });
    };
    countdown();
    timers.push(setInterval(countdown, 1000));
    const gallery = root.querySelector<HTMLElement>("#GALLERY2");
    if (gallery) {
      let current = 0;
      const items = Array.from(
        gallery.querySelectorAll<HTMLElement>(".ladi-gallery-view-item"),
      );
      const thumbs = Array.from(
        gallery.querySelectorAll<HTMLElement>(".ladi-gallery-control-item"),
      );
      const show = (n: number) => {
        const next = (n + items.length) % items.length;
        if (next === current) return;
        const previous = current;
        const direction = n > current ? 1 : -1;
        items.forEach((e, i) => {
          e.getAnimations().forEach((animation) => animation.cancel());
          e.classList.toggle(
            "selected",
            i === next || (!reduced && i === previous),
          );
        });
        if (!reduced) {
          items[next].animate(
            [
              { transform: `translateX(${direction * 100}%)` },
              { transform: "translateX(0)" },
            ],
            { duration: 500, easing: "ease-in-out" },
          );
          const outgoing = items[previous].animate(
            [
              { transform: "translateX(0)" },
              { transform: `translateX(${-direction * 100}%)` },
            ],
            { duration: 500, easing: "ease-in-out" },
          );
          outgoing.onfinish = () =>
            items[previous].classList.remove("selected");
        }
        current = next;
        thumbs.forEach((e, i) => {
          e.classList.toggle("selected", i === current);
          e.setAttribute("aria-current", String(i === current));
        });
        const box = gallery.querySelector<HTMLElement>(
          ".ladi-gallery-control-box",
        );
        if (box)
          box.style.transform = `translateX(-${Math.max(0, Math.min(current * 90 - 135, items.length * 90 - 420))}px)`;
      };
      const bind = (e: HTMLElement, fn: () => void, label: string) => {
        e.role = "button";
        e.tabIndex = 0;
        e.setAttribute("aria-label", label);
        const key = (k: KeyboardEvent) => {
          if (k.key === "Enter" || k.key === " ") {
            k.preventDefault();
            fn();
          }
        };
        e.addEventListener("click", fn);
        e.addEventListener("keydown", key);
        removers.push(() => {
          e.removeEventListener("click", fn);
          e.removeEventListener("keydown", key);
        });
      };
      thumbs.forEach((e, i) => bind(e, () => show(i), `Xem ảnh cưới ${i + 1}`));
      gallery
        .querySelectorAll<HTMLElement>('[class*="arrow-left"]')
        .forEach((e) => bind(e, () => show(current - 1), "Ảnh trước"));
      gallery
        .querySelectorAll<HTMLElement>('[class*="arrow-right"]')
        .forEach((e) => bind(e, () => show(current + 1), "Ảnh tiếp"));
      let start = 0;
      const touchstart = (e: TouchEvent) => {
        start = e.changedTouches[0].clientX;
      };
      const touchend = (e: TouchEvent) => {
        const delta = e.changedTouches[0].clientX - start;
        if (Math.abs(delta) > 40) show(current + (delta < 0 ? 1 : -1));
      };
      gallery.addEventListener("touchstart", touchstart, { passive: true });
      gallery.addEventListener("touchend", touchend);
      removers.push(() => {
        gallery.removeEventListener("touchstart", touchstart);
        gallery.removeEventListener("touchend", touchend);
      });
      timers.push(
        setInterval(() => {
          if (!gallery.matches(":hover") && !document.hidden) show(current + 1);
        }, 5000),
      );
    }
    const music = musicButton.current;
    const audio = new Audio("/assets/wedding-music-ad5d477b4010.mp3");
    audio.loop = true;
    let playing = false;
    if (music) {
      music.role = "button";
      music.tabIndex = 0;
      music.setAttribute("aria-label", "Bật nhạc");
      let disposed = false;
      let manuallyPaused = false;
      const syncMusicButton = () => {
        playing = !audio.paused;
        music.setAttribute("aria-pressed", String(playing));
        music.setAttribute("aria-label", playing ? "Tắt nhạc" : "Bật nhạc");
        const on = music.querySelector<SVGElement>("#icon-on");
        const off = music.querySelector<SVGElement>("#icon-off");
        if (on) on.style.display = playing ? "block" : "none";
        if (off) off.style.display = playing ? "none" : "block";
      };
      const startMusic = async (automatic = false) => {
        try {
          await audio.play();
          if (disposed) {
            audio.pause();
            return;
          }
          syncMusicButton();
        } catch {
          if (!automatic && !disposed)
            setStatus("Không phát được nhạc. Bạn có thể thử lại.");
        }
      };
      const toggle = async () => {
        if (!audio.paused) {
          manuallyPaused = true;
          audio.pause();
          syncMusicButton();
        } else {
          manuallyPaused = false;
          await startMusic();
        }
      };
      // Browsers may require a gesture before allowing sound.
      void startMusic(true);
      const key = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          void toggle();
        }
      };
      const firstGesture = (e: PointerEvent) => {
        if (!music.contains(e.target as Node) && !playing && !manuallyPaused)
          void startMusic(true);
      };
      document.addEventListener("pointerdown", firstGesture, { once: true });
      removers.push(() =>
        document.removeEventListener("pointerdown", firstGesture),
      );
      music.addEventListener("click", toggle);
      music.addEventListener("keydown", key);
      removers.push(() => {
        disposed = true;
        audio.pause();
        music.removeEventListener("click", toggle);
        music.removeEventListener("keydown", key);
      });
    }
    const renderWishes = (wishes: Wish[]) => {
      const list = root.querySelector("#jmii-list");
      if (!list) return;
      list.replaceChildren();
      if (!wishes.length) {
        const empty = document.createElement("p");
        empty.className = "jmii-loading";
        empty.textContent = "Lời chúc của bạn sẽ được gửi riêng đến cô dâu hoặc chú rể.";
        list.append(empty);
      }
      for (const wish of wishes) {
        const article = document.createElement("article");
        article.className = "jmii-wish";
        const name = document.createElement("p");
        name.className = "jmii-name";
        name.textContent = wish.name;
        const message = document.createElement("p");
        message.className = "jmii-message";
        message.textContent = wish.message;
        article.append(name, message);
        list.append(article);
      }
    };
    const abort = new AbortController();
    if (!cover)
      fetch("/api/wishes", { signal: abort.signal })
        .then((r) => r.json())
        .then(renderWishes)
        .catch(() => {});
    const form = root.querySelector<HTMLFormElement>("form");
    if (form) {
      form
        .querySelectorAll<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >("input,textarea,select")
        .forEach((e) => {
          e.setAttribute(
            "aria-label",
            e.getAttribute("placeholder") ||
              (e instanceof HTMLSelectElement ? e.options[0]?.text : "") ||
              "Thông tin khách mời",
          );
          if (e.tagName === "SELECT") e.required = true;
          if (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement)
            e.maxLength = e.name === "message" ? 2000 : 100;
        });
      const guests = form.querySelector<HTMLInputElement>('[name="guests"]');
      if (guests) {
        guests.type = "number";
        guests.min = "1";
        guests.max = "20";
        guests.setAttribute("inputmode", "numeric");
      }
      const attendance = form.querySelector<HTMLSelectElement>('[name="form_item7"]');
      const syncGuests = () => {
        if (!guests) return;
        guests.disabled = attendance?.value === "Xin lỗi, Tôi bận rồi!";
        if (guests.disabled) guests.value = "";
      };
      syncGuests();
      attendance?.addEventListener("change", syncGuests);
      removers.push(() => attendance?.removeEventListener("change", syncGuests));
      let sending = false;
      const send = async (e: Event) => {
        e.preventDefault();
        if (sending || !form.reportValidity()) return;
        sending = true;
        setStatus("Đang gửi lời nhắn…");
        try {
          const fields = Object.fromEntries(new FormData(form));
          if (attendance?.value === "Xin lỗi, Tôi bận rồi!") fields.guests = "";
          const response = await fetch("/api/wishes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fields),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error);
          form.reset();
          syncGuests();
          setStatus("Đã gửi lời nhắn và xác nhận. Cảm ơn bạn!");
        } catch (error) {
          setStatus(
            error instanceof Error
              ? error.message
              : "Chưa gửi được lời nhắn. Vui lòng thử lại.",
          );
        } finally {
          sending = false;
        }
      };
      form.addEventListener("submit", send);
      const button = form.querySelector<HTMLElement>("#BUTTON2");
      const click = () => form.requestSubmit();
      if (button) {
        button.role = "button";
        button.tabIndex = 0;
        button.setAttribute("aria-label", "Gửi lời nhắn và xác nhận");
        button.addEventListener("click", click);
        const key = (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            click();
          }
        };
        button.addEventListener("keydown", key);
        removers.push(() => {
          button.removeEventListener("click", click);
          button.removeEventListener("keydown", key);
        });
      }
      removers.push(() => form.removeEventListener("submit", send));
    }
    return () => {
      abort.abort();
      observer.disconnect();
      timers.forEach(clearInterval);
      removers.forEach((f) => f());
    };
  }, [events, cover]);
  return (
    <>
      <main
        ref={host}
        className={`wedding-root ${cover ? "cover-root" : "invitation-root"}`}
      >
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </main>
      {slots.groom && createPortal(<FamilyMap side="groom" />, slots.groom)}
      {slots.bride && createPortal(<FamilyMap side="bride" />, slots.bride)}
      {slots.gift && createPortal(<WeddingGift />, slots.gift)}
      {!cover && (
        <button
          ref={musicButton}
          id="music-toggle"
          aria-label="Bật nhạc"
          aria-pressed="false"
        >
          <svg
            id="icon-on"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            style={{ display: "none" }}
          >
            <polygon points="3 9 7 9 11 5 11 19 7 15 3 15" />
            <path d="M14 9.5a3 3 0 0 1 0 5M16.5 7a6 6 0 0 1 0 10" />
          </svg>
          <svg
            id="icon-off"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <polygon points="3 9 7 9 11 5 11 19 7 15 3 15" />
            <path d="m16 8 5 5m0-5-5 5" />
          </svg>
        </button>
      )}
      <div
        className={`submission-status ${status ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {status}
        <button aria-label="Đóng thông báo" onClick={() => setStatus("")}>
          ×
        </button>
      </div>
    </>
  );
}
