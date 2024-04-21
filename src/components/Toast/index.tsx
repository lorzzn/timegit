"use client"

import useToastStore from "@/stores/toast"
import { randomString } from "@/utils/stringFuncs"
import { twclx } from "@/utils/twclx"
import { AnimatePresence, motion } from "framer-motion"
import React, { Key, useEffect } from "react"

type ToastProps = {
  uniqueId?: Key
  config?: {
    duration?: number
    role?: string
  }
  className?: string
  children?: React.ReactNode
}

export function Toast(props: ToastProps) {
  const { config = {}, className, children } = props
  const { duration = 3500, role = "status" } = config

  let uniqueId = props.uniqueId
  if (!uniqueId) {
    uniqueId = randomString(8)
  }

  const { toastList, close } = useToastStore.getState()

  const isShown = toastList?.has(uniqueId)

  useEffect(() => {
    if (!duration || !isShown) {
      return
    }

    const timeoutId = setTimeout(() => {
      close(uniqueId)
    }, duration)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [uniqueId, isShown, duration, close])

  return (
    <AnimatePresence>
      {isShown && (
        <motion.div
          key={uniqueId}
          layout
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.5 }}
          className={twclx("toast", className)}
          role={role}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
