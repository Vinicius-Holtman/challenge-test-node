import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase"

let createUserUseCase: CreateUserUseCase
let usersRepositoryInMemory: InMemoryUsersRepository


describe("Create User", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })


  it ("should be able create a new user", () => {
    
  })
})