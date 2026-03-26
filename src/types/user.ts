export type Gender = "boy" | "girl"

export type Profile = {
  id: string
  lastName: string
  firstName: string
  childName: string
  childNickname: string
  childGender: Gender
  createdAt: string
  updatedAt: string
}

export type RegisterFormValues = {
  email: string
  password: string
  lastName: string
  firstName: string
  childName: string
  childNickname: string
  childGender: Gender
}

export type RegisterFieldErrors = Partial<Record<keyof RegisterFormValues, string[]>>
