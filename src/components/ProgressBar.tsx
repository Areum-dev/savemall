interface ProgressBarProps {
  currentAmount: number;
  targetAmount: number;
}

export default function ProgressBar({
  currentAmount,
  targetAmount,
}: ProgressBarProps) {
  const rawPercent =
    targetAmount <= 0 ? 0 : Math.floor((currentAmount / targetAmount) * 100);

  const percent = Math.min(rawPercent, 100);

  return (
    <div className="progress-wrap" aria-label={`저축 진행률 ${percent}%`}>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="progress-text">{percent}% 달성</p>
    </div>
  );
}