import Button from '../components/Button';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import type { SavingGoal } from '../types';
import { formatWon } from '../utils/money';

interface GoalsPageProps {
  goals: SavingGoal[];
  onGoHome: () => void;
  onGoRecords: () => void;
}

export default function GoalsPage({
  goals,
  onGoHome,
  onGoRecords,
}: GoalsPageProps) {
  const totalGoalAmount = goals.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0
  );

  const totalCurrentAmount = goals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0
  );

  return (
    <main className="page goals-page">
      <header className="top-header">
        <div>
          <p className="eyebrow">내 저축 목표</p>
          <h1>
            사고 싶은 마음이
            <br />
            목표가 됩니다
          </h1>
        </div>

        <button className="text-button" onClick={onGoHome} type="button">
          홈
        </button>
      </header>

      <Card className="goals-summary-card">
        <div className="goals-summary-icon">🐷</div>

        <div>
          <p className="label">전체 목표 진행</p>
          <strong>{formatWon(totalCurrentAmount)}</strong>
          <p className="muted">전체 목표 금액 {formatWon(totalGoalAmount)}</p>
        </div>
      </Card>

      {goals.length === 0 ? (
        <Card className="empty-goal-card">
          <div className="empty-icon">🎯</div>
          <h2>아직 목표가 없어요</h2>
          <p className="muted">
            장바구니 금액을 저축으로 전환하면서 목표를 만들어보세요.
          </p>
        </Card>
      ) : (
        <div className="goal-list">
          {goals.map((goal) => {
            const percent =
              goal.targetAmount <= 0
                ? 0
                : Math.min(
                    Math.floor((goal.currentAmount / goal.targetAmount) * 100),
                    100
                  );

            const isCompleted = percent >= 100;

            return (
              <Card
                key={goal.id}
                className={`goal-card ${isCompleted ? 'goal-card-completed' : ''}`}
              >
                <div className="goal-card-top">
                  <div>
                    <p className="goal-status">
                      {isCompleted ? '목표 달성' : '진행 중'}
                    </p>
                    <h2>{goal.title}</h2>
                  </div>

                  <span className="goal-percent-chip">{percent}%</span>
                </div>

                <ProgressBar
                  currentAmount={goal.currentAmount}
                  targetAmount={goal.targetAmount}
                />

                <div className="goal-money-row">
                  <div>
                    <p>현재 기록 금액</p>
                    <strong>{formatWon(goal.currentAmount)}</strong>
                  </div>

                  <div>
                    <p>목표 금액</p>
                    <strong>{formatWon(goal.targetAmount)}</strong>
                  </div>
                </div>

                <p className="goal-helper-text">
                  이 목표에는 실제 계좌이체가 아닌 저축 기록만 반영됩니다.
                </p>
              </Card>
            );
          })}
        </div>
      )}

      <div className="action-stack">
        <Button onClick={onGoRecords}>저축 기록 보기</Button>
        <Button onClick={onGoHome} variant="secondary">
          홈으로 돌아가기
        </Button>
      </div>
    </main>
  );
}