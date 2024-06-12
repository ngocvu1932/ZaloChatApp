import { View, Text  } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';


export const ContactOA = ({navigation}) => {

  const [loadAgain, setLoadAgain] =useState();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus',  () => {
      setLoadAgain(new Date());
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={{backgroundColor: 'violet', height:"100%"}}>
      <Text>Contact OA</Text>
    </SafeAreaView>
  )
}