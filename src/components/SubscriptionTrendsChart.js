import { useEffect, useState } from "react"
import axios from "axios"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { api } from "../api"

function SubscriptionTrendsChart() {
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const res = await axios.get(api + "subscriptions/trends")

                const monthlyData = {}

                res.data.forEach(({ month, plan_name, statuses, count }) => {
                    if (!monthlyData[month]) {
                        monthlyData[month] = {
                            month,
                            Weekly_success: 0,
                            Weekly_cancelled: 0,
                            Monthly_success: 0,
                            Monthly_cancelled: 0,
                        }
                    }
                    // Compose keys dynamically based on plan_name and status
                    const statusKey = statuses === 1 ? 'success' : 'cancelled'
                    const key = `${plan_name}_${statusKey}`
                    monthlyData[month][key] = count
                })

                setData(Object.values(monthlyData))
            } catch (err) {
                console.error("Failed to fetch subscription trends", err)
            }
        }

        fetchTrends()
    }, [])


    return (
        <div style={{ marginTop: "40px" }}>
            <h2 style={{ marginBottom: "16px" }}>📈 Subscriptions Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`${value}`, name.replace(/_/g, ' ')]} />
                    <Legend />
                    <Bar dataKey="Monthly_cancelled" stackId="a" fill="#d9534f" name="Monthly Cancelled" />
                    <Bar dataKey="Monthly_success" stackId="a" fill="#5cb85c" name="Monthly Successful" />
                    <Bar dataKey="Weekly_cancelled" stackId="b" fill="#f0ad4e" name="Weekly Cancelled" />
                    <Bar dataKey="Weekly_success" stackId="b" fill="#0275d8" name="Weekly Successful" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default SubscriptionTrendsChart
