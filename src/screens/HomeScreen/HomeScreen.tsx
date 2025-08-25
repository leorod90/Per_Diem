import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomText from '../../components/CustomText'
import themes, { spacing } from '../../themes'
import DisplayStore from './DisplayStore'
import { useTimeStore } from '../../store/useTimeStore'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../types/DefaultScreenType'
import { StoreLogo } from '../../../assets/svg/store'

type HomeScreenNavProp = StackNavigationProp<RootStackParamList, "HomeScreen">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavProp>();
  const { fetchTimes, setSelectedTime } = useTimeStore();


  const getStoreTimesHandler = async () => {
    // const data = await getStoreTimes();
    // const data2 = await getStoreOverrides();
  }

  return (
    <View style={styles.container}>
      <DisplayStore />
      <StoreLogo width={80} height={80} color="#1E88E5" />

      <TouchableOpacity onPress={()=> navigation.navigate("TimeScreen")}><CustomText>press</CustomText></TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: themes.sizing.defaultPadding
  },
  timeZoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    gap: spacing(8),
    marginBottom: spacing(20),
  },
  timeZoneItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
  }
})