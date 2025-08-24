import { View } from 'react-native'
import React, { useEffect } from 'react'
import CustomText from '../components/CustomText'
import { getStoreTimes } from '../api/StoreTimeAPI'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { getStoreOverrides } from '../api/StoreOverrides'

export default function HomeScreen() {
  useEffect(() => {
    getStoreTimesHandler()
  }, [])

  const getStoreTimesHandler = async () => {
    const data = await getStoreTimes();
    const data2 = await getStoreOverrides();
    console.log("store times", data);
    console.log("store override", data2)
  }

  return (
    <View>
      <Animated.View
        entering={FadeInDown}>
        <CustomText>HomeScreen</CustomText>
      </Animated.View>
    </View>
  )
}