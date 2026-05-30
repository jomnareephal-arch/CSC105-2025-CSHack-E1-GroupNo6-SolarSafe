const TIPS = [
  "A wide-brimmed hat provides twice the protection of a standard cap!",
  "Apply sunscreen 15-30 minutes before going outside for best protection.",
  "UV rays can penetrate clouds — wear protection even on overcast days.",
  "Reapply sunscreen every 2 hours, or after swimming or sweating.",
  "Sunglasses block up to 99% of UV radiation when rated UV400.",
];

function getDailyTip(): string {
  return TIPS[new Date().getDate() % TIPS.length];
}

export default function DailyTipCard() {
  return (
    <div className="rounded-2xl p-3 shadow-sm" style={{ backgroundColor: "#89AA95" }}>
      <p className="mb-1 text-xs font-semibold" style={{ color: "#213F2F" }}>Daily Tip</p>
      <p className="text-xs italic leading-relaxed" style={{ color: "#213F2F" }}>
        "{getDailyTip()}"
      </p>
    </div>
  );
}
