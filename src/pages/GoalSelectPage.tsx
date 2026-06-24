import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import type { SavingGoal } from '../types';
import { formatWon } from '../utils/money';

interface GoalSelectPageProps {
  goals: SavingGoal[];
  cartTotalAmount: number;
  onCreateGoal: (title: string, targetAmount: number) => void;
  onSelectGoal: (goalId: string) => void;
  onGoCart: () => void;
}

export default function GoalSelectPage({
  goals,
  cartTotalAmount,
  onCreateGoal,
  onSelectGoal,
  onGoCart,
}: GoalSelectPageProps) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  const parsedTargetAmount = Number(targetAmount);
  const canCreate = title.trim().length > 0 && parsedTargetAmount > 0;

  function handleCreateGoal() {
    if (!canCreate) {
      return;
    }

    onCreateGoal(title.trim(), parsedTargetAmount);
    setTitle('');
    setTargetAmount('');
  }

  return (
    <main className="page goal-select-page">
      <header className="top-header">
        <div>
          <p className="eyebrow">저축 목표 선택</p>
          <h1>
            {formatWon(cartTotalAmount)}을
            <br />
            어디에 모을까요?
          </h1>
        </div>

        <button className="text-button" onClick={onGoCart} type="button">
          뒤로
        </button>
      </header>

      <Card className="goal-amount-card">
        <div className="goal-amount-icon">🐷</div>
        <div>
          <p className="label">이번 저축 전환 금액</p>
          <strong>{formatWon(cartTotalAmount)}</strong>
          <p className="muted">
            실제 계좌이체가 아닌 저축 목표 기록으로만 반영됩니다.
          </p>
        </div>
      </Card>

      <Card>
        <h2>기존 목표에 기록하기</h2>

        {goals.length === 0 ? (
          <p className="muted">
            아직 목표가 없습니다. 아래에서 새 목표를 만들어주세요.
          </p>
        ) : (
          <div className="goal-select-list">
            {goals.map((goal) => (
              <button
                className="goal-select-item"
                key={goal.id}
                onClick={() => onSelectGoal(goal.id)}
                type="button"
              >
                <div className="goal-select-top">
                  <div>
                    <strong>{goal.title}</strong>
                    <p className="muted">
                      {formatWon(goal.currentAmount)} /{' '}
                      {formatWon(goal.targetAmount)}
                    </p>
                  </div>

                  <span className="goal-select-arrow">선택</span>
                </div>

                <ProgressBar
                  currentAmount={goal.currentAmount}
                  targetAmount={goal.targetAmount}
                />
              </button>
            ))}
          </div>
        )}
      </Card>

      <Card className="create-goal-card">
        <h2>새 목표 만들기</h2>
        <p className="muted">
          여행, 비상금, 전자기기처럼 사고 싶은 마음을 모을 목표를 만들어보세요.
        </p>

        <label className="input-label">
          목표명
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="예: 여행 자금, 비상금, 새 노트북"
          />
        </label>

        <label className="input-label">
          목표금액
          <input
            value={targetAmount}
            onChange={(event) => setTargetAmount(event.target.value)}
            inputMode="numeric"
            placeholder="예: 1000000"
          />
        </label>

        <Button onClick={handleCreateGoal} disabled={!canCreate}>
          목표 만들기
        </Button>
      </Card>
    </main>
  );
}