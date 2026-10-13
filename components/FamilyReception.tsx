import { weddingConfig } from "../lib/wedding-config";
import styles from "./FamilyReception.module.css";
import template from "./HomeCover.module.css";

export default function FamilyReception() {
  return (
    <section className={`${template.papers} ${styles.papers}`} aria-label="Địa điểm và thời gian tiệc cưới">
      {(["groom", "bride"] as const).map((side) => {
        const family = weddingConfig.families[side];
        const groom = side === "groom";
        return (
          <article key={side} className={`${template.card} ${groom ? template.green : template.white} ${styles[side]}`}>
            <svg className={template.border} viewBox="0 0 240 340" preserveAspectRatio="none" aria-hidden="true">
              <path d="M18 10 H222 Q222 18 230 18 V322 Q222 322 222 330 H18 Q18 322 10 322 V18 Q18 18 18 10 Z" />
              <path d="M20 13 H220 Q220 21 227 21 V319 Q220 319 220 327 H20 Q20 319 13 319 V21 Q20 21 20 13 Z" />
            </svg>
            {groom && <div className={template.pearls} aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>}
            <div className={styles.content}>
              <p className={styles.kicker}>TẠI TƯ GIA {groom ? "NHÀ TRAI" : "NHÀ GÁI"}</p>
              <h3 className={styles.familyTitle} aria-label="H và B"><span>H</span><span className={styles.botanical}><img src="/assets/monogram-botanical.png" alt="" /></span><span>B</span></h3>
              <div className={styles.date} aria-label="Chủ Nhật, ngày 15 tháng 11 năm 2026"><div className={styles.dateRow}><span>NOV</span><span className={styles.day}>15</span><span>2026</span></div><p className={styles.weekday}>Chủ Nhật</p></div>
              <p className={styles.time}>{groom ? "16h00" : "10h30"}</p>
              <a className={styles.directions} href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(family.address)}`} target="_blank" rel="noopener noreferrer" aria-label={`Chỉ đường đến ${family.label.toLowerCase()}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fillRule="evenodd" d="M12 2a8 8 0 0 0-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 0 0-8-8Zm0 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" /></svg>
                CHỈ ĐƯỜNG
              </a>
              <p className={styles.honoured}>WE WOULD BE HONOURED TO SHARE<br />THIS SPECIAL DAY WITH YOU.</p>
            </div>
          </article>
        );
      })}
      <img className={`${styles.flower} ${styles.flowerTop}`} src="/assets/d35a475889087203.png" alt="" />
      <img className={`${styles.flower} ${styles.flowerBottom}`} src="/assets/eb443a43ab796b7a.png" alt="" />
    </section>
  );
}
