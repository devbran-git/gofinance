import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { HistoryCard } from '../../components/HistoryCard'
import { categories } from '../../utils/categories'

import { Container, Header, Title, Content } from './styles'

interface TransactionData {
  type: 'positive' | 'negative'
  name: string
  amount: string
  category: string
  date: string
}

interface TotalByCategory {
  key: string
  name: string
  color: string
  total: string
}

export function Resume() {
  const [totalByCategories, setTotalByCategories] = useState<TotalByCategory[]>([])

  async function loadData() {
    const dataKey = '@gofinance:transactions'
    const response = await AsyncStorage.getItem(dataKey)
    const responseFormatted = response ? JSON.parse(response) : []

    const expenses = responseFormatted.filter((expense: TransactionData) => expense.type === 'negative')

    const totalByCategory: TotalByCategory[] = []

    categories.forEach(category => {
      let categorySum = 0

      expenses.forEach((expense: TransactionData) => {
        if (expense.category === category.key) {
          categorySum += Number(expense.amount)
        }
      })

      if (categorySum > 0) {
        const total = categorySum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total,
        })
      }
    })

    setTotalByCategories(totalByCategory)
  }

  useEffect(() => {
    loadData()
  }, [])
  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <Content>
        {
          totalByCategories.map(category => <HistoryCard
            key={category.key}
            title={category.name}
            amount={category.total}
            color={category.color}
          />
          )
        }
      </Content>
    </Container>
  )
}