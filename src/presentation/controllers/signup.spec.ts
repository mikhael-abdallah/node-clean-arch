import { SignUpController } from "./signup"

describe ("SignUp Controller", () => {
    test("Should return 400 if no name is provided", () => {
        const sut = new SignUpController() // system under test
        const httpRequest = {
            body: {
                // name: "Nome da pesssoa",
                email: "usuario@mail.com",
                birthDate: "2000-01-01"
            }

        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
    })
})