import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { MarkdownRenderer } from '../common'

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

const MarkdownViewPage = () => {
  const navigate = useNavigate()
  const query = useQuery()
  const path = query.get('path') || ''

  const [content, setContent] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    document.title = 'Document — Franck Rafiou'
    // Ensure new document views start at top
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    const load = async () => {
      if (!path) {
        setError('Missing document path')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const res = await fetch(path)
        if (!res.ok) throw new Error('Failed to fetch document')
        const text = await res.text()
        setContent(text)
        // After content loads, make sure we are at the document start
        requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }))
      } catch (e) {
        setError((e as Error).message || 'Failed to load document')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [path])

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="animate-pulse h-6 w-40 bg-jet rounded" />
        </div>
        <div className="animate-pulse h-4 w-full bg-jet rounded" />
        <div className="animate-pulse h-4 w-5/6 bg-jet rounded" />
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-6">
        <button onClick={() => navigate(-1)} className="text-orange-yellow hover:text-white-1 transition-colors flex items-center gap-2">
          <ArrowLeft size={18} /> Back
        </button>
        <p className="body-normal">{error}</p>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between max-w-3xl mx-auto w-full">
        <button onClick={() => navigate(-1)} className="text-orange-yellow hover:text-white-1 transition-colors flex items-center gap-2">
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <div className="bg-eerie-black-1 rounded-xl border border-white/10 p-6 max-w-3xl mx-auto">
        <MarkdownRenderer content={content} />
      </div>
    </section>
  )
}

export default MarkdownViewPage

