import { useCallback, useEffect, useRef, useState } from 'react'
import api from '../services/api.js'

const REFRESH_INTERVAL = 5000

export default function useDashboardData() {
  const [data, setData] = useState({ readings: [], userSummaries: [] })
  const [loading, setLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [error, setError] = useState('')
  const requestInFlight = useRef(false)
  const controllerRef = useRef(null)
  const timeoutRef = useRef(null)
  const pollCycleRef = useRef(0)

  const refresh = useCallback(async () => {
    if (requestInFlight.current) return

    requestInFlight.current = true
    const controller = new AbortController()
    controllerRef.current = controller

    try {
      const nextData = await api.getDashboardData({ signal: controller.signal })
      if (!controller.signal.aborted) {
        setData((current) => (
          JSON.stringify(current) === JSON.stringify(nextData) ? current : nextData
        ))
        setHasLoaded(true)
        setError('')
      }
    } catch (requestError) {
      if (!controller.signal.aborted) {
        setError(requestError instanceof Error ? requestError.message : 'No se pudo conectar con el servidor.')
      }
    } finally {
      if (!controller.signal.aborted) {
        requestInFlight.current = false
        controllerRef.current = null
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const pollCycle = pollCycleRef.current + 1
    pollCycleRef.current = pollCycle

    const poll = async () => {
      await refresh()
      if (pollCycleRef.current === pollCycle) {
        timeoutRef.current = window.setTimeout(poll, REFRESH_INTERVAL)
      }
    }

    poll()

    return () => {
      pollCycleRef.current += 1
      window.clearTimeout(timeoutRef.current)
      controllerRef.current?.abort()
      requestInFlight.current = false
    }
  }, [refresh])

  return { ...data, loading, hasLoaded, error, retry: refresh }
}
