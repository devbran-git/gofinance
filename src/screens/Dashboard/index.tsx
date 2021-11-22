import React, { useState, useEffect, useCallback } from 'react'
import { ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTheme } from 'styled-components'

import { HighlightCard } from '../../components/HighLightCard'
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard'

import { getBottomSpace } from 'react-native-iphone-x-helper'

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer
} from './styles'

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string
}

interface HighlightData {
  entries: HighlightProps
  expenses: HighlightProps
  total: HighlightProps
}

export function Dashboard() {
  const [isLoading, setIsloading] = useState(true)
  const [transactions, setTransactions] = useState<DataListProps[]>([])
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData)

  const theme = useTheme()

  async function loadTransactions() {
    const dataKey = '@gofinance:transactions'
    const response = await AsyncStorage.getItem(dataKey)
    const transactions = response ? JSON.parse(response) : []

    let entriesTotal = 0
    let expensesTotal = 0

    const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {

      if (item.type === 'positive') {
        entriesTotal += Number(item.amount)
      } else {
        expensesTotal += Number(item.amount)
      }


      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })

      const date = new Date().toDateString()

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date
      }
    })

    setTransactions(transactionsFormatted)

    const total = entriesTotal - expensesTotal

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      },
      expenses: {
        amount: expensesTotal.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL'
        })
      },
      total: {
        amount: total.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL'
        })
      },
    })

    setIsloading(false)
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  useFocusEffect(useCallback(() => {
    loadTransactions()
  }, []))

  return (
    <>
      {isLoading ?
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size='large' />
        </LoadContainer>
        :
        <Container>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{ uri: 'https://github.com/devbran-git.png' }}
                />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>Evandro</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={() => { }}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              type="up"
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransaction="Última entrada dia 13 de abril"
            />
            <HighlightCard
              type="down"
              title="Saídas"
              amount={highlightData.expenses.amount}
              lastTransaction="Última saída dia 13 de abril"
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction="01 à 16 de abril"
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionList
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: getBottomSpace()
              }}
            />
          </Transactions>
        </Container>
      }
    </>
  )
}