import * as React from 'react'
import { Text, TextInput, Button, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native-gesture-handler'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View className="flex-1 justify-center p-4 bg-white">
        <Text className="text-lg font-bold mb-4">Verify your email</Text>
        <TextInput
          className="border border-gray-300 p-2 mb-4 rounded"
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <Button title="Verify" onPress={onVerifyPress} color="#FDDF47" />
      </View>
    )
  }

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-lg font-bold mb-4">Sign up</Text>
      <TextInput
        className="border border-gray-300 p-2 mb-4 rounded"
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(email) => setEmailAddress(email)}
      />
      <TextInput
        className="border border-gray-300 p-2 mb-4 rounded"
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Button title="Continue" onPress={onSignUpPress} color="#FDDF47" />
      <View className="mt-4 flex-row justify-center">
        <Text className="mr-2">Already have an account?</Text>
        <Pressable onPress={() => router.push('/sign-in')}>
          <Text className="text-[#FDDF47]">Sign in</Text>
        </Pressable>
      </View>
    </View>
  )
}
