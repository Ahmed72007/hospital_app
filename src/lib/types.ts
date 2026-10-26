import type { LangId, Strings } from '../i18n'

export type L10n = Record<LangId, string>
export type L10nList = Record<LangId, string[]>
export type T = (key: keyof Strings) => string

export interface Hospital {
  id: string
  name: L10n
  address: L10n
  lat: number
  lng: number
  phone: string
  emergencyPhone: string
  dataNote?: string
}
export interface Department {
  id: string
  hospitalId: string
  typeId: string
  name: L10n
  floor: string
  wing: L10n
  directions: L10nList
  phone: string
  timings: L10n
}
export interface Doctor {
  id: string
  departmentId: string
  name: string
  specialty: L10n
  days: L10n
  timings: L10n
}
export interface DeptType {
  icon: string
  color: string
  name: L10n
}
// What the result screen shows. dept is null when the hospital has no such department.
export interface Result {
  typeId: string
  dept: Department | null
  urgent: boolean
}
