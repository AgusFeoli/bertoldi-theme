import { ComponentType } from 'react'

// Main Props

export interface DailyEventCountdownProps {
  enabled?: boolean
  image?: string
  backgroundColor?: string
  dailyMode?: DailyMode
  eventMode?: EventMode
  showFormSuscription?: boolean
  FormSuscription?: ComponentType
}

// Daily Mode

export interface DailyMode {
  items?: DailyModeItem[]
}

export interface DailyModeItem {
    text1?: string
  text2?: string
  /** Hora de inicio en formato HH:mm:ss */
  startHour?: string
}

// Event Mode

export interface EventMode {
  enabled?: boolean
  text1?: string
  text2?: string
  /** Fecha de inicio en formato YYYY-MM-DD */
  startDate?: string
  /** Fecha de finalizacion en formato YYYY-MM-DD */
  endDate?: string
}

// TimeLeft

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// CountdownProps

export interface CountdownProps {
  timeLeft: TimeLeft
}

// CountdownItemProps
export interface CountdownItemProps {
  label: string 
  tens: string 
  units: string 
}

// Holiday API
export interface Holiday {
  fecha: string;
  nombre: string;
  tipo: string;
}
