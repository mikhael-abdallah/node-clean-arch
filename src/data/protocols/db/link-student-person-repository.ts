export interface LinkStudentPersonRepository {
  link: (id: number) => Promise<boolean>
}
