export interface LinkStudentPerson {
  link: (id: number, registerCode: string) => Promise<boolean>
}
