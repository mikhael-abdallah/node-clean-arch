export interface LinkStudentPersonModel {
  id: number
  registerCode: string
}

export interface LinkStudentPerson {
  link: (linkStudentPerson: LinkStudentPersonModel) => Promise<boolean>
}
