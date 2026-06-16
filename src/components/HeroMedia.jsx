import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Icon from './Icon.jsx'
import './HeroMedia.css'

export default function HeroMedia({ poster, videoMobile, videoDesktop }) {
  const reduceMotion = useReducedMotion()
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (reduceMotion && videoRef.current) {
      videoRef.current.pause()
      setPlaying(false)
    }
  }, [reduceMotion])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  if (reduceMotion) {
    return (
      <img
        src={poster}
        alt=""
        className="hero__video hero__video--poster"
        aria-hidden="true"
      />
    )
  }

  return (
    <>
      <video
        ref={videoRef}
        className="hero__video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={videoMobile} type="video/mp4" media="(max-width: 768px)" />
        <source src={videoDesktop} type="video/mp4" />
      </video>
      <button
        type="button"
        className="hero__video-toggle"
        onClick={togglePlayback}
        aria-label={playing ? 'Hintergrundvideo pausieren' : 'Hintergrundvideo abspielen'}
        aria-pressed={!playing}
      >
        <Icon name={playing ? 'Pause' : 'Play'} />
      </button>
    </>
  )
}
