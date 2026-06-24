import Button from '../components/Button';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import type { SavingGoal, SavingRecord } from '../types';
import { formatWon } from '../utils/money';

interface CompletePageProps {
  latestRecord: SavingRecord | null;
  connectedGoal: SavingGoal | null;
  onGoProducts: () => void;
  onGoRecords: () => void;
  onGoHome: () => void;
}

export default function CompletePage({
  latestRecord,
  connectedGoal,
  onGoProducts,
  onGoRecords,
  onGoHome,
}: CompletePageProps) {
  if (!latestRecord) {
    return (
      <main className="page">
        <Card>
          <h1>저축 기록이 없습니다</h1>
          <p className="muted">상품을 담고 저축 기록을 만들어보세요.</p>
          <Button onClick={onGoHome}>홈으로</Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="page complete-page">
      <section className="complete-hero">
        <div className="pig-icon-complete">🐷</div>
        <h1>저축 전환이 완료되었습니다.</h1>
        <p>
          선택한 금액이 저축 목표에 반영되었습니다.
          <br />
          상품 배송은 발생하지 않습니다.
        </p>
      </section>

      <Card className="complete-amount-card">
        <div className="amount-line">
          <span>이번 전환 금액</span>
          <strong>{formatWon(latestRecord.amount)}</strong>
        </div>

        {connectedGoal && (
          <>
            <div className="divider" />
            <div className="amount-line">
              <span>연결된 목표</span>
              <strong>{connectedGoal.title}</strong>
            </div>
            <div className="divider" />
            <div className="amount-line">
              <span>목표 누적 금액</span>
              <strong>{formatWon(connectedGoal.currentAmount)}</strong>
            </div>
          </>
        )}
      </Card>

      {connectedGoal && (
        <Card>
          <p className="label">목표 진행률</p>
          <h2>{connectedGoal.title}</h2>

          <ProgressBar
            currentAmount={connectedGoal.currentAmount}
            targetAmount={connectedGoal.targetAmount}
          />

          <p className="muted">
            현재 {formatWon(connectedGoal.currentAmount)} / 목표{' '}
            {formatWon(connectedGoal.targetAmount)}
          </p>
        </Card>
      )}

      <Card className="placeholder-card">
        <p className="label">광고 영역</p>
        <h2>TODO: 인앱 광고 placeholder</h2>
        <p className="muted">
          앱인토스 인앱 광고 연동 시 이 영역을 광고 배너로 교체합니다.
        </p>
      </Card>

      <div className="action-stack">
        <Button onClick={onGoRecords}>저축 기록 보기</Button>
        <Button onClick={onGoProducts} variant="secondary">
          계속 둘러보기
        </Button>
        <Button onClick={onGoHome} variant="secondary">
          홈으로 돌아가기
        </Button>
      </div>
    </main>
  );
}