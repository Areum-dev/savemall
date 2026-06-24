import Button from '../components/Button';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import type { SavingGoal, SavingRecord } from '../types';
import { formatWon, getTodayKey } from '../utils/money';

interface HomePageProps {
  goals: SavingGoal[];
  records: SavingRecord[];
  onGoProducts: () => void;
  onGoGoals: () => void;
  onGoRecords: () => void;
}

export default function HomePage({
  goals,
  records,
  onGoProducts,
  onGoGoals,
  onGoRecords,
}: HomePageProps) {
  const todayKey = getTodayKey();

  const todayAmount = records
    .filter((record) => record.createdAt.slice(0, 10) === todayKey)
    .reduce((sum, record) => sum + record.amount, 0);

  const totalAmount = records.reduce((sum, record) => sum + record.amount, 0);

  const mainGoal = goals[0];

  return (
    <main className="page home-page">
      <section className="home-blue-header">
        <div className="home-top-row">
          <div className="home-logo">
            <span>🐷</span>
          </div>
          <div>
            <p className="home-brand">세이브몰</p>
            <p className="home-sub">구매 충동을 저축 습관으로</p>
          </div>
        </div>

        <h1>
          담으면 소비,
          <br />
          전환하면 저축
        </h1>

        <p>
          사고 싶은 상품을 담고 실제 구매 대신 저축 목표에 기록해보세요.
        </p>
      </section>

      <Card className="summary-card home-summary-card">
        <p className="label">오늘 아낀 금액</p>
        <strong className="big-number">{formatWon(todayAmount)}</strong>
        <p className="muted">누적 저축 전환 금액 {formatWon(totalAmount)}</p>
      </Card>

      {mainGoal ? (
        <Card>
          <div className="section-title-row">
            <div>
              <p className="label">진행 중인 목표</p>
              <h2>{mainGoal.title}</h2>
            </div>
            <span className="chip">{formatWon(mainGoal.targetAmount)}</span>
          </div>

          <ProgressBar
            currentAmount={mainGoal.currentAmount}
            targetAmount={mainGoal.targetAmount}
          />

          <p className="muted">
            현재 {formatWon(mainGoal.currentAmount)} 모았어요.
          </p>
        </Card>
      ) : (
        <Card>
          <h2>아직 저축 목표가 없어요</h2>
          <p className="muted">목표를 만들고 장바구니 금액을 기록해보세요.</p>
        </Card>
      )}

      <div className="action-stack">
        <Button onClick={onGoProducts}>상품 둘러보기</Button>
        <Button onClick={onGoGoals} variant="secondary">
          내 저축 목표
        </Button>
        <Button onClick={onGoRecords} variant="secondary">
          저축 기록 보기
        </Button>
      </div>

      <Card className="notice-card-blue">
        <h2>구매가 아닌 저축 전환입니다.</h2>
        <p>
          세이브몰에서는 실제 결제와 상품 배송이 발생하지 않습니다. 장바구니는
          소비 욕구를 저축으로 바꾸기 위한 기록 도구입니다.
        </p>
      </Card>

      <Card className="placeholder-card">
        <p className="label">추천 챌린지</p>
        <h2>7일 배달음식 참기</h2>
        <p className="muted">
          TODO: 추후 인앱 광고, 브랜드 챌린지, AI 소비 코치로 확장할 영역입니다.
        </p>
      </Card>
    </main>
  );
}