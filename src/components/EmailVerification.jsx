import { useState, useEffect } from 'react'
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function EmailVerification({ email, onVerified, onSkip }) {
  const { verifyEmail, sendVerificationEmail, isLoading, error } = useAuth()
  const [verificationCode, setVerificationCode] = useState('')
  const [codeError, setCodeError] = useState(null)
  const [step, setStep] = useState('input') // input, success, error
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleVerify = async (e) => {
    e.preventDefault()
    setCodeError(null)

    if (!verificationCode || verificationCode.length !== 6) {
      setCodeError('Kode verifikasi harus 6 digit')
      return
    }

    try {
      const result = await verifyEmail(email, verificationCode)
      setStep('success')
      setTimeout(() => {
        onVerified?.()
      }, 2000)
    } catch (err) {
      setStep('error')
      setCodeError(err.message)
    }
  }

  const handleResend = async () => {
    try {
      await sendVerificationEmail(email)
      setCountdown(60)
      setCanResend(false)
      setVerificationCode('')
    } catch (err) {
      setCodeError('Gagal mengirim ulang kode')
    }
  }

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Terverifikasi!</h3>
        <p className="text-gray-600 text-sm text-center">
          Email Anda berhasil diverifikasi. Anda dapat melanjutkan penggunaan aplikasi.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Verifikasi Email</h2>
      </div>

      <p className="text-gray-600 mb-4">
        Kami telah mengirimkan kode verifikasi ke <span className="font-semibold">{email}</span>
      </p>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kode Verifikasi (6 digit)
          </label>
          <input
            type="text"
            maxLength="6"
            inputMode="numeric"
            value={verificationCode}
            onChange={(e) => {
              setVerificationCode(e.target.value.replace(/\D/g, ''))
              setCodeError(null)
            }}
            placeholder="000000"
            className="w-full text-center text-2xl tracking-widest px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          {codeError && (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {codeError}
            </div>
          )}
          {step === 'error' && (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              Kode verifikasi tidak valid
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || verificationCode.length !== 6}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <Loader className="w-4 h-4 animate-spin" />}
          Verifikasi Email
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-gray-600 text-sm mb-3">
          Tidak menerima kode?{' '}
          <button
            onClick={handleResend}
            disabled={!canResend || isLoading}
            className="text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {canResend ? 'Kirim ulang' : `Kirim ulang dalam ${countdown}s`}
          </button>
        </p>
      </div>

      {onSkip && (
        <button
          onClick={onSkip}
          className="w-full mt-3 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Lanjutkan Tanpa Verifikasi
        </button>
      )}
    </div>
  )
}
