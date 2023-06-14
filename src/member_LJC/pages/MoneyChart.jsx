// 가계부 - 통계 페이지

// ****
// 일단 안쓰는 페이지
// ****

import React from 'react'
import { Link } from 'react-router-dom'

export default function MoneyChart() {
  return (
    <div>
      <div>
        <button>
          <Link to="/calendar/chart/income">수입</Link>
        </button>
        <button>
          <Link to="/calendar/chart/expense">지출</Link>
        </button>
      </div>
    </div>
  )
}
