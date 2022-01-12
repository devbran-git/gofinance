import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer,
} from './styles';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { addMonths, format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/native';

interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface TotalByCategory {
  key: string;
  name: string;
  color: string;
  total: number;
  totalFormatted: string;
  percent: string;
}

export function Resume() {
  const theme = useTheme();

  const [totalByCategories, setTotalByCategories] = useState<TotalByCategory[]>(
    []
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  function handleDateChange(action: 'prev' | 'next') {
    setIsLoading(true);

    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    const dataKey = '@gofinance:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expenses = responseFormatted.filter(
      (expense: TransactionData) =>
        expense.type === 'negative' &&
        new Date(expense.date).getMonth() === selectedDate.getMonth() &&
        new Date(expense.date).getFullYear() === selectedDate.getFullYear()
    );

    const expensesTotal = expenses.reduce(
      (accumulator: number, expense: TransactionData) => {
        return accumulator + Number(expense.amount);
      },
      0
    );

    const totalByCategory: TotalByCategory[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expenses.forEach((expense: TransactionData) => {
        if (expense.category === category.key) {
          categorySum += Number(expense.amount);
        }
      });

      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        const percent = `${((categorySum / expensesTotal) * 100).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted,
          percent,
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );
  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      <Content>
        {isLoading ? (
          <LoadContainer>
            <ActivityIndicator color={theme.colors.primary} size='large' />
          </LoadContainer>
        ) : (
          <>
            <MonthSelect>
              <MonthSelectButton onPress={() => handleDateChange('prev')}>
                <MonthSelectIcon name='chevron-left' />
              </MonthSelectButton>

              <Month>
                {format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}
              </Month>

              <MonthSelectButton onPress={() => handleDateChange('next')}>
                <MonthSelectIcon name='chevron-right' />
              </MonthSelectButton>
            </MonthSelect>

            <ChartContainer>
              <VictoryPie
                data={totalByCategories}
                x='percent'
                y='total'
                colorScale={totalByCategories.map((category) => category.color)}
                labelRadius={99}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    fill: theme.colors.shape,
                  },
                }}
              />
            </ChartContainer>
            {totalByCategories.map((category) => (
              <HistoryCard
                key={category.key}
                title={category.name}
                amount={category.totalFormatted}
                color={category.color}
              />
            ))}
          </>
        )}
      </Content>
    </Container>
  );
}
