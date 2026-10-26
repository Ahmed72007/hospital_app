import hospitalsJson from '../data/hospitals.json'
import departmentsJson from '../data/departments.json'
import doctorsJson from '../data/doctors.json'
import typesJson from '../data/types.json'
import tipsJson from '../data/tips.json'
import type { Department, DeptType, Doctor, Hospital, L10nList } from './types'

export const hospitals = hospitalsJson as Hospital[]
export const deptTypes = typesJson as Record<string, DeptType>
const departments = departmentsJson as Department[]
const doctors = doctorsJson as Doctor[]
const tips = tipsJson as Record<string, L10nList>

export const deptsOf = (hospitalId: string) => departments.filter((d) => d.hospitalId === hospitalId)
export const findDept = (hospitalId: string, typeId: string) =>
  departments.find((d) => d.hospitalId === hospitalId && d.typeId === typeId) ?? null
export const doctorsOf = (deptId: string) => doctors.filter((d) => d.departmentId === deptId)
export const tipsOf = (typeId: string) => tips[typeId]

export function nearestHospital(lat: number, lng: number): Hospital {
  const dist = (h: Hospital) => (h.lat - lat) ** 2 + (h.lng - lng) ** 2 // fine for a demo
  return [...hospitals].sort((a, b) => dist(a) - dist(b))[0]
}
