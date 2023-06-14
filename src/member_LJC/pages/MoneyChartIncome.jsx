import React from 'react'
import { Link } from 'react-router-dom'

export default function MoneyChartIncome() {
    return (
        <div>
            <h1>수입</h1>
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
