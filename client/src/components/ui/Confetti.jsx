import { useEffect, useRef } from 'react'

// Lightweight canvas confetti — no external dependency
export default function Confetti() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const COLORS = ['#C4A35A', '#8B6914', '#3D2B1F', '#E8DDD0', '#F5F0E8', '#5C3D11']
    const particles = []

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        speed: Math.random() * 3 + 2,
        rotSpeed: (Math.random() - 0.5) * 4,
        opacity: 1,
      })
    }

    let frame
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let allDone = true

      particles.forEach(p => {
        p.y += p.speed
        p.rotation += p.rotSpeed
        if (p.y < canvas.height + 20) allDone = false

        ctx.save()
        ctx.globalAlpha = Math.max(0, 1 - p.y / canvas.height)
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      })

      if (!allDone) {
        frame = requestAnimationFrame(draw)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    frame = requestAnimationFrame(draw)

    // Auto-cleanup after 5s
    const timeout = setTimeout(() => cancelAnimationFrame(frame), 5000)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
    />
  )
}
