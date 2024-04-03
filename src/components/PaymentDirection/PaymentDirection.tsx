import { useEffect } from 'react'

declare global {
  interface Window {
    SpiralPG: any
  }
}

const PaymentComponent = ({ session_id }: { session_id: string }) => {
  useEffect(() => {
    if (session_id) {
      // Ensure that the script is loaded before trying to use it
      const script = document.createElement('script')
      script.src = 'https://library-checkout.spiralplatform.com/js/v2/spiralpg.min.js'
      script.async = true
      script.onload = () => {
        if (window.SpiralPG) {
          window.SpiralPG.redirectToPay(session_id, { locale: 'en_US' })
        }
      }

      document.head.appendChild(script)
    }
  }, [session_id])

  return null // or any other JSX you want to render
}

export default PaymentComponent
