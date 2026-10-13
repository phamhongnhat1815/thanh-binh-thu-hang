"use client";

import { useEffect, useRef, useState } from "react";
import Wedding from "./Wedding";
import events from "../lib/cover-events.json";
import styles from "./HomeCover.module.css";

function CardBorder() {
  return <svg className={styles.border} viewBox="0 0 240 340" preserveAspectRatio="none" aria-hidden="true">
    <path d="M18 10 H222 Q222 18 230 18 V322 Q222 322 222 330 H18 Q18 322 10 322 V18 Q18 18 18 10 Z" />
    <path d="M20 13 H220 Q220 21 227 21 V319 Q220 319 220 327 H20 Q20 319 13 319 V21 Q20 21 20 13 Z" />
  </svg>;
}

export default function HomeCover({ html }: { html: string }) {
  const [opened, setOpened] = useState(false);
  const preview = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (opened) {
      window.scrollTo({ top: 0, behavior: "instant" });
      preview.current?.focus({ preventScroll: true });
    }
  }, [opened]);

  if (!opened) return (
    <div onClick={(event) => {
      const target = event.target as HTMLElement;
      if (target.closest('a[href="/invitation"]')) {
        event.preventDefault();
        setOpened(true);
      }
    }}>
      <Wedding html={html} events={events} cover />
    </div>
  );

  return (
    <main className={styles.scene}>
      <div ref={preview} tabIndex={-1} className={styles.papers} aria-label="Thiệp cưới theo mẫu">
        <article className={`${styles.card} ${styles.green}`} aria-label="Thiệp xanh Liam và Scarlett">
          <CardBorder />
          <div className={styles.pearls} aria-hidden="true">
            <i /><i /><i /><i /><i /><i /><i /><i /><i />
          </div>
          <p className={styles.invite}>PLEASE JOIN US FOR<br />THE WEDDING OF</p>
          <p className={styles.names}><span>Liam</span><span className={styles.ampersand}>&amp;</span><span>Scarlett</span></p>
        </article>
        <article className={`${styles.card} ${styles.white}`} aria-label="Ngày và địa điểm tiệc cưới">
          <CardBorder />
          <p className={styles.day}>11</p>
          <p className={styles.month}>August</p>
          <p className={styles.year}>2027</p>
          <p className={styles.venue}>AT 3:45PM<br />CABLE BAY VINEYARD,<br />WAIHEKE ISLAND</p>
        </article>
      </div>
    </main>
  );
}
