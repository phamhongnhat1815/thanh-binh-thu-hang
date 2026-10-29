import styles from "./FamilyReception.module.css";

const receptions = [
  { side: "bride", title: "Tại Nhà Gái", time: "10H30", address: "Thôn Hoàng Chung, Hoằng Châu, Thanh Hóa" },
  { side: "groom", title: "Tại Nhà Trai", time: "16H", address: "Thôn Hải Châu, Hoằng Châu, Thanh Hóa" },
];

export default function FamilyReception() {
  return (
    <section className={styles.invitation} aria-label="Địa điểm và thời gian tiệc cưới">
      <h2 className={styles.heading}>
        Kính mời quý khách tới tham dự bữa cơm thân mật<br />
        chung vui cùng gia đình chúng tôi
      </h2>
      <div className={styles.families}>
        {receptions.map((reception) => (
          <article key={reception.side} className={styles.family}>
            <h3 className={styles.title}>{reception.title}</h3>
            <p className={styles.date}>Chủ Nhật, ngày 15 tháng 11 năm 2026<br />(Tức là ngày 07 tháng 10 năm Bính Ngọ)</p>
            <p className={styles.details}>Vào hồi {reception.time}<br /><span>{reception.address}</span></p>
            <a className={styles.directions} href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(reception.address)}`} target="_blank" rel="noopener noreferrer" aria-label={`Chỉ đường đến ${reception.title.toLowerCase()}`}>
              <svg viewBox="0 0 24 32" aria-hidden="true"><path d="M12 1a10 10 0 0 0-10 10c0 7 10 20 10 20s10-13 10-20A10 10 0 0 0 12 1Z" fill="currentColor" /><circle cx="12" cy="11" r="4" fill="white" /></svg>
              Chỉ đường
            </a>
          </article>
        ))}
      </div>
      <div className={styles.monogram} aria-label="Bình và Hằng, 16 tháng 11 năm 2026">
        <span className={styles.year} aria-hidden="true">16<br />11<br />26</span>
        <span className={styles.groom}>Bình</span>
        <span className={styles.and}>and</span>
        <span className={styles.bride}>Hằng</span>
      </div>
      <p className={styles.honor}>
        Sự góp mặt của quý khách là niềm vinh hạnh của gia đình chúng tôi
      </p>
    </section>
  );
}
