import { weddingConfig } from "../lib/wedding-config";
export default function FamilyMap({ side }: { side: "groom" | "bride" }) {
  const family = weddingConfig.families[side];
  const query = encodeURIComponent(family.address);
  return (
    <div className="family-map-card">
      <p className="family-address">{family.address}</p>
      <iframe
        title={`Bản đồ ${family.label.toLowerCase()}`}
        src={`https://maps.google.com/maps?q=${query}&z=14&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a
        className="directions-button"
        href={`https://www.google.com/maps/dir/?api=1&destination=${query}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chỉ đường đến ${family.label.toLowerCase()}`}
      >
        CHỈ ĐƯỜNG{" "}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      </a>
    </div>
  );
}
